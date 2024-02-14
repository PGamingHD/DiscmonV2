import {
  APIEmbed,
  ApplicationCommandOptionType,
  EmbedBuilder,
} from "discord.js";
import { Command } from "../../structures/Command";
import db from "../../utils/database";
import { PokemonOrder, userData } from "@prisma/client";
import { Colours } from "../../@types/Colours";
import sendPagination from "../../utils/messages/sendPagination";
import { chunk } from "lodash";
import { capitalizeFirst } from "../../utils/misc";

export default new Command({
  name: "pokemons",
  description: "View all your caught Pokémons",
  requireAccount: true,
  noDefer: true,
  options: [
    {
      name: "rarity",
      description: "Show only one specific Pokémon rarity",
      type: ApplicationCommandOptionType.String,
      choices: [
        {
          name: "Common",
          value: "common",
        },
        {
          name: "Uncommon",
          value: "uncommon",
        },
        {
          name: "Rare",
          value: "rare",
        },
        {
          name: "Legendary",
          value: "legend",
        },
        {
          name: "Mythical",
          value: "mythical",
        },
        {
          name: "Ultra Beast",
          value: "ultrabeast",
        },
        {
          name: "Shiny",
          value: "shiny",
        },
      ],
    },
  ],
  run: async ({ interaction, client }) => {
    const rarity: string | null = interaction.options.getString("rarity");

    if (rarity) {
      const pokemonTrainer: userData | null = await db.findPokemonTrainer(
        interaction.user.id
      );
      if (!pokemonTrainer) return;

      let ownedPokemons: any;
      if (pokemonTrainer.pokemonOrder === PokemonOrder.LEVEL) {
        ownedPokemons = await db.sortTrainerPokemonsLevel(interaction.user.id);
      } else if (pokemonTrainer.pokemonOrder === PokemonOrder.FAVORITE) {
        ownedPokemons = await db.sortTrainerPokemonsFavorite(
          interaction.user.id
        );
      } else if (pokemonTrainer.pokemonOrder === PokemonOrder.IV) {
        ownedPokemons = await db.sortTrainerPokemonsIV(interaction.user.id);
      } else {
        ownedPokemons = await db.getTrainerPokemons(interaction.user.id);
      }

      //const ownedPokemons: any = await db.getTrainerPokemons(interaction.user.id);
      const pokemonData: string[] = [];

      for (const pokemon of ownedPokemons) {
        if (
          (rarity.toUpperCase() === "SHINY" &&
            !pokemon.pokemonPicture.includes("shiny")) ||
          (rarity.toUpperCase() !== pokemon.pokemonRarity &&
            rarity.toUpperCase() !== "SHINY")
        ) {
          continue;
        }

        const IVpercentage =
          pokemon.PokemonIVs.HP +
          pokemon.PokemonIVs.Attack +
          pokemon.PokemonIVs.Defense +
          pokemon.PokemonIVs.SpecialAtk +
          pokemon.PokemonIVs.SpecialDef +
          pokemon.PokemonIVs.Speed;
        const IVtotal: string = ((IVpercentage / 186) * 100).toFixed(2);

        pokemonData.push(
          `${pokemon.pokemonSelected ? "**[**" : ""}\`${
            pokemon.pokemonPlacementId
          }\`${pokemon.pokemonSelected ? "**]**" : ""} ${
            pokemon.pokemonFavorite === true ? "⭐" : ""
          }${pokemon.pokemonPicture.includes("shiny") ? "✨" : ""}${
            pokemon.pokemonPicture.includes("alolan") ? "💿" : ""
          } **${pokemon.pokemonName}** • Lvl. ${
            pokemon.pokemonLevel
          } • *IV ${IVtotal}%*`
        );
      }

      if (pokemonData.length === 0)
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setColor(Colours.RED)
              .setDescription(
                "You do not have any Pokémons to display in this rarity."
              ),
          ],
        });

      const pages: string[][] = chunk(pokemonData, 15);
      const embeds: APIEmbed[] = [];

      let currentPage: number = 0;
      for (const page of pages) {
        currentPage++;
        embeds.push({
          title: `📦 __Your current Pokémons__ 📦`,
          description: `${page.join("\n")}`,
          footer: {
            text: `Page ${currentPage} of ${pages.length} - Sorted by: ${
              pokemonTrainer.pokemonOrder
            } | Rarity: ${capitalizeFirst(rarity)}`,
          },
          color: Colours.MAIN,
        });
      }

      return sendPagination(interaction, embeds, 120000, 120000, false, 0);
    }

    const pokemonTrainer: userData | null = await db.findPokemonTrainer(
      interaction.user.id
    );
    if (!pokemonTrainer) return;

    let ownedPokemons: any;
    if (pokemonTrainer.pokemonOrder === PokemonOrder.LEVEL) {
      ownedPokemons = await db.sortTrainerPokemonsLevel(interaction.user.id);
    } else if (pokemonTrainer.pokemonOrder === PokemonOrder.FAVORITE) {
      ownedPokemons = await db.sortTrainerPokemonsFavorite(interaction.user.id);
    } else if (pokemonTrainer.pokemonOrder === PokemonOrder.IV) {
      ownedPokemons = await db.sortTrainerPokemonsIV(interaction.user.id);
    } else {
      ownedPokemons = await db.getTrainerPokemons(interaction.user.id);
    }

    //const ownedPokemons: any = await db.getTrainerPokemons(interaction.user.id);
    const pokemonData: string[] = [];

    for (const pokemon of ownedPokemons) {
      const IVpercentage =
        pokemon.PokemonIVs.HP +
        pokemon.PokemonIVs.Attack +
        pokemon.PokemonIVs.Defense +
        pokemon.PokemonIVs.SpecialAtk +
        pokemon.PokemonIVs.SpecialDef +
        pokemon.PokemonIVs.Speed;
      const IVtotal: string = ((IVpercentage / 186) * 100).toFixed(2);

      pokemonData.push(
        `${pokemon.pokemonSelected ? "**[**" : ""}\`${
          pokemon.pokemonPlacementId
        }\`${pokemon.pokemonSelected ? "**]**" : ""} ${
          pokemon.pokemonFavorite === true ? "⭐" : ""
        }${pokemon.pokemonPicture.includes("shiny") ? "✨" : ""}${
          pokemon.pokemonPicture.includes("alolan") ? "💿" : ""
        } **${pokemon.pokemonName}** • Lvl. ${
          pokemon.pokemonLevel
        } • *IV ${IVtotal}%*`
      );
    }

    const pages: string[][] = chunk(pokemonData, 15);
    const embeds: APIEmbed[] = [];

    let currentPage: number = 0;
    for (const page of pages) {
      currentPage++;
      embeds.push({
        title: `📦 __Your current Pokémons__ 📦`,
        description: `${page.join("\n")}`,
        footer: {
          text: `Page ${currentPage} of ${pages.length} - ${
            pokemonTrainer.pokemonOrder === PokemonOrder.LEVEL ||
            pokemonTrainer.pokemonOrder === PokemonOrder.ID ||
            pokemonTrainer.pokemonOrder === PokemonOrder.FAVORITE ||
            pokemonTrainer.pokemonOrder === PokemonOrder.IV
              ? `Sorted by: ${pokemonTrainer.pokemonOrder}`
              : `Displaying: ${pokemonTrainer.pokemonOrder}`
          }`,
        },
        color: Colours.MAIN,
      });
    }

    return sendPagination(interaction, embeds, 120000, 120000, false, 0);
  },
});
