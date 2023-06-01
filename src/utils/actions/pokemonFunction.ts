import {
    ChannelType,
    GuildMember,
    Message,
    PermissionFlagsBits
} from "discord.js";
import {ExtendedClient} from "../../structures/Client";
import db from "../database";
import {Pokemon, Pokemons} from "@prisma/client";

export default async function (message: Message<boolean>, client: ExtendedClient) {
    if (client.xpCooldowns.has(message.author.id)) return;

    const findSelected: Pokemons | null = await db.findUserSelectedPokemon(message.author.id);
    if (!findSelected) return;
    const pokemon: any = await db.getPokemon(findSelected.pokemonName);
    if (!pokemon) return;

    let newLevelXP;
    if (findSelected.pokemonLevel === 1) {
        newLevelXP = 500;
    } else {
        newLevelXP = findSelected.pokemonLevel * 750;
    }

    if (findSelected.pokemonXP >= newLevelXP && findSelected.pokemonLevel < 100) {
        const levelPoke: Pokemons | null = await db.setPokemonLevelUp(findSelected.pokemonId);
        if (!levelPoke) return;
        const toEvolveTo: Pokemon | null = await db.getPokemon(pokemon.pokemonEvolve.nextEvolveName);

        if (pokemon.pokemonEvolve.nextEvolveLevel <= levelPoke.pokemonLevel) {
            if (toEvolveTo) {
                await db.setPokemonEvolve(findSelected.pokemonId, toEvolveTo.pokemonName, toEvolveTo.pokemonPicture);

                if (message.channel.type !== ChannelType.GuildText) return;
                if (!message.guild) return;

                if (message.channel.permissionsFor(message.guild.members.me as GuildMember).has(PermissionFlagsBits.SendMessages) && message.channel.permissionsFor(message.guild.members.me as GuildMember).has(PermissionFlagsBits.ViewChannel)) {
                    return message.channel.send(`${message.author} Congratulations, your ${findSelected.pokemonName} mysteriously evolved into a ${toEvolveTo.pokemonName} upon reaching level \`[${levelPoke.pokemonLevel}]\`!`);
                } else {
                    return;
                }
            }
        } else {
            if (message.channel.type !== ChannelType.GuildText) return;
            if (!message.guild) return;

            if (message.channel.permissionsFor(message.guild.members.me as GuildMember).has(PermissionFlagsBits.SendMessages) && message.channel.permissionsFor(message.guild.members.me as GuildMember).has(PermissionFlagsBits.ViewChannel)) {
                return message.channel.send(`${message.author} Congratulations, your ${findSelected.pokemonName} has just leveled up to level \`[${levelPoke.pokemonLevel}]\`!`);
            } else {
                return;
            }
        }
    }

    if (findSelected.pokemonLevel < 100) {
        await db.setPokemonXP(findSelected.pokemonId, findSelected.pokemonLevel < 100 ? Math.floor(Math.random() * (30 - 10) + 10) : 0);

        client.xpCooldowns.set(message.author.id, 'User set on a 5 second cooldown!');
        setTimeout(() => {
            client.xpCooldowns.delete(message.author.id);
        }, 1000 * 5);
    }

    return;
}