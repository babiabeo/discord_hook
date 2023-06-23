import { DiscordWebhook } from "../mod.ts";

const webhook = new DiscordWebhook({
  url: "your webhook url",
});

await webhook.execute({ content: "Hello World" });
