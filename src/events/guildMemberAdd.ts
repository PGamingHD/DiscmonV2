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

        const canvas = createCanvas(1024, 450);
        const ctx = canvas.getContext('2d');

        ctx.font = "bold 90px Sans";
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 12;
        ctx.strokeText("WELCOME", 400, 200);

        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0,0, canvas.width, canvas.height);
        let img = await loadImage("https://wallpaperaccess.com/full/86407.jpg");
        ctx.drawImage(img, canvas.width / 2 - img.width / 2, canvas.height / 2 - img.height / 2);

        ctx.fillStyle = "#000000";
        ctx.globalAlpha = 0.5;
        ctx.fillRect(0,0,25, canvas.height);
        ctx.fillRect(canvas.width - 25, 0, 25, canvas.height);
        ctx.fillRect(25, 0, canvas.width - 50, 25);
        ctx.fillRect(25, canvas.height - 25, canvas.width - 50, 25);
        ctx.globalAlpha = 1;

        ctx.beginPath();
        ctx.lineWidth = 10;
        ctx.strokeStyle = "#e96423";
        ctx.arc(180, 225, 135, 0, Math.PI * 2, true);
        ctx.stroke();
        ctx.closePath();
        ctx.clip();
        img = await loadImage(member.displayAvatarURL({extension: "png"}));
        ctx.drawImage(img, 45, 90, 270, 270);
        ctx.restore();

        ctx.font = "bold 90px Sans";
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 12;
        ctx.strokeText("WELCOME", 400, 200);
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText("WELCOME", 400, 200);

        ctx.font = "bold 45px Sans";
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 10;
        ctx.strokeText(`${member.user.username}#${member.user.discriminator}`, canvas.width - 565, canvas.height - 175);
        ctx.fillStyle = "#eb6123";
        ctx.fillText(`${member.user.username}#${member.user.discriminator}`, canvas.width - 565, canvas.height - 175);


        ctx.font = "bold 40px Sans";
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 10;
        ctx.strokeText(`Member #${member.guild.memberCount}`, 535, canvas.height - 100);
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText(`Member #${member.guild.memberCount}`, 535, canvas.height - 100);

        const attachment: AttachmentBuilder = new AttachmentBuilder(await canvas.encode("png"), {name: `welcome-${member.id}.png`});

        return cachedChannel.send({
            content: `Welcome ${member}, to **${member.guild.name}**!\nPlease make sure to also read the rules in <#1010999256166957258> before starting to chat.`,
            files: [attachment]
        })
    }
    return;
});