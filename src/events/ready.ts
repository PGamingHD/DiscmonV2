import {Event} from "../structures/Event";
import {Events, Guild, Message, TextChannel} from "discord.js";
import db from "../utils/database";
import logger from "../utils/logger";
import {Pokemons} from "@prisma/client";

export default new Event(Events.ClientReady, async (client) => {
    const allPokemons: Pokemons[] = await db.findDeleteCatchablePokemon();

    for (const spawnedPokemon of allPokemons) {
        try {
            const guild: Guild = await client.guilds.fetch(spawnedPokemon.spawnedServer as string);
            const channel: TextChannel = await guild.channels.fetch(spawnedPokemon.spawnedChannel as string) as TextChannel;
            const message: Message<true> = await channel.messages.fetch(spawnedPokemon.spawnedMessage as string);
            await message.edit({content: `:x: The \`${spawnedPokemon.pokemonName}\` wasn't caught in time and therefore fled, better luck next time!`, components: [], embeds: []});

            logger.warning(`Successfully removed Pokémon ${spawnedPokemon.pokemonName} from guild ${spawnedPokemon.spawnedServer} in channel ${spawnedPokemon.spawnedChannel}!`);
        } catch {}
    }

    await db.deleteCatchablePokemon().then(() => logger.warning('Successfully removed all catchable Pokémons!'));
});