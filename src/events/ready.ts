import {Event} from "../structures/Event";
import {Events, Guild, Message, TextChannel} from "discord.js";
import db from "../utils/database";
import logger from "../utils/logger";
import {Pokemons, PokemonsAuction} from "@prisma/client";

export default new Event(Events.ClientReady, async (client) => {
    const auctions: any = await db.findAllAuctions();
    for (const auction of auctions) {
        const timeLeft: number = parseInt(auction.endTime) - Date.now();

        setTimeout(async (): Promise<void> => {
            const findAuction: any = await db.findSpecificAuction(auction.auctionId);

            if (findAuction) {
                await db.setPokemonAuction(auction.pokemon.pokemonId, false);
                await db.removePokemonAuction(auction.pokemon.pokemonId);

                if (!findAuction.leaderData) return;

                const findUser = await db.findPokemonTrainer(findAuction.leaderData);
                const findSeller = await db.findPokemonTrainer(findAuction.pokemon.pokemonOwner);

                if (!findUser) return;
                if (!findSeller) return;

                const getHighestPoke: Pokemons[] = await db.getPokemonNextPokeId(findAuction.leaderData);

                let incrementId;
                if (getHighestPoke.length === 0 && getHighestPoke[0].pokemonPlacementId === null) incrementId = 1;
                if (getHighestPoke.length >= 1 && getHighestPoke[0].pokemonPlacementId !== null) incrementId = getHighestPoke[0].pokemonPlacementId + 1;
                if (!incrementId) incrementId = 1;

                await db.setPokemonOwner(auction.pokemon.pokemonId, findAuction.leaderData, incrementId);
                if (findAuction.leaderData !== findAuction.pokemon.pokemonOwner) {
                    await db.setTokens(findAuction.leaderData, findUser.userTokens - findAuction.auctionCurrent);
                    await db.setTokens(findAuction.pokemon.pokemonOwner, findSeller.userTokens + findAuction.auctionCurrent);
                }
            }
        }, timeLeft);
    }

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