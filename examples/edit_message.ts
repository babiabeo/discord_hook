import { DiscordWebhook } from "../mod.ts";

const webhook = new DiscordWebhook({
  url: "your webhook url",
});

await webhook.editMessage({
  messageId: "message id sent by webhook",
  content: "Hello from Deno",
});
