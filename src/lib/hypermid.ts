import { Hypermid } from "@hypermid/sdk";

/**
 * Server-side Hypermid client instance.
 * Used exclusively in API routes to keep the API key on the server.
 */
export const hm = new Hypermid({
  apiKey: process.env.HYPERMID_API_KEY,
  baseUrl: "https://api.hypermid.io",
});
