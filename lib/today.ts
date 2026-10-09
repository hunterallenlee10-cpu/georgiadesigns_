import { cacheLife } from "next/cache";

/**
 * Today's date in North Carolina as YYYY-MM-DD. Cached for an hour so pages
 * stay static while the upcoming/past event split stays current.
 */
export async function getToday(): Promise<string> {
  "use cache";
  cacheLife("hours");
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
}
