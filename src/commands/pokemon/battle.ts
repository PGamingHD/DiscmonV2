import {
    APIEmbed,
    ApplicationCommandOptionType,
    AttachmentBuilder,
    ButtonStyle,
    ChannelType,
    EmbedBuilder,
    TextInputStyle,
    User,
} from 'discord.js';
import { Command } from '../../structures/Command';
import {Image} from "@napi-rs/canvas";
const {createCanvas, loadImage} = require("@napi-rs/canvas");
import db from "../../utils/database";
import {Pokemons, userData} from "@prisma/client";
import {Colours} from "../../@types/Colours";


export default new Command({
    name: 'battle',
    description: 'Send a battle request to another trainer',
    requireAccount: true,
    noDefer: true,
    options: [{
        name: 'trainer',
        description: 'The Pokémon trainer to send the request to',
        type: ApplicationCommandOptionType.User,
        required: true
    }],
    run: async ({ interaction, client }) => {
        const targetUser: User | null = interaction.options.getUser('trainer');
        if (!targetUser) return;

        const pokemonTrainer: userData | null = await db.findPokemonTrainer(targetUser.id);
        if (!pokemonTrainer) return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.RED).setDescription('The user have not yet registered their account, please have them register first.')]});
        const targetPokemon: Pokemons | null = await db.findUserSelectedPokemon(pokemonTrainer.userId);
        const battlerPokemon: Pokemons | null = await db.findUserSelectedPokemon(interaction.user.id);
        if (!targetPokemon) return;
        if (!battlerPokemon) return;

        const canvas = createCanvas(1024, 450);
        const ctx = canvas.getContext('2d');

        const background = await loadImage("https://cdn.discordapp.com/attachments/1071220155037794335/1114660027500871691/images.jpg");
        ctx.drawImage(background, canvas.width / 2 - background.width / 2, canvas.height / 2 - background.height / 2);

        const player1 = await loadImage(battlerPokemon.pokemonPicture);
        drawImageExtended(ctx, player1, 240, 130, true);

        const player2 = await loadImage(targetPokemon.pokemonPicture);
        drawImageExtended(ctx, player2, 525, 20, false);

        const attachment = new AttachmentBuilder(await canvas.encode('png'), {name: `battle.png`});

        return interaction.reply({
            embeds: [new EmbedBuilder().setImage(`attachment://${attachment.name}`).setTitle('Battle Initiated').setDescription('This is a mock image!')],
            files: [attachment],
        });
    }
});

function drawImageExtended (ctx: any, img: Image, x: number, y: number, mirrorImage: boolean){
    if (mirrorImage) {
        ctx.translate(x+img.width/2,0);
        ctx.scale(-1,1);
        ctx.drawImage(img,-img.width/2,y);

        ctx.resetTransform()
    }else{
        ctx.drawImage(img,x,y);
    }
}