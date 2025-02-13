import {
  CommandInteractionOptionResolver,
  ModalSubmitFields,
  Events,
  EmbedBuilder,
  MessageFlags,
} from "discord.js";
import { client } from "../bot";
import { Event } from "../structures/Event";
import logger from "../utils/logger";
import { ButtonType, CommandType, MenuType, ModalType } from "../@types";
import { TrainerRanks, userData } from "@prisma/client";
import db from "../utils/database";
import { Colours } from "../@types/Colours";

export default new Event(Events.InteractionCreate, async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const command: CommandType | undefined = client.commands.get(
      interaction.commandName
    );
    if (!command)
      return interaction.followUp("You have used a non existent command");

    let bla: string;
    if (command.noDefer) bla = "hey";
    else await interaction.deferReply();

    const findUser: userData | null = await db.FindPokemonTrainer(
      interaction.user.id
    );
    if (
      findUser &&
      command.developerRestricted &&
      findUser.trainerRank !== TrainerRanks.DEVELOPER
    )
      return interaction.reply({
        flags: [MessageFlags.Ephemeral],
        embeds: [
          new EmbedBuilder()
            .setColor(Colours.RED)
            .setDescription(
              "You require the permission `Developer` to execute this command."
            ),
        ],
      });
    if (
      findUser &&
      command.adminRestricted &&
      findUser.trainerRank !== TrainerRanks.ADMINISTRATOR &&
      findUser.trainerRank !== TrainerRanks.DEVELOPER
    )
      return interaction.reply({
        flags: [MessageFlags.Ephemeral],
        embeds: [
          new EmbedBuilder()
            .setColor(Colours.RED)
            .setDescription(
              "You require the permission `Administrator` to execute this command."
            ),
        ],
      });
    if (
      findUser &&
      command.modRestricted &&
      findUser.trainerRank !== TrainerRanks.MODERATOR &&
      findUser.trainerRank !== TrainerRanks.ADMINISTRATOR &&
      findUser.trainerRank !== TrainerRanks.DEVELOPER
    )
      return interaction.reply({
        flags: [MessageFlags.Ephemeral],
        embeds: [
          new EmbedBuilder()
            .setColor(Colours.RED)
            .setDescription(
              "You require the permission `Moderator` to execute this command."
            ),
        ],
      });
    if (command.requireAccount && !findUser)
      return interaction.reply({
        flags: [MessageFlags.Ephemeral],
        embeds: [
          new EmbedBuilder()
            .setColor(Colours.RED)
            .setDescription(
              "You require an account to execute this command, please use `/start` to start your adventure."
            ),
        ],
      });
    if (findUser && findUser.userBlacklisted)
      return interaction.reply({
        flags: [MessageFlags.Ephemeral],
        embeds: [
          new EmbedBuilder()
            .setColor(Colours.RED)
            .setTitle(":x: Account has been disabled :x:")
            .setDescription(
              "*Your account has been permanently suspended.*\n\n**Please contact Staff for more information.**"
            ),
        ],
      });
    if (
      findUser &&
      findUser.userTimeout &&
      findUser.userTimeoutDate < Date.now()
    ) {
      await db.SetTimeoutStatus(findUser.userId, false, 0);

      try {
        await command.run({
          interaction,
          client,
          args: interaction.options as CommandInteractionOptionResolver,
        });
      } catch (e) {
        logger.error(e);
      }
    }

    if (findUser && findUser.userTimeout)
      return interaction.reply({
        flags: [MessageFlags.Ephemeral],
        embeds: [
          new EmbedBuilder()
            .setColor(Colours.RED)
            .setTitle(":x: Account has been timed out :x:")
            .setDescription(
              `*Your account has been temporarily suspended until <t:${Math.floor(
                Number(findUser.userTimeoutDate) / 1000
              )}:R> for suspicious activity.*\n\n**Please contact Staff for more information.**`
            ),
        ],
      });

    try {
      await command.run({
        interaction,
        client,
        args: interaction.options as CommandInteractionOptionResolver,
      });
    } catch (e: any) {
      if (e.message === "Missing Permissions") {
        if (interaction.deferred) {
          return interaction.followUp({
            flags: [MessageFlags.Ephemeral],
            embeds: [
              new EmbedBuilder()
                .setTitle(":warning: Missing Permissions :warning:")
                .setDescription(
                  "*I am missing the required server permissions to execute this command.*\n\n**Contact the Server Staff for more information.**"
                )
                .setColor(Colours.RED),
            ],
          });
        }

        return interaction.reply({
          flags: [MessageFlags.Ephemeral],
          embeds: [
            new EmbedBuilder()
              .setTitle(":warning: Missing Permissions :warning:")
              .setDescription(
                "*I am missing the required server permissions to execute this command.*\n\n**Contact the Server Staff for more information.**"
              )
              .setColor(Colours.RED),
          ],
        });
      } else {
        console.log(e.message);
        logger.error(e);
      }
    }
  } else if (
    interaction.isMessageContextMenuCommand() ||
    interaction.isUserContextMenuCommand()
  ) {
    const command: MenuType | undefined = client.contextmenus.get(
      interaction.commandName
    );
    if (!command)
      return interaction.followUp("You have used a non existent context menu");
    try {
      await command.run({
        interaction,
        client,
        args: interaction.options as CommandInteractionOptionResolver,
      });
    } catch (e) {
      logger.error(e);
    }
  } else if (interaction.isModalSubmit()) {
    const modal: ModalType | undefined = client.modals.get(
      interaction.customId
    );
    if (modal) {
      try {
        await modal.run({
          interaction,
          client,
          args: interaction.fields as ModalSubmitFields,
        });
      } catch (e) {
        logger.error(e);
      }
    }
  } else if (interaction.isButton()) {
    const button: ButtonType | undefined = client.buttons.get(
      interaction.customId
    );
    if (button) {
      try {
        await button.run({
          interaction,
          client,
        });
      } catch (e) {
        logger.error(e);
      }
    }
  }

  return;
});
