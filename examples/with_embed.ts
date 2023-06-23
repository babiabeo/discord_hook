import { DiscordEmbed, DiscordWebhook } from "../mod.ts";

const webhook = new DiscordWebhook({
  url: "your webhook url",
});

const img = "image url";
const embed = new DiscordEmbed()
  .setAuthor({
    name: "Author name",
    iconUrl: img,
  })
  .setColor(0x5865f2)
  .setTitle("Title")
  .setDescription(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  )
  .addFields([
    { name: "Field 1", value: "Value 1", inline: true },
    { name: "Field 2", value: "Value 2", inline: true },
  ])
  .setThumbnail(img)
  .setImage(img)
  .setFooter({
    text: "Lorem ipsum",
    iconUrl: img,
  })
  .setTimestamp();

await webhook.execute({ embeds: [embed] });
