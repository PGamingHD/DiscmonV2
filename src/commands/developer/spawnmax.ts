import {
    APIEmbed,
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder, Message, TextChannel,
    TextInputStyle
} from 'discord.js';
import { Command } from '../../structures/Command';
import {Pokemon, PokemonRarity, Pokemons, PokemonServer, PokeType} from "@prisma/client";
import {capitalizeFirst, generateFlake} from "../../utils/misc";
import {Colours} from "../../@types/Colours";
import db from "../../utils/database";
import forceSpawn from "../../utils/actions/forceSpawn";

export default new Command({
    name: 'spawnmax',
    description: 'Increase spawn time to make next message a certain spawn',
    developerRestricted: true,
    noDefer: true,
    run: async ({ interaction, client }) => {
        if (!interaction.guild) return;

        await db.incrementServerSpawnChance(interaction.guild.id, 50);

        return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.GREEN).setDescription(`The server spawner was made \`100%\`, next message will instantly spawn a Pokémon!`)]});
    },
});