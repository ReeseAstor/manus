import { Redirect } from "wouter";

/** Direct checkout is not offered. Send this URL to the catalog. */
export default function WhyBuyDirectPage() {
  return <Redirect to="/books" replace />;
}
