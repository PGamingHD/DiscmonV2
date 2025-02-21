import { Message, TextChannel } from "discord.js";
import { sendEmbedOptions } from "../../@types";
import logger from "../logger";

export default async function ({
  interaction,
  channel,
  content,
  embed,
  components,
  ephemeral,
}: sendEmbedOptions): Promise<Message | undefined> {
  const sendOpts: any = {
    embeds: [embed],
    components,
    ephemeral: ephemeral ?? false,
  };
  try {
    if (content) sendOpts.content = content;

    if (channel) {
      return await (channel as TextChannel).send(sendOpts);
    } else if (interaction) {
      if (interaction.deferred || interaction.replied) {
        return await interaction.editReply(sendOpts);
      } else {
        await interaction.reply(sendOpts);
      }
    }
  } catch (e) {
    logger.error(e);
  }

  return;
}
