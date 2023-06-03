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
    name: 'despawnpokemon',
    description: 'Despawn a Pokémon from the channel',
    developerRestricted: true,
    noDefer: true,
    options: [{
        name: 'name',
        description: 'The name of the pokémon you wish to despawn',
        type: ApplicationCommandOptionType.String,
        required: true
    }],
    run: async ({ interaction, client }) => {
        let pokeName: string | null = await interaction.options.getString('name');

        if (!pokeName) return;
        if (!interaction.guild) return;
        if (!interaction.channel) return;

        pokeName = capitalizeFirst(pokeName);

        const spawnedPokemon: Pokemons | null = await db.findSpawnedPokemon(interaction.channel.id, pokeName);
        if (!spawnedPokemon) return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.RED).setDescription('The Pokémon with that name is not spawned in this channel, is the channel correct?')]});

        if (spawnedPokemon) {
            try {
                const channel: TextChannel = await interaction.guild.channels.fetch(spawnedPokemon.spawnedChannel as string) as TextChannel;
                if (!channel) return;
                const oldMessage: Message<true> = await channel.messages.fetch(spawnedPokemon.spawnedMessage as string);
                await oldMessage.edit({content: `:x: The \`${spawnedPokemon.pokemonName}\` was forcefully despawned by a Developer.`, embeds: [], components: []});
            } catch {}

            await db.deleteSpawnedPokemon(spawnedPokemon.pokemonId);
        }

        return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.GREEN).setDescription(`The Pokémon \`${pokeName}\` was successfully despawned from this channel!`)]});
    },
});