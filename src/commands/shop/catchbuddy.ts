import {
  ApplicationCommandOptionType,
  EmbedBuilder,
  MessageFlags,
} from "discord.js";
import { Command } from "../../structures/Command";
import db from "../../utils/database";
import { Colours } from "../../@types/Colours";
import { TrainerRanks, userCatchBuddy } from "@prisma/client";

export default new Command({
  name: "catchbuddy",
  description: "Why not ask your catchbuddy to catch some Pokémons for you",
  requireAccount: true,
  noDefer: true,
  options: [
    {
      name: "info",
      description: "Get information about your personal catchbuddy",
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: "status",
      description: "Enable or Disable the Catchbuddy",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "code",
          description: "Wether or not to enable or disable the catchbuddy",
          type: ApplicationCommandOptionType.String,
          required: true,
          choices: [
            {
              name: "Enable",
              value: "enable",
            },
            {
              name: "Disable",
              value: "disable",
            },
          ],
        },
      ],
    },
    {
      name: "refill",
      description: "Refill your catchbuddy with some well deserved candy",
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: "upgrade",
      description: "Upgrade your catchbuddy to catch faster or better Pokémons",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "type",
          description: "The uprade type you wish to upgrade",
          type: ApplicationCommandOptionType.String,
          required: true,
          choices: [
            {
              name: "Pokemon",
              value: "pokemon",
            },
            {
              name: "Duration",
              value: "duration",
            },
            {
              name: "Luck",
              value: "luck",
            },
          ],
        },
      ],
    },
  ],
  run: async ({ interaction, client }) => {
    if (interaction.options.getSubcommand() === "info") {
      const usersData: any = await db.FindPokemonTrainer(interaction.user.id);
      if (!usersData) return;

      return interaction.reply({
        flags: [MessageFlags.Ephemeral],
        embeds: [
          new EmbedBuilder()
            .setColor(Colours.MAIN)
            .setAuthor({
              name: `${interaction.user.username}'s Catchbuddy`,
              iconURL: interaction.user.displayAvatarURL(),
            })
            .setDescription(
              `Your catchbuddy helps you in your adventure to catch them all, catch Pokémons while idle!\n\nRun your catchbuddy by using \`/catchbuddy status:enable\`\nDisable your catchbuddy by using \`/catchbuddy status:disable\`\nYou may also upgrade your catchbuddy for quicker/better Pokémons, run \`/catchbuddy upgrade:name\``
            )
            .setFooter({
              text: `Catchbuddy has so far caught ${usersData.userCatchBuddy.catcherCaught} Pokémon(s) for you.`,
            })
            .setTimestamp()
            .addFields([
              {
                name: `🧬 Pokémon Upg - \`${
                  Number(usersData.userCatchBuddy.pokemonUpgrade) + 1
                }/h\``,
                value: `\`Level ${
                  usersData.userCatchBuddy.pokemonUpgrade
                }/10\`${
                  Number(usersData.userCatchBuddy.pokemonUpgrade) === 10
                    ? ""
                    : `\n\`1+ Lvl: 🪙 ${(
                        (Number(usersData.userCatchBuddy.pokemonUpgrade) + 1) *
                        10000
                      ).toLocaleString("en-US")}\``
                }\n${
                  usersData.userCatchBuddy.pokemonUpgrade === 0
                    ? `══════════`
                    : usersData.userCatchBuddy.pokemonUpgrade === 1
                    ? `▰═════════`
                    : usersData.userCatchBuddy.pokemonUpgrade === 2
                    ? `▰▰════════`
                    : usersData.userCatchBuddy.pokemonUpgrade === 3
                    ? `▰▰▰═══════`
                    : usersData.userCatchBuddy.pokemonUpgrade === 4
                    ? `▰▰▰▰══════`
                    : usersData.userCatchBuddy.pokemonUpgrade === 5
                    ? `▰▰▰▰▰═════`
                    : usersData.userCatchBuddy.pokemonUpgrade === 6
                    ? `▰▰▰▰▰▰════`
                    : usersData.userCatchBuddy.pokemonUpgrade === 7
                    ? `▰▰▰▰▰▰▰═══`
                    : usersData.userCatchBuddy.pokemonUpgrade === 8
                    ? `▰▰▰▰▰▰▰▰══`
                    : usersData.userCatchBuddy.pokemonUpgrade === 9
                    ? `▰▰▰▰▰▰▰▰▰═`
                    : usersData.userCatchBuddy.pokemonUpgrade === 10
                    ? `▰▰▰▰▰▰▰▰▰▰`
                    : "Percentage failed, contact staff!"
                }`,
                inline: true,
              },
              {
                name: `🕐 Duration Upg - \`${
                  Number(usersData.userCatchBuddy.pokemonDuration) + 1
                }h\``,
                value: `\`Level ${
                  usersData.userCatchBuddy.pokemonDuration
                }/10\`${
                  Number(usersData.userCatchBuddy.pokemonDuration) === 10
                    ? ""
                    : `\n\`1+ Lvl: 🪙 ${(
                        (Number(usersData.userCatchBuddy.pokemonDuration) + 1) *
                        5000
                      ).toLocaleString("en-US")}\``
                }\n${
                  usersData.userCatchBuddy.pokemonDuration === 0
                    ? `══════════`
                    : usersData.userCatchBuddy.pokemonDuration === 1
                    ? `▰═════════`
                    : usersData.userCatchBuddy.pokemonDuration === 2
                    ? `▰▰════════`
                    : usersData.userCatchBuddy.pokemonDuration === 3
                    ? `▰▰▰═══════`
                    : usersData.userCatchBuddy.pokemonDuration === 4
                    ? `▰▰▰▰══════`
                    : usersData.userCatchBuddy.pokemonDuration === 5
                    ? `▰▰▰▰▰═════`
                    : usersData.userCatchBuddy.pokemonDuration === 6
                    ? `▰▰▰▰▰▰════`
                    : usersData.userCatchBuddy.pokemonDuration === 7
                    ? `▰▰▰▰▰▰▰═══`
                    : usersData.userCatchBuddy.pokemonDuration === 8
                    ? `▰▰▰▰▰▰▰▰══`
                    : usersData.userCatchBuddy.pokemonDuration === 9
                    ? `▰▰▰▰▰▰▰▰▰═`
                    : usersData.userCatchBuddy.pokemonDuration === 10
                    ? `▰▰▰▰▰▰▰▰▰▰`
                    : "Percentage failed, contact staff!"
                }`,
                inline: true,
              },
              {
                name: `🍀 Luck Upg - \`${
                  usersData.userCatchBuddy.pokemonLuckUpgrade === 0
                    ? "0%"
                    : `${
                        Number(usersData.userCatchBuddy.pokemonLuckUpgrade) *
                        100
                      }%`
                }\``,
                value: `\`Level ${
                  usersData.userCatchBuddy.pokemonLuckUpgrade
                }/1\`${
                  Number(usersData.userCatchBuddy.pokemonLuckUpgrade) === 1
                    ? ""
                    : `\n\`1+ Lvl: 🪙 ${(
                        Number(
                          usersData.userCatchBuddy.pokemonLuckUpgrade + 1
                        ) * 15000000
                      ).toLocaleString("en-US")}\``
                }\n${
                  usersData.userCatchBuddy.pokemonLuckUpgrade === 0
                    ? `══════════`
                    : usersData.userCatchBuddy.pokemonLuckUpgrade === 1
                    ? `▰▰▰▰▰▰▰▰▰▰`
                    : "Percentage failed, contact staff!"
                }`,
                inline: true,
              },
              {
                name: `🔋 Your catchbuddy is currently \`${
                  usersData.userCatchBuddy.catcherEnabled === true
                    ? "Working"
                    : "Resting"
                }\``,
                value: `${
                  usersData.userCatchBuddy.catcherRefill >
                    Math.floor(Date.now()) &&
                  !usersData.userCatchBuddy.catcherEnabled
                    ? `\`/catchbuddy status:enable\` to run until <t:${Math.floor(
                        Number(usersData.userCatchBuddy.catcherRefill) / 1000
                      )}:R>`
                    : usersData.userCatchBuddy.catcherLeft > 0 &&
                      !usersData.userCatchBuddy.catcherEnabled
                    ? `\`/catchbuddy status:enable\` to run until <t:${
                        Math.floor(
                          Number(usersData.userCatchBuddy.catcherLeft) / 1000
                        ) + Math.floor(Date.now() / 1000)
                      }:R>`
                    : (usersData.userCatchBuddy.catcherLeft > 0 &&
                        usersData.userCatchBuddy.catcherEnabled) ||
                      (usersData.userCatchBuddy.catcherRefill > 0 &&
                        usersData.userCatchBuddy.catcherEnabled)
                    ? `***Running until*** <t:${Math.floor(
                        Number(usersData.userCatchBuddy.catcherRefill) / 1000
                      )}:R>`
                    : `\`/catchbuddy refill\` to refill your catchbuddy!`
                }${
                  usersData.userCatchBuddy.catcherNext > Date.now()
                    ? `\n\n**Next Catch <t:${Math.floor(
                        Number(usersData.userCatchBuddy.catcherNext) / 1000
                      )}:R>**`
                    : ``
                }`,
              },
            ]),
        ],
      });
    } else if (interaction.options.getSubcommand() === "status") {
      const code: string | null = interaction.options.getString("code");

      if (code === "enable") {
        const usersData: any = await db.FindPokemonTrainer(interaction.user.id);
        if (!usersData) return;

        if (usersData.userCatchBuddy.catcherEnabled)
          return interaction.reply({
            flags: [MessageFlags.Ephemeral],
            embeds: [
              new EmbedBuilder()
                .setColor(Colours.RED)
                .setDescription(
                  "You may not enable the Catchbuddy as it is already enabled."
                ),
            ],
          });
        if (
          Number(usersData.userCatchBuddy.catcherRefill) <= 0 &&
          Number(usersData.userCatchBuddy.catcherLeft) <= 0
        )
          return interaction.reply({
            flags: [MessageFlags.Ephemeral],
            embeds: [
              new EmbedBuilder()
                .setColor(Colours.RED)
                .setDescription(
                  "You may not enable the catchbuddy, as there is no refill time left."
                ),
            ],
          });

        const timeLeft: number = Number(usersData.userCatchBuddy.catcherLeft);

        await db.SetCatcherRefillTime(
          interaction.user.id,
          Date.now() + timeLeft
        );
        await db.SetCatcherLeftTime(interaction.user.id, 0);
        await db.SetCatcherEnabledStatus(interaction.user.id, true);

        return interaction.reply({
          flags: [MessageFlags.Ephemeral],
          embeds: [
            new EmbedBuilder()
              .setColor(Colours.GREEN)
              .setDescription(
                "You have successfully `Enabled` your catchbuddy for the time being."
              ),
          ],
        });
      } else {
        const usersData: any = await db.FindPokemonTrainer(interaction.user.id);
        if (!usersData) return;

        if (!usersData.userCatchBuddy.catcherEnabled)
          return interaction.reply({
            flags: [MessageFlags.Ephemeral],
            embeds: [
              new EmbedBuilder()
                .setColor(Colours.RED)
                .setDescription(
                  "You may not disable the Catchbuddy as it is already disabled."
                ),
            ],
          });

        const leftTime: number =
          Number(usersData.userCatchBuddy.catcherRefill) - Date.now();

        await db.SetCatcherNextTime(interaction.user.id, 0);
        await db.SetCatcherRefillTime(interaction.user.id, 0);
        await db.SetCatcherLeftTime(interaction.user.id, leftTime);
        await db.SetCatcherEnabledStatus(interaction.user.id, false);
        await db.SetCatchAvailableStatus(interaction.user.id, false);

        return interaction.reply({
          flags: [MessageFlags.Ephemeral],
          embeds: [
            new EmbedBuilder()
              .setColor(Colours.GREEN)
              .setDescription(
                "You have successfully `Disabled` your catchbuddy for the time being."
              ),
          ],
        });
      }
    } else if (interaction.options.getSubcommand() === "refill") {
      const usersData: any = await db.FindPokemonTrainer(interaction.user.id);
      if (!usersData) return;

      if (usersData.userBag.catchBuddyCandy < 1)
        return interaction.reply({
          flags: [MessageFlags.Ephemeral],
          embeds: [
            new EmbedBuilder()
              .setColor(Colours.RED)
              .setDescription(
                "You do not have enough Candy to refill your Catchbuddy."
              ),
          ],
        });
      const extra: number =
        1000 *
        60 *
        60 *
        (usersData.userCatchBuddy.pokemonDuration + 1) *
        (usersData.trainerRank === TrainerRanks.NORMAL_TRAINER
          ? 1
          : usersData.trainerRank === TrainerRanks.BRONZE_TRAINER
          ? 1.2
          : usersData.trainerRank === TrainerRanks.SILVER_TRAINER
          ? 1.4
          : usersData.trainerRank === TrainerRanks.GOLD_TRAINER
          ? 1.6
          : usersData.trainerRank === TrainerRanks.PLATINUM_TRAINER
          ? 1.8
          : 1);

      if (usersData.userCatchBuddy.catcherEnabled) {
        await db.SetCatcherRefillTime(
          interaction.user.id,
          Number(usersData.userCatchBuddy.catcherRefill) + extra
        );
        await db.SetUserBCandy(
          interaction.user.id,
          usersData.userBag.catchBuddyCandy - 1
        );
      } else {
        await db.SetCatcherLeftTime(
          interaction.user.id,
          Number(usersData.userCatchBuddy.catcherLeft) + extra
        );
        await db.SetUserBCandy(
          interaction.user.id,
          usersData.userBag.catchBuddyCandy - 1
        );
      }

      return interaction.reply({
        flags: [MessageFlags.Ephemeral],
        embeds: [
          new EmbedBuilder()
            .setColor(Colours.GREEN)
            .setDescription(
              `You successfully refilled your Buddy with \`${
                extra / (1000 * 60 * 60)
              }\`h.`
            ),
        ],
      });
    } else if (interaction.options.getSubcommand() === "upgrade") {
      const type: string | null = interaction.options.getString("type");
      if (!type) return;

      const usersData: any = await db.FindPokemonTrainer(interaction.user.id);
      if (!usersData) return;

      if (type === "pokemon") {
        if (usersData.userCatchBuddy.pokemonUpgrade >= 10)
          return interaction.reply({
            flags: [MessageFlags.Ephemeral],
            embeds: [
              new EmbedBuilder()
                .setColor(Colours.RED)
                .setDescription(
                  `This upgrade is already maxed out, you may not upgrade it any further.`
                ),
            ],
          });
        const calculatedPrice: number =
          (Number(usersData.userCatchBuddy.pokemonUpgrade) + 1) * 10000;

        if (usersData.userCoins < calculatedPrice)
          return interaction.reply({
            flags: [MessageFlags.Ephemeral],
            embeds: [
              new EmbedBuilder()
                .setColor(Colours.RED)
                .setDescription(
                  `You cannot afford this upgrade, please save some Pokécoins and try again later.`
                ),
            ],
          });

        await db.SetCoins(
          interaction.user.id,
          Number(usersData.userCoins) - calculatedPrice
        );
        const upgrade: userCatchBuddy = await db.IncrementPokemonUpgrade(
          interaction.user.id
        );

        return interaction.reply({
          flags: [MessageFlags.Ephemeral],
          embeds: [
            new EmbedBuilder()
              .setColor(Colours.GREEN)
              .setDescription(
                `You have successfully upgraded your catchbuddy **Pokémon Spawn Rate** to level \`${upgrade.pokemonUpgrade}\`!`
              ),
          ],
        });
      } else if (type === "duration") {
        if (usersData.userCatchBuddy.pokemonDuration >= 10)
          return interaction.reply({
            flags: [MessageFlags.Ephemeral],
            embeds: [
              new EmbedBuilder()
                .setColor(Colours.RED)
                .setDescription(
                  `This upgrade is already maxed out, you may not upgrade it any further.`
                ),
            ],
          });
        const calculatedPrice: number =
          (Number(usersData.userCatchBuddy.pokemonDuration) + 1) * 5000;

        if (usersData.userCoins < calculatedPrice)
          return interaction.reply({
            flags: [MessageFlags.Ephemeral],
            embeds: [
              new EmbedBuilder()
                .setColor(Colours.RED)
                .setDescription(
                  `You cannot afford this upgrade, please save some Pokécoins and try again later.`
                ),
            ],
          });

        await db.SetCoins(
          interaction.user.id,
          Number(usersData.userCoins) - calculatedPrice
        );
        const upgrade: userCatchBuddy = await db.IncrementDurationUpgrade(
          interaction.user.id
        );

        return interaction.reply({
          flags: [MessageFlags.Ephemeral],
          embeds: [
            new EmbedBuilder()
              .setColor(Colours.GREEN)
              .setDescription(
                `You have successfully upgraded your catchbuddy **Pokémon Candy Duration** to level \`${upgrade.pokemonDuration}\`!`
              ),
          ],
        });
      } else if (type === "luck") {
        if (usersData.userCatchBuddy.pokemonLuckUpgrade >= 1)
          return interaction.reply({
            flags: [MessageFlags.Ephemeral],
            embeds: [
              new EmbedBuilder()
                .setColor(Colours.RED)
                .setDescription(
                  `This upgrade is already maxed out, you may not upgrade it any further.`
                ),
            ],
          });
        const calculatedPrice: number =
          (Number(usersData.userCatchBuddy.pokemonLuckUpgrade) + 1) * 15000000;

        if (usersData.userCoins < calculatedPrice)
          return interaction.reply({
            flags: [MessageFlags.Ephemeral],
            embeds: [
              new EmbedBuilder()
                .setColor(Colours.RED)
                .setDescription(
                  `You cannot afford this upgrade, please save some Pokécoins and try again later.`
                ),
            ],
          });

        await db.SetCoins(
          interaction.user.id,
          Number(usersData.userCoins) - calculatedPrice
        );
        const upgrade: userCatchBuddy = await db.IncrementLuckUpgrade(
          interaction.user.id
        );

        return interaction.reply({
          flags: [MessageFlags.Ephemeral],
          embeds: [
            new EmbedBuilder()
              .setColor(Colours.GREEN)
              .setDescription(
                `You have successfully upgraded your catchbuddy **Luck** to level \`${upgrade.pokemonLuckUpgrade}\`!`
              ),
          ],
        });
      } else {
        return;
      }
    } else {
      return;
    }
  },
});
