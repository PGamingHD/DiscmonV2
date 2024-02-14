import { ApplicationCommandOptionType, EmbedBuilder, User } from "discord.js";
import { Command } from "../../structures/Command";
import db from "../../utils/database";
import { userData } from "@prisma/client";
import { Colours } from "../../@types/Colours";

export default new Command({
  name: "give",
  description: "Give another trainer some of your economy, very nice of you",
  requireAccount: true,
  noDefer: true,
  options: [
    {
      name: "trainer",
      description: "The trainer you wish to give coins/tokens to",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "type",
      description: "If you want to give tokens or coins to the trainer",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        {
          name: "Pokécoins",
          value: "pokecoins",
        },
        {
          name: "Pokétokens",
          value: "poketokens",
        },
      ],
    },
    {
      name: "value",
      description:
        "Enter amount to give to user, can use abbreviation b, m, k after number",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  run: async ({ interaction, client }) => {
    const type: string | null = interaction.options.getString("type");

    if (type === "pokecoins") {
      const value: string | null = interaction.options.getString("value");
      const trainer: User | null = interaction.options.getUser("trainer");
      if (!value) return;
      if (!trainer) return;

      const usersData: userData | null = await db.findPokemonTrainer(
        interaction.user.id
      );
      const targetsData: userData | null = await db.findPokemonTrainer(
        trainer.id
      );
      if (!targetsData)
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setColor(Colours.RED)
              .setDescription(
                `The user selected does not have an account yet.`
              ),
          ],
        });
      if (!usersData) return;

      const valueToGive: number | undefined = parseNumber(value);
      if (!valueToGive)
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setColor(Colours.RED)
              .setDescription(
                "Invalid number provided, please provide a number or abbreviation for number such as 1k, 1m, 1b."
              ),
          ],
        });
      if (valueToGive > usersData.userCoins)
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setColor(Colours.RED)
              .setDescription(
                "You have insufficient funds, please try a lower amount."
              ),
          ],
        });

      await db.setCoins(usersData.userId, usersData.userCoins - valueToGive);
      await db.setCoins(
        targetsData.userId,
        targetsData.userCoins + valueToGive
      );

      return interaction.reply({
        ephemeral: true,
        embeds: [
          new EmbedBuilder()
            .setColor(Colours.GREEN)
            .setDescription(
              `You have successfully given user ${trainer} 🪙 **${valueToGive.toLocaleString(
                "en-US"
              )}** Pokécoins.`
            ),
        ],
      });
    } else if (type === "poketokens") {
      const value: string | null = interaction.options.getString("value");
      const trainer: User | null = interaction.options.getUser("trainer");
      if (!value) return;
      if (!trainer) return;

      const usersData: userData | null = await db.findPokemonTrainer(
        interaction.user.id
      );
      const targetsData: userData | null = await db.findPokemonTrainer(
        trainer.id
      );
      if (!targetsData)
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setColor(Colours.RED)
              .setDescription(
                `The user selected does not have an account yet.`
              ),
          ],
        });
      if (!usersData) return;

      const valueToGive: number | undefined = parseNumber(value);
      if (!valueToGive)
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setColor(Colours.RED)
              .setDescription(
                "Invalid number provided, please provide a number or abbreviation for number such as 1k, 1m, 1b."
              ),
          ],
        });
      if (valueToGive > usersData.userTokens)
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setColor(Colours.RED)
              .setDescription(
                "You have insufficient funds, please try a lower amount."
              ),
          ],
        });

      await db.setTokens(usersData.userId, usersData.userTokens - valueToGive);
      await db.setTokens(
        targetsData.userId,
        targetsData.userTokens + valueToGive
      );

      return interaction.reply({
        ephemeral: true,
        embeds: [
          new EmbedBuilder()
            .setColor(Colours.GREEN)
            .setDescription(
              `You have successfully given user ${trainer} 💎 **${valueToGive.toLocaleString(
                "en-US"
              )}** Pokétokens.`
            ),
        ],
      });
    } else {
      return interaction.reply({
        ephemeral: true,
        embeds: [
          new EmbedBuilder()
            .setColor(Colours.RED)
            .setDescription(`Type to give is not valid, how did it get here?`),
        ],
      });
    }
  },
});

function parseNumber(input: string): number | undefined {
  const abbreviations: Record<string, number> = {
    m: 1000000,
    b: 1000000000,
    k: 1000,
  };

  const regex = /([-+]?\d*\.?\d+)([mkb])?/i;
  const match = input.match(regex);

  if (!match) {
    return undefined; // No match found
  }

  const numberString = match[1];
  const abbreviation = match[2];

  let result = parseFloat(numberString);

  if (isNaN(result)) {
    return undefined; // Invalid number
  }

  if (abbreviation) {
    const multiplier = abbreviations[abbreviation.toLowerCase()];

    if (!multiplier) {
      return undefined; // Invalid abbreviation
    }

    result *= multiplier;
  }

  return result;
}
