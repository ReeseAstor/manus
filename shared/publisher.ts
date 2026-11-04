import { SITE_URL } from "./site";

/**
 * Publisher mailing identity supplied by the site operator.
 * This is not an author residence, biography, or independently validated address.
 */
export const PUBLISHER_MAILING_IDENTITY = {
  website: SITE_URL,
  name: "88Away LLC",
  street: "500 8th Avenue FRNT 3 #1662",
  city: "Manhattan",
  region: "NY",
  postalCode: "10018",
  country: "United States",
} as const;

export const PUBLISHER_MAILING_LINES = [
  PUBLISHER_MAILING_IDENTITY.name,
  PUBLISHER_MAILING_IDENTITY.street,
  `${PUBLISHER_MAILING_IDENTITY.city}, ${PUBLISHER_MAILING_IDENTITY.region} ${PUBLISHER_MAILING_IDENTITY.postalCode}`,
  PUBLISHER_MAILING_IDENTITY.country,
] as const;
