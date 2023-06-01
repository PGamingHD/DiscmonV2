import {ChannelType, EmbedBuilder, Interaction, Message, TextChannel} from "discord.js";
import db from "../database";
import {generateFlake, randomizeGender, randomizeNature, randomNumber} from "../misc";
import {
    Pokemon,
    Pokemons,
    PokemonServer
} from "@prisma/client";
import {Colours} from "../../@types/Colours";

export default async function(interaction: Interaction, pokeName: string, serverData: PokemonServer, pokeLevel: number, maxIV: boolean) {
    if (!interaction.guild) return;
    if (!interaction.channel) return;
    if (interaction.channel.type !== ChannelType.GuildText) return;

    const pokemonToSpawn: Pokemon | null = await db.getPokemon(pokeName);

    let channelToSend: TextChannel;

    if (serverData.serverRedirect) {
        let redirectChannel;
        try {
            redirectChannel = await interaction.guild.channels.fetch(`${serverData.serverRedirect}`);
        } catch {
            redirectChannel = interaction.channel;
        }

        channelToSend = redirectChannel as TextChannel;
    } else {
        channelToSend = interaction.channel;
    }

    if (!channelToSend) return;
    if (!pokemonToSpawn) return;

    const levelGeneration: number = pokeLevel;
    const generatedId: string = generateFlake();

    const spawnMessage: Message<true> = await channelToSend.send({
        embeds: [
            new EmbedBuilder()
                .setColor(Colours.YELLOW)
                .setDescription(`A wild pokémon has spawned, catch the spawned\n pokémon with \`/catch (name)\` before it flees!`)
                .setImage(pokemonToSpawn.pokemonPicture)
                .setFooter({
                    text: generatedId
                })
        ]
    });

    const guildId: string = interaction.guild.id;
    const channelId: string = channelToSend.id;

    const hasSpawnedAlready: Pokemons | null = await db.findSpawnedPokemon(channelId, pokemonToSpawn.pokemonName);

    if (hasSpawnedAlready) {
        try {
            const channel: TextChannel = await interaction.guild.channels.fetch(hasSpawnedAlready.spawnedChannel as string) as TextChannel;
            if (!channel) return;
            const oldMessage = await channel.messages.fetch(hasSpawnedAlready.spawnedMessage as string);
            await oldMessage.edit({content: `:x: The \`${pokemonToSpawn.pokemonName}\` wasn't caught in time and therefore fled, better luck next time!`, embeds: [], components: []});
        } catch {}

        await db.deleteSpawnedPokemon(hasSpawnedAlready.pokemonId);
    }

    let HPiv: number = Math.floor(Math.random() * (31 - 1) + 1);
    let ATKiv: number = Math.floor(Math.random() * (31 - 1) + 1);
    let DEFiv: number = Math.floor(Math.random() * (31 - 1) + 1);
    let SPECATKiv: number = Math.floor(Math.random() * (31 - 1) + 1);
    let SPECDEFiv: number = Math.floor(Math.random() * (31 - 1) + 1);
    let SPEEDiv: number = Math.floor(Math.random() * (31 - 1) + 1);

    if (maxIV) {
        HPiv = 31;
        ATKiv = 31;
        DEFiv = 31;
        SPECATKiv = 31;
        SPECDEFiv = 31;
        SPEEDiv = 31;
    }

    await db.spawnNewPokemon(guildId, channelId, spawnMessage.reactions.message.id, generatedId, pokemonToSpawn.pokemonName, pokemonToSpawn.pokemonPicture, randomizeGender(), randomizeNature(), levelGeneration, {
        HP: HPiv,
        Attack: ATKiv,
        Defense: DEFiv,
        SpecialAtk: SPECATKiv,
        SpecialDef: SPECDEFiv,
        Speed: SPEEDiv
    });

    await db.setServerSpawnChance(guildId, 0);

    setTimeout(async () => {
        const timeToDel = await db.findSpawnedExactPokemon(pokemonToSpawn.pokemonId, channelId);

        if (timeToDel) {
            await db.deleteSpawnedPokemon(pokemonToSpawn.pokemonId);

            if (spawnMessage) {
                await spawnMessage.delete();
            }

            await spawnMessage.edit({content: `:x: The \`${pokemonToSpawn.pokemonName}\` wasn't caught in time and therefore fled, better luck next time!`, components: [], embeds: []})
        }
    }, 1000 * 120);



}