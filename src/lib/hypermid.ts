import { HyperMid } from "@hypermid/sdk";

/**
 * Server-side HyperMid client instance.
 * Used exclusively in API routes to keep the API key on the server.
 */
export const hm = new HyperMid({
  apiKey: process.env.HYPERMID_API_KEY,
  baseUrl: "https://api.hypermid.io",
});
