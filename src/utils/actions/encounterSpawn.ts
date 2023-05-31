import {ChannelType, EmbedBuilder, Guild, GuildTextBasedChannel, Message, TextChannel} from "discord.js";
import db from "../database";
import {generateFlake, generateGuid, randomizeGender, randomizeNature, randomNumber} from "../misc";
import {
    Pokemon,
    PokemonRarity, Pokemons,
    PokemonServer
} from "@prisma/client";
import {Colours} from "../../@types/Colours";

export default async function(message: Message<boolean>, spawnedRarity: string, serverData: PokemonServer) {
    if (!message.guild) return;
    if (message.channel.type !== ChannelType.GuildText) return;

    const getPokemons: number = await db.getPokemonRarityCount(spawnedRarity as PokemonRarity);
    console.log(getPokemons);
    const randomPokemon: number = randomNumber(1, getPokemons);
    console.log(randomPokemon);

    const pokemonToSpawn: Pokemon | null = await db.getRandomPokemon(spawnedRarity.toUpperCase() as PokemonRarity, randomPokemon);

    let channelToSend: TextChannel;

    if (serverData.serverRedirect) {
        let redirectChannel;
        try {
            redirectChannel = await message.guild.channels.fetch(`${serverData.serverRedirect}`);
        } catch {
            redirectChannel = message.channel;
        }

        channelToSend = redirectChannel as TextChannel;
    } else {
        channelToSend = message.channel;
    }

    if (!channelToSend) return;
    if (!pokemonToSpawn) return;

    const levelGeneration: number = Math.floor(Math.random() * (20 - 1) + 1);

    const spawnMessage: Message<true> = await channelToSend.send({
        embeds: [
            new EmbedBuilder()
                .setColor(Colours.YELLOW)
                .setDescription(`A wild pokémon has spawned, catch the spawned\n pokémon with \`/catch (name)\` before it flees!`)
                .setImage(pokemonToSpawn.pokemonPicture)
                .setFooter({
                    text: generateFlake()
                })
        ]
    });

    const guildId: string = message.guild.id;
    const channelId: string = channelToSend.id;

    const hasSpawnedAlready: Pokemons | null = await db.findSpawnedPokemon(channelId, pokemonToSpawn.pokemonName);

    if (hasSpawnedAlready) {
        try {
            const channel: TextChannel = await message.guild.channels.fetch(hasSpawnedAlready.spawnedChannel as string) as TextChannel;
            if (!channel) return;
            const oldMessage = await channel.messages.fetch(hasSpawnedAlready.spawnedMessage as string);
            await oldMessage.edit({content: `:x: The \`${pokemonToSpawn.pokemonName}\` wasn't caught in time and therefore fled, better luck next time!`, embeds: [], components: []});
        } catch {}

        await db.deleteSpawnedPokemon(hasSpawnedAlready.pokemonId);
    }

    const HPiv: number = Math.floor(Math.random() * (31 - 1) + 1);
    const ATKiv: number = Math.floor(Math.random() * (31 - 1) + 1);
    const DEFiv: number = Math.floor(Math.random() * (31 - 1) + 1);
    const SPECATKiv: number = Math.floor(Math.random() * (31 - 1) + 1);
    const SPECDEFiv: number = Math.floor(Math.random() * (31 - 1) + 1);
    const SPEEDiv: number = Math.floor(Math.random() * (31 - 1) + 1);

    await db.spawnNewPokemon(guildId, channelId, spawnMessage.reactions.message.id, generateFlake(), pokemonToSpawn.pokemonName, pokemonToSpawn.pokemonPicture, randomizeGender(), randomizeNature(), levelGeneration, {
        HP: HPiv,
        Attack: ATKiv,
        Defense: DEFiv,
        SpecialAtk: SPECATKiv,
        SpecialDef: SPECDEFiv,
        Speed: SPEEDiv,
        TotalIV: 1,
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