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
