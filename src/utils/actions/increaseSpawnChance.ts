import {PokemonServer} from "@prisma/client";
import {ExtendedClient} from "../../structures/Client";
import {Message} from "discord.js";
import db from "../database";

export default async function(serverData: PokemonServer, client: ExtendedClient, message: Message<boolean>) {
    if (serverData.serverBlacklisted) return;
    if (!message.guild) return;

    if (!client.awardCooldowns.has(message.guild.id)) {
        await db.incrementServerSpawnChance(message.guild.id, 1);

        client.awardCooldowns.set(message.guild.id, "Server set on 5 second cooldown");
        setTimeout(() => {
            if (!message.guild) return;
            client.awardCooldowns.delete(message.guild.id);
        }, 1000 * 5);
    }
}