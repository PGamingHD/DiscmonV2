import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  CacheType,
  ComponentType,
  EmbedBuilder,
  InteractionCollector,
  MessageFlags,
} from "discord.js";
import { Command } from "../../structures/Command";
import db from "../../utils/database";
import { PokemonGender, PokemonNature, userData } from "@prisma/client";
import { Colours } from "../../@types/Colours";
import { GenerateFlake, RandomizeNumber } from "../../utils/misc";
import catchBuddyOne from "../../utils/actions/catchBuddyOne";

export default new Command({
  name: "start",
  description: "Start your new adventure as a Pokémon Trainer",
  noDefer: true,
  run: async ({ interaction, client }) => {
    const trainerData: userData | null = await db.FindPokemonTrainer(
      interaction.user.id
    );

    if (trainerData)
      return interaction.reply({
        flags: [MessageFlags.Ephemeral],
        embeds: [
          new EmbedBuilder()
            .setColor(Colours.RED)
            .setDescription(
              "It seems like you already have an account, you may not register twice."
            ),
        ],
      });

    let nextTrainerId: userData | null | number = await db.FindNextTrainerId();
    if (!nextTrainerId) {
      nextTrainerId = 1;
    } else {
      nextTrainerId = nextTrainerId.trainerNumber + 1;
    }

    const bulbasaur: ButtonBuilder = new ButtonBuilder()
      .setCustomId("bulbasaur")
      .setStyle(ButtonStyle.Success)
      .setLabel("Bulbasaur")
      .setDisabled(false);
    const charmander: ButtonBuilder = new ButtonBuilder()
      .setCustomId("charmander")
      .setStyle(ButtonStyle.Danger)
      .setLabel("Charmander")
      .setDisabled(false);
    const squirtle: ButtonBuilder = new ButtonBuilder()
      .setCustomId("squirtle")
      .setStyle(ButtonStyle.Primary)
      .setLabel("Squirtle")
      .setDisabled(false);

    const choiceRow: ActionRowBuilder<ButtonBuilder> =
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        bulbasaur,
        charmander,
        squirtle
      );

    const choiceMsg = await interaction.reply({
      flags: [MessageFlags.Ephemeral],
      embeds: [
        new EmbedBuilder()
          .setTitle("Please choose a starter Pokémon")
          .setImage(
            "https://cdn.discordapp.com/attachments/1010999257899204769/1057280526190387271/starters.png"
          )
          .setColor(Colours.YELLOW)
          .setFooter({
            text: "NOTE: Bot is in Alpha, expect data wipes for updates.",
          }),
      ],
      components: [choiceRow],
    });

    const collector = interaction.channel?.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 120000,
      idle: 120000,
    });

    collector?.on(
      "collect",
      async (i: ButtonInteraction<CacheType>): Promise<void> => {
        if (!i.deferred) await i.deferUpdate();

        if (i.customId === "bulbasaur") {
          const pokemon: any = await db.GetPokemon("Bulbasaur");
          if (!pokemon) return;

          const Nature: PokemonNature[] = [
            PokemonNature.TIMID,
            PokemonNature.BASHFUL,
            PokemonNature.BRAVE,
            PokemonNature.BOLD,
            PokemonNature.CALM,
            PokemonNature.CAREFUL,
            PokemonNature.DOCILE,
            PokemonNature.GENTLE,
            PokemonNature.HARDY,
            PokemonNature.HASTY,
            PokemonNature.IMPISH,
            PokemonNature.JOLLY,
            PokemonNature.LAX,
            PokemonNature.LONELY,
            PokemonNature.MILD,
            PokemonNature.MODEST,
            PokemonNature.NAIVE,
            PokemonNature.NAUGHTY,
            PokemonNature.QUIET,
            PokemonNature.QUIRKY,
            PokemonNature.RASH,
            PokemonNature.RELAXED,
            PokemonNature.SASSY,
            PokemonNature.SERIOUS,
            PokemonNature.TIMID,
          ];

          const Gender: PokemonGender[] = [
            PokemonGender.MALE,
            PokemonGender.FEMALE,
          ];

          await db.RegisterNewUser(
            interaction.user.id,
            nextTrainerId as number
          );

          await db.RegisterUserChallenges(interaction.user.id);

          await db.RegisterUserPokedex(interaction.user.id, pokemon.pokemonId);

          const HPiv: number = await RandomizeNumber(1, 31);
          const ATKiv: number = await RandomizeNumber(1, 31);
          const DEFiv: number = await RandomizeNumber(1, 31);
          const SPECATKiv: number = await RandomizeNumber(1, 31);
          const SPECDEFiv: number = await RandomizeNumber(1, 31);
          const SPEEDiv: number = await RandomizeNumber(1, 31);

          const IVpercentage =
            HPiv + ATKiv + DEFiv + SPECATKiv + SPECDEFiv + SPEEDiv;
          const IVtotal: string = ((IVpercentage / 186) * 100).toFixed(2);

          await db.SetNewPokemonOwner(
            GenerateFlake(),
            interaction.user.id,
            pokemon.pokemonPicture,
            pokemon.pokemonName,
            Nature[(Math.random() * Nature.length) >> 0],
            Gender[(Math.random() * Gender.length) >> 0],
            pokemon.pokemonRarity,
            true,
            1,
            {
              HP: HPiv,
              Attack: ATKiv,
              Defense: DEFiv,
              SpecialAtk: SPECATKiv,
              SpecialDef: SPECDEFiv,
              Speed: SPEEDiv,
              pokemonTotalIVs: parseFloat(IVtotal),
            },
            {
              HP: pokemon.pokemonEVs.HP,
              Attack: pokemon.pokemonEVs.Attack,
              Defense: pokemon.pokemonEVs.Defense,
              SpecialAtk: pokemon.pokemonEVs.SpecialAtk,
              SpecialDef: pokemon.pokemonEVs.SpecialDef,
              Speed: pokemon.pokemonEVs.Speed,
            }
          );

          /*await choiceMsg.edit({
            embeds: [
              new EmbedBuilder()
                .setColor(Colours.GREEN)
                .setDescription(
                  "You have successfully chosen `Bulbasaur` as your starter Pokémon."
                ),
            ],
            components: [],
          });*/

          return catchBuddyOne(interaction.user.id);
        }

        if (i.customId === "charmander") {
          const pokemon: any = await db.GetPokemon("Charmander");
          if (!pokemon) return;

          const Nature: PokemonNature[] = [
            PokemonNature.TIMID,
            PokemonNature.BASHFUL,
            PokemonNature.BRAVE,
            PokemonNature.BOLD,
            PokemonNature.CALM,
            PokemonNature.CAREFUL,
            PokemonNature.DOCILE,
            PokemonNature.GENTLE,
            PokemonNature.HARDY,
            PokemonNature.HASTY,
            PokemonNature.IMPISH,
            PokemonNature.JOLLY,
            PokemonNature.LAX,
            PokemonNature.LONELY,
            PokemonNature.MILD,
            PokemonNature.MODEST,
            PokemonNature.NAIVE,
            PokemonNature.NAUGHTY,
            PokemonNature.QUIET,
            PokemonNature.QUIRKY,
            PokemonNature.RASH,
            PokemonNature.RELAXED,
            PokemonNature.SASSY,
            PokemonNature.SERIOUS,
            PokemonNature.TIMID,
          ];

          const Gender: PokemonGender[] = [
            PokemonGender.MALE,
            PokemonGender.FEMALE,
          ];

          await db.RegisterNewUser(
            interaction.user.id,
            nextTrainerId as number
          );

          await db.RegisterUserChallenges(interaction.user.id);

          await db.RegisterUserPokedex(interaction.user.id, pokemon.pokemonId);

          const HPiv: number = await RandomizeNumber(1, 31);
          const ATKiv: number = await RandomizeNumber(1, 31);
          const DEFiv: number = await RandomizeNumber(1, 31);
          const SPECATKiv: number = await RandomizeNumber(1, 31);
          const SPECDEFiv: number = await RandomizeNumber(1, 31);
          const SPEEDiv: number = await RandomizeNumber(1, 31);

          const IVpercentage =
            HPiv + ATKiv + DEFiv + SPECATKiv + SPECDEFiv + SPEEDiv;
          const IVtotal: string = ((IVpercentage / 186) * 100).toFixed(2);

          await db.SetNewPokemonOwner(
            GenerateFlake(),
            interaction.user.id,
            pokemon.pokemonPicture,
            pokemon.pokemonName,
            Nature[(Math.random() * Nature.length) >> 0],
            Gender[(Math.random() * Gender.length) >> 0],
            pokemon.pokemonRarity,
            true,
            1,
            {
              HP: HPiv,
              Attack: ATKiv,
              Defense: DEFiv,
              SpecialAtk: SPECATKiv,
              SpecialDef: SPECDEFiv,
              Speed: SPEEDiv,
              pokemonTotalIVs: parseFloat(IVtotal),
            },
            {
              HP: pokemon.pokemonEVs.HP,
              Attack: pokemon.pokemonEVs.Attack,
              Defense: pokemon.pokemonEVs.Defense,
              SpecialAtk: pokemon.pokemonEVs.SpecialAtk,
              SpecialDef: pokemon.pokemonEVs.SpecialDef,
              Speed: pokemon.pokemonEVs.Speed,
            }
          );

          /*await choiceMsg?.edit({
            embeds: [
              new EmbedBuilder()
                .setColor(Colours.GREEN)
                .setDescription(
                  "You have successfully chosen `Charmander` as your starter Pokémon."
                ),
            ],
            components: [],
          });*/

          return catchBuddyOne(interaction.user.id);
        }

        if (i.customId === "squirtle") {
          const pokemon: any = await db.GetPokemon("Squirtle");
          if (!pokemon) return;

          const Nature: PokemonNature[] = [
            PokemonNature.TIMID,
            PokemonNature.BASHFUL,
            PokemonNature.BRAVE,
            PokemonNature.BOLD,
            PokemonNature.CALM,
            PokemonNature.CAREFUL,
            PokemonNature.DOCILE,
            PokemonNature.GENTLE,
            PokemonNature.HARDY,
            PokemonNature.HASTY,
            PokemonNature.IMPISH,
            PokemonNature.JOLLY,
            PokemonNature.LAX,
            PokemonNature.LONELY,
            PokemonNature.MILD,
            PokemonNature.MODEST,
            PokemonNature.NAIVE,
            PokemonNature.NAUGHTY,
            PokemonNature.QUIET,
            PokemonNature.QUIRKY,
            PokemonNature.RASH,
            PokemonNature.RELAXED,
            PokemonNature.SASSY,
            PokemonNature.SERIOUS,
            PokemonNature.TIMID,
          ];

          const Gender: PokemonGender[] = [
            PokemonGender.MALE,
            PokemonGender.FEMALE,
          ];

          await db.RegisterNewUser(
            interaction.user.id,
            nextTrainerId as number
          );

          await db.RegisterUserChallenges(interaction.user.id);

          await db.RegisterUserPokedex(interaction.user.id, pokemon.pokemonId);

          const HPiv: number = await RandomizeNumber(1, 31);
          const ATKiv: number = await RandomizeNumber(1, 31);
          const DEFiv: number = await RandomizeNumber(1, 31);
          const SPECATKiv: number = await RandomizeNumber(1, 31);
          const SPECDEFiv: number = await RandomizeNumber(1, 31);
          const SPEEDiv: number = await RandomizeNumber(1, 31);

          const IVpercentage =
            HPiv + ATKiv + DEFiv + SPECATKiv + SPECDEFiv + SPEEDiv;
          const IVtotal: string = ((IVpercentage / 186) * 100).toFixed(2);

          await db.SetNewPokemonOwner(
            GenerateFlake(),
            interaction.user.id,
            pokemon.pokemonPicture,
            pokemon.pokemonName,
            Nature[(Math.random() * Nature.length) >> 0],
            Gender[(Math.random() * Gender.length) >> 0],
            pokemon.pokemonRarity,
            true,
            1,
            {
              HP: HPiv,
              Attack: ATKiv,
              Defense: DEFiv,
              SpecialAtk: SPECATKiv,
              SpecialDef: SPECDEFiv,
              Speed: SPEEDiv,
              pokemonTotalIVs: parseFloat(IVtotal),
            },
            {
              HP: pokemon.pokemonEVs.HP,
              Attack: pokemon.pokemonEVs.Attack,
              Defense: pokemon.pokemonEVs.Defense,
              SpecialAtk: pokemon.pokemonEVs.SpecialAtk,
              SpecialDef: pokemon.pokemonEVs.SpecialDef,
              Speed: pokemon.pokemonEVs.Speed,
            }
          );

          /*await choiceMsg.edit({
            embeds: [
              new EmbedBuilder()
                .setColor(Colours.GREEN)
                .setDescription(
                  "You have successfully chosen `Squirtle` as your starter Pokémon."
                ),
            ],
            components: [],
          });*/

          return catchBuddyOne(interaction.user.id);
        }
      }
    );

    collector?.on("end", async (i, reason): Promise<void> => {
      bulbasaur.setDisabled(true);
      charmander.setDisabled(true);
      squirtle.setDisabled(true);

      //await choiceMsg.edit({ components: [choiceRow] });
    });
    return;
  },
});
