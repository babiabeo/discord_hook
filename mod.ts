/**
 * ### discord_hook
 *
 * An easy way to use Discord webhook with Deno.
 *
 * @example
 * ```ts
 * import { DiscordWebhook } from "https://deno.land/x/discord_hook/mod.ts";
 *
 * const webhook = new DiscordWebhook({
 *   url: "your webhook url goes here"
 * });
 *
 * const response = await webhook.execute({ content: "Hello World!" });
 * ```
 *
 * @module
 */

export * from "./src/embed.ts";
export * from "./src/file_attachment.ts";
export * from "./src/webhook.ts";
