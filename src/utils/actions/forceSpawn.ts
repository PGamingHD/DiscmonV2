import {ChannelType, EmbedBuilder, Interaction, Message, TextChannel} from "discord.js";
import db from "../database";
import {generateFlake, randomizeGender, randomizeNature, randomizeNumber} from "../misc";
import {
    Pokemon,
    Pokemons,
    PokemonServer
} from "@prisma/client";
import {Colours} from "../../@types/Colours";

export default async function(interaction: Interaction, pokeName: string, serverData: PokemonServer, pokeLevel: number, maxIV: boolean, shiny: boolean) {
    if (!interaction.guild) return;
    if (!interaction.channel) return;
    if (interaction.channel.type !== ChannelType.GuildText) return;

    const pokemonToSpawn: any = await db.getPokemon(pokeName);

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
        channelToSend = interaction.channel as TextChannel;
    }

    let pic = pokemonToSpawn.pokemonPicture;
    if (shiny) {
        pic = `https://pgaminghd.github.io/discmon-images/pokemon-sprites/shiny/${pokemonToSpawn.pokemonPokedex}.png`
    }

    if (!channelToSend) return;
    if (!pokemonToSpawn) return;

    const levelGeneration: number = pokeLevel;
    const generatedId: string = generateFlake();

    const spawnMessage: Message<true> = await channelToSend.send({
        embeds: [
            new EmbedBuilder()
                .setColor(Colours.YELLOW)
                .setDescription(`A wild pokémon has been spawned by a Developer,\ncatch the spawned pokémon with \`/catch (name)\`\nbefore it flees!`)
                .setImage(pic)
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

    let HPiv: number = await randomizeNumber(1, 31);
    let ATKiv: number = await randomizeNumber(1, 31);
    let DEFiv: number = await randomizeNumber(1, 31);
    let SPECATKiv: number = await randomizeNumber(1, 31);
    let SPECDEFiv: number = await randomizeNumber(1, 31);
    let SPEEDiv: number = await randomizeNumber(1, 31);

    if (maxIV) {
        HPiv = 31;
        ATKiv = 31;
        DEFiv = 31;
        SPECATKiv = 31;
        SPECDEFiv = 31;
        SPEEDiv = 31;
    }

    const IVpercentage = HPiv + ATKiv + DEFiv + SPECATKiv + SPECDEFiv + SPEEDiv;
    const IVtotal: string = (IVpercentage / 186 * 100).toFixed(2);

    await db.spawnNewPokemon(guildId, channelId, spawnMessage.reactions.message.id, generatedId, pokemonToSpawn.pokemonName, pic, randomizeGender(), randomizeNature(), pokemonToSpawn.pokemonRarity, levelGeneration, {
        HP: HPiv,
        Attack: ATKiv,
        Defense: DEFiv,
        SpecialAtk: SPECATKiv,
        SpecialDef: SPECDEFiv,
        Speed: SPEEDiv,
        pokemonTotalIVs: parseFloat(IVtotal),
    }, {
        HP: pokemonToSpawn.pokemonEVs.HP,
        Attack: pokemonToSpawn.pokemonEVs.Attack,
        Defense: pokemonToSpawn.pokemonEVs.Defense,
        SpecialAtk: pokemonToSpawn.pokemonEVs.SpecialAtk,
        SpecialDef: pokemonToSpawn.pokemonEVs.SpecialDef,
        Speed: pokemonToSpawn.pokemonEVs.Speed,
    });

    await db.setServerSpawnChance(guildId, 0);

    setTimeout(async () => {
        const timeToDel: Pokemons | null = await db.findSpawnedExactPokemon(generatedId, channelId);

        if (timeToDel) {
            await db.deleteSpawnedPokemon(generatedId);

            /*if (spawnMessage) {
                await spawnMessage.delete();
            }*/

            try {
                await spawnMessage.edit({content: `:x: The \`${pokemonToSpawn.pokemonName}\` wasn't caught in time and therefore fled, better luck next time!`, components: [], embeds: []})
            } catch (e){console.log(e)}
        }
    }, 1000 * 60 * 2);



}