import Stripe from "stripe";
import { ENV } from "./env";

if (!ENV.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set in environment variables");
}

export const stripe = new Stripe(ENV.STRIPE_SECRET_KEY, {
  apiVersion: "2025-11-17.clover",
  typescript: true,
});

export const STRIPE_WEBHOOK_SECRET = ENV.STRIPE_WEBHOOK_SECRET;
