/*import {
    ActionRowBuilder,
    APIEmbed,
    ApplicationCommandOptionType,
    AttachmentBuilder, ButtonBuilder, ButtonInteraction,
    ButtonStyle, CacheType,
    ChannelType, ComponentType,
    EmbedBuilder, InteractionCollector,
    TextInputStyle,
    User,
} from 'discord.js';
import { Command } from '../../structures/Command';
import {Image} from "@napi-rs/canvas";
const {createCanvas, loadImage} = require("@napi-rs/canvas");
import db from "../../utils/database";
import {userData} from "@prisma/client";
import {Colours} from "../../@types/Colours";
import {calculateDamage, calculatePokemonHP, capitalizeFirst} from "../../utils/misc";
import moveChart from "../../utils/charts/moveChart";


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

        if (targetUser.id === interaction.user.id) return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.RED).setDescription('You may not battle yourself, please send a battle request to someone else.')]});

        const pokemonTrainer: userData | null = await db.findPokemonTrainer(targetUser.id);
        if (!pokemonTrainer) return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.RED).setDescription('The user have not yet registered their account, please have them register first.')]});
        const targetPokemon: any = await db.findUserSelectedPokemon(pokemonTrainer.userId);
        const battlerPokemon: any = await db.findUserSelectedPokemon(interaction.user.id);

        if (!targetPokemon) return;
        if (!battlerPokemon) return;

        const targetPoke: any = await db.getPokemon(targetPokemon.pokemonName);
        const battlerPoke: any = await db.getPokemon(battlerPokemon.pokemonName);

        if (!targetPoke) return;
        if (!battlerPoke) return;

        const confirmRow: any = new ActionRowBuilder()
        confirmRow.addComponents([
            new ButtonBuilder()
                .setLabel('Confirm')
                .setEmoji({
                    name: "✅"
                })
                .setCustomId('confirm')
                .setStyle(ButtonStyle.Success)
        ])
        confirmRow.addComponents([
            new ButtonBuilder()
                .setLabel('Deny')
                .setEmoji({
                    name: "❌"
                })
                .setCustomId('deny')
                .setStyle(ButtonStyle.Danger)
        ])

        const mainMsg = await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(Colours.MAIN)
                    .setDescription(`The user ${interaction.user} has challenged user ${targetUser} to a battle, please confirm or deny below.`)
            ],
            components: [confirmRow],
        });

        const cofirmCollector = mainMsg.createMessageComponentCollector({
            idle: 1000 * 120,
            time: 1000 * 120,
        });

        cofirmCollector.on('collect', async (interactionCollector) => {
            if (!interaction.deferred) await interactionCollector.deferUpdate();
            console.log(interactionCollector);
            if (interactionCollector.user.id !== targetUser.id) return;

            if (interactionCollector.customId === "confirm") {
                const canvas = createCanvas(1024, 450);
                const ctx = canvas.getContext('2d');

                const totalTargetHP: number = calculatePokemonHP(targetPokemon.pokemonLevel, targetPoke.pokemonEVs.HP, targetPokemon.PokemonIVs.HP, targetPokemon.PokemonsEVs.HP);
                const totalBattlerHP: number = calculatePokemonHP(battlerPokemon.pokemonLevel, battlerPoke.pokemonEVs.HP, battlerPokemon.PokemonIVs.HP, targetPokemon.PokemonsEVs.HP);

                let currentTargetHP: number = totalTargetHP;
                let currentBattlerHP: number = totalBattlerHP;

                await drawBattleImage(ctx, canvas, battlerPokemon, targetPokemon, totalTargetHP, totalBattlerHP, currentTargetHP, currentBattlerHP);

                let battlerMoves: string[] = [];
                for (let i: number = 0; i < 5000000; i++) {
                    if (battlerMoves.length >= 5) break;
                    const moveType = battlerPoke.pokemonType[0].pokemonType;

                    if (moveChart[i].type === capitalizeFirst(moveType)) {
                        battlerMoves.push(moveChart[i].name);
                    }
                }

                let battlerMove1;
                let battlerMove2;
                let battlerMove3;
                let battlerMove4;
                let battlerMove5;
                for (let i: number = 0; i < 5; i++) {
                    if (i === 0) {
                        battlerMove1 = new ButtonBuilder()
                            .setCustomId(`battler1`)
                            .setLabel(battlerMoves[i])
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(false)
                    } else if (i === 1) {
                        battlerMove2 = new ButtonBuilder()
                            .setCustomId(`battler2`)
                            .setLabel(battlerMoves[i])
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(false)
                    } else if (i === 2) {
                        battlerMove3 = new ButtonBuilder()
                            .setCustomId(`battler3`)
                            .setLabel(battlerMoves[i])
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(false)
                    } else if (i === 3) {
                        battlerMove4 = new ButtonBuilder()
                            .setCustomId(`battler4`)
                            .setLabel(battlerMoves[i])
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(false)
                    } else if (i === 4) {
                        battlerMove5 = new ButtonBuilder()
                            .setCustomId(`battler5`)
                            .setLabel(battlerMoves[i])
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(false)
                    }
                }

                //@ts-ignore
                const battlerRow: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder<ButtonBuilder>().addComponents(battlerMove1, battlerMove2, battlerMove3, battlerMove4, battlerMove5);

                let targetMoves: string[] = [];
                for (let i: number = 0; i < 5000000; i++) {
                    if (targetMoves.length >= 5) break;
                    const moveType = targetPoke.pokemonType[0].pokemonType;

                    if (moveChart[i].type === capitalizeFirst(moveType)) {
                        targetMoves.push(moveChart[i].name);
                    }
                }

                let targetMove1;
                let targetMove2;
                let targetMove3;
                let targetMove4;
                let targetMove5;
                for (let i: number = 0; i < 5; i++) {
                    if (i === 0) {
                        targetMove1 = new ButtonBuilder()
                            .setCustomId(`target1`)
                            .setLabel(targetMoves[i])
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(false)
                    } else if (i === 1) {
                        targetMove2 = new ButtonBuilder()
                            .setCustomId(`target2`)
                            .setLabel(targetMoves[i])
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(false)
                    } else if (i === 2) {
                        targetMove3 = new ButtonBuilder()
                            .setCustomId(`target3`)
                            .setLabel(targetMoves[i])
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(false)
                    } else if (i === 3) {
                        targetMove4 = new ButtonBuilder()
                            .setCustomId(`target4`)
                            .setLabel(targetMoves[i])
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(false)
                    } else if (i === 4) {
                        targetMove5 = new ButtonBuilder()
                            .setCustomId(`target5`)
                            .setLabel(targetMoves[i])
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(false)
                    }
                }

                //@ts-ignore
                const targetRow: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder<ButtonBuilder>().addComponents(targetMove1, targetMove2, targetMove3, targetMove4, targetMove5);

                //currentTargetHP = currentTargetHP - 10; HOW TO CHANGE CURRENT TO NEW BY REMOVING

                const attachment: AttachmentBuilder = new AttachmentBuilder(await canvas.encode('png'), {name: `battle.png`});

                let battleData: string[] = [];
                const battleEmbed = new EmbedBuilder()
                    .setImage(`attachment://${attachment.name}`)
                    .setColor(Colours.MAIN)
                    .setTitle('Battle Initiated')
                    .setDescription(`The battle has been initiated between user ${interaction.user} & ${targetUser} with Pokémons \`${battlerPokemon.pokemonName}\` & \`${targetPokemon.pokemonName}\`\n\n**Battle Data**\n\`\`\`${battleData.length === 0 ? "No Data" : battleData.join('\n')}\`\`\``)
                    .setFooter({text: `Move Turn: ${interaction.user.tag}`})

                const originalMsg = await interaction.editReply({
                    embeds: [battleEmbed],
                    components: [battlerRow],
                    files: [attachment],
                });

                const collector: InteractionCollector<ButtonInteraction<CacheType>> = await originalMsg.createMessageComponentCollector({
                    componentType: ComponentType.Button,
                    time: 300000,
                    idle: 300000,
                });

                let currentMove: string = "Battler";
                collector.on('collect', async (i: ButtonInteraction<CacheType>): Promise<void> => {
                    if (!interaction.deferred) await i.deferUpdate();
                    if (interaction.user.id !== i.user.id && targetUser.id !== i.user.id) return;

                    if (currentMove === "Target" && targetUser.id !== i.user.id) return;
                    if (currentMove === "Battler" && interaction.user.id !== i.user.id) return;

                    let moveIndex: number = 0;
                    let moveUser: string = "";
                    if (i.customId === "battler1") {
                        moveUser = "Battler";
                        moveIndex = 0;
                    }
                    if (i.customId === "battler2") {
                        moveUser = "Battler";
                        moveIndex = 1;
                    }
                    if (i.customId === "battler3") {
                        moveUser = "Battler";
                        moveIndex = 2;
                    }
                    if (i.customId === "battler4") {
                        moveUser = "Battler";
                        moveIndex = 3;
                    }
                    if (i.customId === "battler5") {
                        moveUser = "Battler";
                        moveIndex = 4;
                    }
                    if (i.customId === "target1") {
                        moveUser = "Target";
                        moveIndex = 0;
                    }
                    if (i.customId === "target2") {
                        moveUser = "Target";
                        moveIndex = 1;
                    }
                    if (i.customId === "target3") {
                        moveUser = "Target";
                        moveIndex = 2;
                    }
                    if (i.customId === "target4") {
                        moveUser = "Target";
                        moveIndex = 3;
                    }
                    if (i.customId === "target5") {
                        moveUser = "Target";
                        moveIndex = 4;
                    }

                    let moveData: any = {};
                    let moveTypes = [];
                    if (moveUser === "Target") {

                        for (let i = 0; i < moveChart.length; i++) {
                            const move = moveChart[i];

                            if (move.name === targetMoves[moveIndex]) {
                                moveData = move;
                                break;
                            }
                        }

                        for (const type of targetPoke.pokemonType) {
                            moveTypes.push(capitalizeFirst(type.pokemonType));
                        }

                        const damageDealt: number = calculateDamage(moveData.power, targetPokemon.pokemonLevel, battlerPokemon.PokemonsEVs.Defense, moveTypes, moveData);
                        currentBattlerHP = currentBattlerHP - damageDealt;

                        if (currentBattlerHP <= 0) {
                            await db.increaseBattlesWon(targetUser.id);

                            await interaction.editReply({components: [], embeds: [new EmbedBuilder().setColor(Colours.GREEN).setTitle('Battle Over').setDescription(`The battle has been won by user ${targetUser}`)], attachments: []});
                            return collector.stop();
                        }

                        battleData.push(`${targetUser.tag} used move ${moveData.name}\n`);
                        console.log(battleData);

                        if (i.message.embeds[0].data.footer) {
                            //i.message.embeds[0].data.footer.text = `Move Turn: ${interaction.user.tag}`;
                            battleEmbed.setFooter({text: `Move Turn: ${interaction.user.tag}`})
                            battleEmbed.setDescription(`The battle has been initiated between user ${interaction.user} & ${targetUser} with Pokémons \`${battlerPokemon.pokemonName}\` & \`${targetPokemon.pokemonName}\`\n\n**Battle Data**\n\`\`\`${battleData.length === 0 ? "No Data" : battleData.join('\n')}\`\`\``)
                        }

                        await interaction.editReply({components: [battlerRow], embeds: [battleEmbed], files: [attachment]});
                    }

                    if (moveUser === "Battler") {
                        for (let i = 0; i < moveChart.length; i++) {
                            const move = moveChart[i];

                            if (move.name === battlerMoves[moveIndex]) moveData = move;
                        }

                        for (const type of battlerPoke.pokemonType) {
                            moveTypes.push(capitalizeFirst(type.pokemonType));
                        }

                        const damageDealt: number = calculateDamage(moveData.power, battlerPokemon.pokemonLevel, targetPokemon.PokemonsEVs.Defense, moveTypes, moveData);
                        currentTargetHP = currentTargetHP - damageDealt;

                        if (currentTargetHP <= 0) {
                            await db.increaseBattlesWon(interaction.user.id);

                            await interaction.editReply({components: [], embeds: [new EmbedBuilder().setColor(Colours.GREEN).setTitle('Battle Over').setDescription(`The battle has been won by user ${interaction.user}`)], attachments: []});
                            return collector.stop();
                        }

                        battleData.push(`${interaction.user.tag} used move ${moveData.name}\n`);
                        console.log(battleData);

                        if (i.message.embeds[0].data.footer) {
                            //i.message.embeds[0].data.footer.text = `Move Turn: ${targetUser.tag}`;
                            battleEmbed.setFooter({text: `Move Turn: ${targetUser.tag}`})
                            battleEmbed.setDescription(`The battle has been initiated between user ${interaction.user} & ${targetUser} with Pokémons \`${battlerPokemon.pokemonName}\` & \`${targetPokemon.pokemonName}\`\n\n**Battle Data**\n\`\`\`${battleData.length === 0 ? "No Data" : battleData.join('\n')}\`\`\``)
                        }

                        await interaction.editReply({components: [targetRow], embeds: [battleEmbed], files: [attachment]});
                    }

                    currentMove = currentMove === "Battler" ? "Target" : "Battler";
                });
            }

            if (interactionCollector.customId === "deny") {
                if (interactionCollector.user.id !== targetUser.id) return;

                await interaction.editReply({components: [], embeds: [new EmbedBuilder().setColor(Colours.RED).setTitle('Battle Denied').setDescription(`The battle has been denied by user ${targetUser}`)]});
                cofirmCollector.stop();
            }
        });

        return;
    }
});

async function drawBattleImage(ctx: any, canvas: any, battlerPokemon: any, targetPokemon: any, totalTargetHP: number, totalBattlerHP: number, currentTargetHP: number, currentBattlerHP: number) {
    const background = await loadImage("https://cdn.discordapp.com/attachments/1071220155037794335/1114660027500871691/images.jpg");
    ctx.drawImage(background, canvas.width / 2 - background.width / 2, canvas.height / 2 - background.height / 2);

    const player1 = await loadImage(battlerPokemon.pokemonPicture);
    drawImageExtended(ctx, player1, 240, 130, true);

    const player2 = await loadImage(targetPokemon.pokemonPicture);
    drawImageExtended(ctx, player2, 525, 20, false);

    const p1HP = await loadImage("https://cdn.discordapp.com/attachments/1066698877916418138/1115276992376475648/image.png");
    ctx.drawImage(p1HP, 100, 25);

    ctx.font = 'bold 15px PKMN RBYGSC';
    ctx.fillStyle = '#000000';
    ctx.fillText(`${battlerPokemon.pokemonName}`, 125, 52);

    ctx.font = 'bold 15px PKMN RBYGSC';
    ctx.fillStyle = '#000000';
    ctx.fillText(`${battlerPokemon.pokemonLevel}`, 315, 40);

    const p2HP = await loadImage("https://cdn.discordapp.com/attachments/1066698877916418138/1115276992376475648/image.png");
    ctx.drawImage(p2HP, 675, 375);

    ctx.font = 'bold 15px PKMN RBYGSC';
    ctx.fillStyle = '#000000';
    ctx.fillText(`${targetPokemon.pokemonName}`, 695, 402);

    ctx.font = 'bold 15px PKMN RBYGSC';
    ctx.fillStyle = '#000000';
    ctx.fillText(`${targetPokemon.pokemonLevel}`, 890, 390);
}

function drawImageExtended (ctx: any, img: Image, x: number, y: number, mirrorImage: boolean){
    if (mirrorImage) {
        ctx.translate(x+img.width/2,0);
        ctx.scale(-1,1);
        ctx.drawImage(img,-img.width/2,y);

        ctx.resetTransform()
    }else{
        ctx.drawImage(img,x,y);
    }
}*/