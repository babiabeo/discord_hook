import { Attachment, DiscordWebhook } from "../mod.ts";

const webhook = new DiscordWebhook({
  url: "your webhook url",
});

const file = new Attachment({
  source: "file path or url",
});

await webhook.execute({
  content: "An image was sent",
  files: [file],
});
