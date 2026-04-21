import axios from "axios";

const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY;
const MAILERLITE_API_URL = "https://connect.mailerlite.com/api";

interface SubscriberData {
  email: string;
  fields?: {
    name?: string;
    [key: string]: string | undefined;
  };
  groups?: string[];
}

interface MailerLiteResponse {
  success: boolean;
  message: string;
  data?: any;
}

/**
 * Subscribe a user to MailerLite
 */
export async function subscribeToMailerLite(
  email: string,
  name?: string,
  groupId?: string
): Promise<MailerLiteResponse> {
  if (!MAILERLITE_API_KEY) {
    console.error("MailerLite API key is not configured");
    return {
      success: false,
      message: "Newsletter service is not configured",
    };
  }

  try {
    const subscriberData: SubscriberData = {
      email,
      fields: name ? { name } : undefined,
      groups: groupId ? [groupId] : undefined,
    };

    const response = await axios.post(
      `${MAILERLITE_API_URL}/subscribers`,
      subscriberData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${MAILERLITE_API_KEY}`,
          Accept: "application/json",
        },
      }
    );

    return {
      success: true,
      message: "Successfully subscribed to newsletter",
      data: response.data,
    };
  } catch (error: any) {
    console.error("MailerLite subscription error:", error.response?.data || error.message);

    // Handle specific error cases
    if (error.response?.status === 422) {
      const errorMessage = error.response?.data?.message || "Invalid email address";
      return {
        success: false,
        message: errorMessage,
      };
    }

    if (error.response?.status === 409) {
      return {
        success: true,
        message: "You're already subscribed to our newsletter",
      };
    }

    return {
      success: false,
      message: "Failed to subscribe. Please try again later.",
    };
  }
}

/**
 * Get subscriber groups from MailerLite
 */
export async function getMailerLiteGroups() {
  if (!MAILERLITE_API_KEY) {
    throw new Error("MailerLite API key is not configured");
  }

  try {
    const response = await axios.get(`${MAILERLITE_API_URL}/groups`, {
      headers: {
        Authorization: `Bearer ${MAILERLITE_API_KEY}`,
        Accept: "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch MailerLite groups:", error.response?.data || error.message);
    throw error;
  }
}

/**
 * Send a campaign via MailerLite
 */
export async function sendMailerLiteCampaign(
  subject: string,
  htmlContent: string,
  groupId?: string
): Promise<MailerLiteResponse> {
  if (!MAILERLITE_API_KEY) {
    console.error("MailerLite API key is not configured");
    return {
      success: false,
      message: "Newsletter service is not configured",
    };
  }

  try {
    // Create campaign
    const campaignData = {
      name: subject,
      type: "regular",
      emails: [
        {
          subject,
          from_name: "Reese Astor",
          from: "hello@reeseastor.com", // Update with your actual sender email
          content: htmlContent,
        },
      ],
      groups: groupId ? [groupId] : undefined,
    };

    const createResponse = await axios.post(
      `${MAILERLITE_API_URL}/campaigns`,
      campaignData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${MAILERLITE_API_KEY}`,
          Accept: "application/json",
        },
      }
    );

    const campaignId = createResponse.data.data.id;

    // Schedule campaign for immediate sending
    await axios.post(
      `${MAILERLITE_API_URL}/campaigns/${campaignId}/schedule`,
      {
        delivery: "instant",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${MAILERLITE_API_KEY}`,
          Accept: "application/json",
        },
      }
    );

    return {
      success: true,
      message: "Campaign sent successfully",
      data: createResponse.data,
    };
  } catch (error: any) {
    console.error("MailerLite campaign error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to send campaign. Please try again later.",
    };
  }
}

/**
 * Update a subscriber's fields and groups in MailerLite
 * Used to tag buyers, update purchase history, etc.
 */
export async function updateMailerLiteSubscriber(
  email: string,
  fields?: Record<string, string>,
  groupsToAdd?: string[],
  groupsToRemove?: string[]
): Promise<MailerLiteResponse> {
  if (!MAILERLITE_API_KEY) {
    console.error("MailerLite API key is not configured");
    return { success: false, message: "Newsletter service is not configured" };
  }

  try {
    // Update subscriber fields and groups
    const updateData: any = { email };
    if (fields) updateData.fields = fields;
    if (groupsToAdd) updateData.groups = groupsToAdd;

    const response = await axios.put(
      `${MAILERLITE_API_URL}/subscribers/${encodeURIComponent(email)}`,
      updateData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${MAILERLITE_API_KEY}`,
          Accept: "application/json",
        },
      }
    );

    // Remove from groups if specified
    if (groupsToRemove && response.data?.data?.id) {
      const subscriberId = response.data.data.id;
      for (const groupId of groupsToRemove) {
        try {
          await axios.delete(
            `${MAILERLITE_API_URL}/subscribers/${subscriberId}/groups/${groupId}`,
            {
              headers: {
                Authorization: `Bearer ${MAILERLITE_API_KEY}`,
                Accept: "application/json",
              },
            }
          );
        } catch (e) {
          // Group removal is best-effort
          console.warn(`Failed to remove subscriber from group ${groupId}`);
        }
      }
    }

    return {
      success: true,
      message: "Subscriber updated successfully",
      data: response.data,
    };
  } catch (error: any) {
    console.error("MailerLite update error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to update subscriber",
    };
  }
}

/**
 * Create a group in MailerLite (if it doesn't exist)
 */
export async function createMailerLiteGroup(name: string): Promise<string | null> {
  if (!MAILERLITE_API_KEY) return null;

  try {
    // First check if group exists
    const groups = await getMailerLiteGroups();
    const existing = groups?.data?.find((g: any) => g.name === name);
    if (existing) return existing.id;

    // Create new group
    const response = await axios.post(
      `${MAILERLITE_API_URL}/groups`,
      { name },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${MAILERLITE_API_KEY}`,
          Accept: "application/json",
        },
      }
    );
    return response.data?.data?.id || null;
  } catch (error: any) {
    console.error("Failed to create MailerLite group:", error.response?.data || error.message);
    return null;
  }
}

/**
 * Get all active subscribers from MailerLite
 */
export async function getMailerLiteSubscribers(groupId?: string) {
  if (!MAILERLITE_API_KEY) {
    throw new Error("MailerLite API key is not configured");
  }

  try {
    const url = groupId
      ? `${MAILERLITE_API_URL}/groups/${groupId}/subscribers`
      : `${MAILERLITE_API_URL}/subscribers`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${MAILERLITE_API_KEY}`,
        Accept: "application/json",
      },
      params: {
        filter: { status: "active" },
        limit: 1000,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch MailerLite subscribers:", error.response?.data || error.message);
    throw error;
  }
}
