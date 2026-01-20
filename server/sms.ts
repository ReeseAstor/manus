import { getDb } from "./db";
import { smsTemplates, smsMessageLog, userSmsPreferences } from "../drizzle/schema";
import { eq } from "drizzle-orm";

// Twilio client lazy initialization
let twilioClient: any = null;

async function getTwilioClient() {
  if (!twilioClient) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    
    if (!accountSid || !authToken) {
      throw new Error("Twilio credentials not configured");
    }
    
    const twilio = await import("twilio");
    twilioClient = twilio.default(accountSid, authToken);
  }
  return twilioClient;
}

// Template variable replacement
function replaceTemplateVariables(template: string, variables: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
  }
  return result;
}

// Send SMS using a template
export async function sendSmsFromTemplate(
  templateSlug: string,
  toPhoneNumber: string,
  variables: Record<string, string>,
  userId?: number
): Promise<{ success: boolean; sid?: string; error?: string }> {
  const db = await getDb();
  if (!db) throw new Error("Database not initialized");
  
  try {
    // Get template
    const [template] = await db
      .select()
      .from(smsTemplates)
      .where(eq(smsTemplates.slug, templateSlug));
    
    if (!template) {
      throw new Error(`Template '${templateSlug}' not found`);
    }
    
    if (!template.isActive) {
      throw new Error(`Template '${templateSlug}' is not active`);
    }
    
    // Replace variables in template
    const messageBody = replaceTemplateVariables(template.messageTemplate, variables);
    
    // Send SMS
    const client = await getTwilioClient();
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;
    
    const message = await client.messages.create({
      body: messageBody,
      from: fromNumber,
      to: toPhoneNumber,
    });
    
    // Log the message
    await db.insert(smsMessageLog).values({
      userId: userId || null,
      templateId: template.id,
      toPhoneNumber,
      messageBody,
      twilioSid: message.sid,
      status: message.status || "queued",
    });
    
    console.log(`[SMS] Sent message using template '${templateSlug}' to ${toPhoneNumber}`);
    
    return { success: true, sid: message.sid };
  } catch (error: any) {
    console.error(`[SMS] Error sending message:`, error.message);
    
    // Log failed attempt
    try {
      await db.insert(smsMessageLog).values({
        userId: userId || null,
        toPhoneNumber,
        messageBody: `Failed to send: ${templateSlug}`,
        status: "failed",
        errorMessage: error.message,
      });
    } catch (logError) {
      console.error("[SMS] Failed to log error:", logError);
    }
    
    return { success: false, error: error.message };
  }
}

// Send direct SMS (without template)
export async function sendDirectSms(
  toPhoneNumber: string,
  messageBody: string,
  userId?: number
): Promise<{ success: boolean; sid?: string; error?: string }> {
  const db = await getDb();
  if (!db) throw new Error("Database not initialized");
  
  try {
    const client = await getTwilioClient();
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;
    
    const message = await client.messages.create({
      body: messageBody,
      from: fromNumber,
      to: toPhoneNumber,
    });
    
    // Log the message
    await db.insert(smsMessageLog).values({
      userId: userId || null,
      toPhoneNumber,
      messageBody,
      twilioSid: message.sid,
      status: message.status || "queued",
    });
    
    console.log(`[SMS] Sent direct message to ${toPhoneNumber}`);
    
    return { success: true, sid: message.sid };
  } catch (error: any) {
    console.error(`[SMS] Error sending direct message:`, error.message);
    
    return { success: false, error: error.message };
  }
}

// Get user SMS preferences
export async function getUserSmsPreferences(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not initialized");
  const [prefs] = await db
    .select()
    .from(userSmsPreferences)
    .where(eq(userSmsPreferences.userId, userId));
  return prefs;
}

// Update user SMS preferences
export async function upsertUserSmsPreferences(
  userId: number,
  preferences: Partial<{
    phoneNumber: string;
    smsOptIn: boolean;
    smsNewReleases: boolean;
    smsVipAlerts: boolean;
    smsOrderUpdates: boolean;
    smsMarketing: boolean;
  }>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not initialized");
  
  const existing = await getUserSmsPreferences(userId);
  
  if (existing) {
    await db
      .update(userSmsPreferences)
      .set(preferences)
      .where(eq(userSmsPreferences.userId, userId));
  } else {
    await db.insert(userSmsPreferences).values({
      userId,
      ...preferences,
    });
  }
}

// Check if user has opted in for a specific SMS type
export async function canSendSmsToUser(
  userId: number,
  smsType: "newReleases" | "vipAlerts" | "orderUpdates" | "marketing"
): Promise<{ canSend: boolean; phoneNumber?: string }> {
  const prefs = await getUserSmsPreferences(userId);
  
  if (!prefs || !prefs.smsOptIn || !prefs.phoneNumber) {
    return { canSend: false };
  }
  
  const typeMap = {
    newReleases: prefs.smsNewReleases,
    vipAlerts: prefs.smsVipAlerts,
    orderUpdates: prefs.smsOrderUpdates,
    marketing: prefs.smsMarketing,
  };
  
  return {
    canSend: typeMap[smsType],
    phoneNumber: prefs.phoneNumber,
  };
}

// Send VIP welcome SMS
export async function sendVipWelcomeSms(userId: number, memberName: string, tierName: string) {
  const { canSend, phoneNumber } = await canSendSmsToUser(userId, "vipAlerts");
  
  if (!canSend || !phoneNumber) {
    console.log(`[SMS] User ${userId} has not opted in for VIP alerts`);
    return { success: false, reason: "not_opted_in" };
  }
  
  return sendSmsFromTemplate("vip-welcome", phoneNumber, {
    name: memberName,
    tier: tierName,
  }, userId);
}

// Send new story release SMS
export async function sendNewStoryReleaseSms(userId: number, memberName: string, storyTitle: string) {
  const { canSend, phoneNumber } = await canSendSmsToUser(userId, "newReleases");
  
  if (!canSend || !phoneNumber) {
    return { success: false, reason: "not_opted_in" };
  }
  
  return sendSmsFromTemplate("new-story-release", phoneNumber, {
    name: memberName,
    storyTitle,
  }, userId);
}

// Send order confirmation SMS
export async function sendOrderConfirmationSms(userId: number, orderNumber: string, itemName: string) {
  const { canSend, phoneNumber } = await canSendSmsToUser(userId, "orderUpdates");
  
  if (!canSend || !phoneNumber) {
    return { success: false, reason: "not_opted_in" };
  }
  
  return sendSmsFromTemplate("order-confirmation", phoneNumber, {
    orderNumber,
    itemName,
  }, userId);
}

// Get all templates
export async function getAllSmsTemplates() {
  const db = await getDb();
  if (!db) throw new Error("Database not initialized");
  return db.select().from(smsTemplates);
}

// Create or update template
export async function upsertSmsTemplate(template: {
  slug: string;
  name: string;
  description?: string;
  messageTemplate: string;
  category: "vip" | "order" | "marketing" | "system";
  isActive?: boolean;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not initialized");
  
  const [existing] = await db
    .select()
    .from(smsTemplates)
    .where(eq(smsTemplates.slug, template.slug));
  
  if (existing) {
    await db
      .update(smsTemplates)
      .set(template)
      .where(eq(smsTemplates.slug, template.slug));
    return { ...existing, ...template };
  } else {
    const [result] = await db.insert(smsTemplates).values(template);
    return { id: result.insertId, ...template };
  }
}
