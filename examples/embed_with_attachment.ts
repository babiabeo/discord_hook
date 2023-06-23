import { Attachment, DiscordEmbed, DiscordWebhook } from "../mod.ts";

const webhook = new DiscordWebhook({
  url: "your webhook url",
});

const file = new Attachment({
  name: "example_image.png",
  source: "file path or url",
});

const embed = new DiscordEmbed()
  .setTitle("Example")
  .setDescription(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  )
  .setThumbnail("attachment://example_image.png");

await webhook.execute({
  embeds: [embed],
  files: [file],
});
