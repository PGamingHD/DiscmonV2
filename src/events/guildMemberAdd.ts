import {Event} from "../structures/Event";
import {
    AttachmentBuilder,
    ChannelType,
    Events,
    PermissionFlagsBits,
    TextChannel,
} from "discord.js";
import {client} from "../bot";
const {createCanvas, loadImage} = require("@napi-rs/canvas");

export default new Event(Events.GuildMemberAdd, async (member) => {
    if (member.guild.id === "1010999169676222514") {
        const cachedChannel: TextChannel = await client.channels.fetch('1053450993301471335') as TextChannel;

        return cachedChannel.send({content: `Hey ${member}, welcome to **${member.guild.name}**!\nPlease make sure to also read the rules in <#1010999256166957258> before starting to chat.`});
    }
    return;
});