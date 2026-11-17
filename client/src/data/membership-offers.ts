import { AMAZON_ASSOCIATE_TAG } from "../lib/amazon-tag";

export type MembershipOfferKey = "audible_trial" | "kindle_unlimited_gift";

export type MembershipOffer = {
  key: MembershipOfferKey;
  label: string;
  detail: string;
  href: string;
};

/**
 * Amazon membership landing pages, paid by bounty rather than by commission.
 * withAmazonTag() only tags /dp, /gp/product and /gp/aw/d paths, so these
 * carry the associate tag in the literal URL.
 */
export const MEMBERSHIP_OFFERS: readonly MembershipOffer[] = [
  {
    key: "audible_trial",
    label: "Start an Audible free trial",
    detail: "Listen to romance narrated by professional voice actors.",
    href: `https://www.amazon.com/hz/audible/mlp?tag=${AMAZON_ASSOCIATE_TAG}`,
  },
  {
    key: "kindle_unlimited_gift",
    label: "Gift Kindle Unlimited",
    detail: "Give a reader access to the whole Kindle Unlimited catalogue.",
    href: `https://www.amazon.com/gp/kindle/ku/gift_landing?tag=${AMAZON_ASSOCIATE_TAG}`,
  },
];

export const AFFILIATE_DISCLOSURE =
  "As an Amazon Associate I earn from qualifying purchases. Amazon links may earn a commission at no extra cost to you.";
