import {Event} from "../structures/Event";
import {Events} from "discord.js";
import db from "../utils/database";
import logger from "../utils/logger";

export default new Event(Events.ClientReady, async (client) => {
    db.deleteCatchablePokemon().then(() => logger.log('Successfully removed all catchable Pokémons!'));
});