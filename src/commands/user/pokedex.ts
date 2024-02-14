import {
  APIEmbed,
  ApplicationCommandOptionType,
  EmbedBuilder,
} from "discord.js";
import { Command } from "../../structures/Command";
import db from "../../utils/database";
import { Colours } from "../../@types/Colours";
import { capitalizeFirst } from "../../utils/misc";
import { chunk } from "lodash";
import sendPagination from "../../utils/messages/sendPagination";

export default new Command({
  name: "pokedex",
  description: "Get a pokédex of all Pokémons available",
  requireAccount: true,
  noDefer: true,
  options: [
    {
      name: "search",
      description: "The Pokémon ID or name to search for",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
  run: async ({ interaction, client }) => {
    const search: string | null = interaction.options.getString("search");
    if (!search) {
      const pokedexMons: any = await db.getAllPokemons();
      const pokemonData: string[] = [];

      for (const pokemon of pokedexMons) {
        const types: string[] = [];
        for (const type of pokemon.pokemonType) {
          types.push(capitalizeFirst(type.pokemonType));
        }
        pokemonData.push(
          `\`${pokemon.pokemonPokedex}\` *${
            pokemon.pokemonName
          }* • *${types.join(", ")}* • __*${capitalizeFirst(
            pokemon.pokemonRarity
          )}*__`
        );
      }

      const pages: string[][] = chunk(pokemonData, 15);
      const embeds: APIEmbed[] = [];

      let currentPage: number = 0;
      for (const page of pages) {
        currentPage++;
        embeds.push({
          title: `🧰 __Pokémon Pokedex__ 🧰`,
          description: `${page.join("\n")}`,
          footer: {
            text: `Page ${currentPage} of ${pages.length}`,
          },
          color: Colours.MAIN,
        });
      }

      return sendPagination(interaction, embeds, 120000, 120000, false, 0);
    } else {
      if (isNaN(parseInt(search))) {
        const pokedexMons: any = await db.getSpecificPokemonName(
          capitalizeFirst(search)
        );
        if (!pokedexMons)
          return interaction.reply({
            ephemeral: true,
            embeds: [
              new EmbedBuilder()
                .setColor(Colours.RED)
                .setDescription(
                  "The specified Pokémon name was not found in the Pokédex."
                ),
            ],
          });

        const types: string[] = [];
        for (const type of pokedexMons.pokemonType) {
          types.push(capitalizeFirst(type.pokemonType));
        }

        return interaction.reply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setColor(Colours.MAIN)
              .setTitle(pokedexMons.pokemonName)
              .setImage(pokedexMons.pokemonPicture)
              .setDescription(
                `__**Details**__\n**Type:** ${types.join(
                  ", "
                )}\n**Pokédex ID:** ${
                  pokedexMons.pokemonPokedex
                }\n**Pokémon Rarity:** ${capitalizeFirst(
                  pokedexMons.pokemonRarity
                )}\n\n__**Base EVs**__\n**HP:** ${
                  pokedexMons.pokemonEVs.HP
                }\n**Attack:** ${pokedexMons.pokemonEVs.Attack}\n**Defense:** ${
                  pokedexMons.pokemonEVs.Defense
                }\n**Special Attack:** ${
                  pokedexMons.pokemonEVs.SpecialAtk
                }\n**Special Defense:** ${
                  pokedexMons.pokemonEVs.SpecialDef
                }\n**Speed:** ${pokedexMons.pokemonEVs.Speed}`
              ),
          ],
        });
      } else {
        const pokedexMons: any = await db.getSpecificPokemonId(
          parseInt(search)
        );
        if (!pokedexMons)
          return interaction.reply({
            ephemeral: true,
            embeds: [
              new EmbedBuilder()
                .setColor(Colours.RED)
                .setDescription(
                  "The specified Pokémon id was not found in the Pokédex."
                ),
            ],
          });

        const types: string[] = [];
        for (const type of pokedexMons.pokemonType) {
          types.push(capitalizeFirst(type.pokemonType));
        }

        return interaction.reply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setColor(Colours.MAIN)
              .setTitle(pokedexMons.pokemonName)
              .setImage(pokedexMons.pokemonPicture)
              .setDescription(
                `__**Details**__\n**Type:** ${types.join(
                  ", "
                )}\n**Pokédex ID:** ${
                  pokedexMons.pokemonPokedex
                }\n**Pokémon Rarity:** ${capitalizeFirst(
                  pokedexMons.pokemonRarity
                )}\n\n__**Base EVs**__\n**HP:** ${
                  pokedexMons.pokemonEVs.HP
                }\n**Attack:** ${pokedexMons.pokemonEVs.Attack}\n**Defense:** ${
                  pokedexMons.pokemonEVs.Defense
                }\n**Special Attack:** ${
                  pokedexMons.pokemonEVs.SpecialAtk
                }\n**Special Defense:** ${
                  pokedexMons.pokemonEVs.SpecialDef
                }\n**Speed:** ${pokedexMons.pokemonEVs.Speed}`
              ),
          ],
        });
      }
    }
  },
});
