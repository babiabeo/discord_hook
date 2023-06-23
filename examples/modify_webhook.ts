import { Attachment, DiscordWebhook } from "../mod.ts";

const webhook = new DiscordWebhook({
  url: "your webhook url",
});

const file = new Attachment({
  source: "file path or url",
});

await webhook.modify({
  name: "some name",
  avatar: file,
});
