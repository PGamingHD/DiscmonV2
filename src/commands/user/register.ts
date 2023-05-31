import {
    ActionRowBuilder,
    ApplicationCommandOptionType, ButtonBuilder, ButtonInteraction,
    ButtonStyle, CacheType,
    ChannelType, ComponentType, Embed, EmbedBuilder, InteractionCollector, InteractionResponse
} from 'discord.js';
import { Command } from '../../structures/Command';
import db from "../../utils/database";
import {Pokemon, PokemonGender, PokemonNature, userData} from "@prisma/client";
import {Colours} from "../../@types/Colours";
import {generateFlake} from "../../utils/misc";

export default new Command({
    name: 'register',
    description: 'Register to become a real Pokémon trainer',
    noDefer: true,
    run: async ({ interaction, client }) => {
        const dataExists: userData | null = await db.findPokemonTrainer(interaction.user.id);
        if (dataExists) return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setDescription('You already seem to have an account, you do not need to register again.').setColor(Colours.RED)]});
        const nextTrainerId: number = await db.findNextTrainerId() + 1;

        const bulbasaur: ButtonBuilder = new ButtonBuilder()
            .setCustomId('bulbasaur')
            .setStyle(ButtonStyle.Success)
            .setLabel('Bulbasaur')
            .setDisabled(false);
        const charmander: ButtonBuilder = new ButtonBuilder()
            .setCustomId('charmander')
            .setStyle(ButtonStyle.Danger)
            .setLabel('Charmander')
            .setDisabled(false);
        const squirtle: ButtonBuilder = new ButtonBuilder()
            .setCustomId('squirtle')
            .setStyle(ButtonStyle.Primary)
            .setLabel('Squirtle')
            .setDisabled(false);

        const choiceRow: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder<ButtonBuilder>().addComponents(bulbasaur, charmander, squirtle);

        const choiceMsg: InteractionResponse<boolean> = await interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setTitle('Please choose a starter Pokémon').setImage('https://cdn.discordapp.com/attachments/1010999257899204769/1057280526190387271/starters.png').setColor(Colours.YELLOW)], components: [choiceRow]})

        const collector: InteractionCollector<ButtonInteraction<CacheType>> = await choiceMsg.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 120000,
            idle: 120000,
        });

        collector.on('collect', async (i: ButtonInteraction<CacheType>): Promise<void> => {
            if (!i.deferred) await i.deferUpdate();

            if (i.customId === "bulbasaur") {
                const pokemon: Pokemon | null = await db.getPokemon('Bulbasaur');
                if (!pokemon) return;


                const Nature: PokemonNature[] = [
                    PokemonNature.TIMID,
                    PokemonNature.BASHFUL,
                    PokemonNature.BRAVE,
                    PokemonNature.BOLD,
                    PokemonNature.CALM,
                    PokemonNature.CAREFUL,
                    PokemonNature.DOCILE,
                    PokemonNature.GENTLE,
                    PokemonNature.HARDY,
                    PokemonNature.HASTY,
                    PokemonNature.IMPISH,
                    PokemonNature.JOLLY,
                    PokemonNature.LAX,
                    PokemonNature.LONELY,
                    PokemonNature.MILD,
                    PokemonNature.MODEST,
                    PokemonNature.NAIVE,
                    PokemonNature.NAUGHTY,
                    PokemonNature.QUIET,
                    PokemonNature.QUIRKY,
                    PokemonNature.RASH,
                    PokemonNature.RELAXED,
                    PokemonNature.SASSY,
                    PokemonNature.SERIOUS,
                    PokemonNature.TIMID,
                ]

                const Gender: PokemonGender[] = [
                    PokemonGender.MALE,
                    PokemonGender.FEMALE,
                ]

                const newUser: userData | null = await db.registerNewUser(interaction.user.id, nextTrainerId);

                await db.setNewPokemonOwner(generateFlake(), interaction.user.id, pokemon.pokemonPicture, pokemon.pokemonName, Nature[Math.random() * Nature.length>>0], Gender[Math.random() * Gender.length>>0], true);

                await choiceMsg.edit({embeds: [new EmbedBuilder().setColor(Colours.GREEN).setDescription('You have successfully chosen \`Bulbasaur\` as your starter Pokémon.')], components: []});
            }

            if (i.customId === "charmander") {
                const pokemon: Pokemon | null = await db.getPokemon('Charmander');
                if (!pokemon) return;


                const Nature: PokemonNature[] = [
                    PokemonNature.TIMID,
                    PokemonNature.BASHFUL,
                    PokemonNature.BRAVE,
                    PokemonNature.BOLD,
                    PokemonNature.CALM,
                    PokemonNature.CAREFUL,
                    PokemonNature.DOCILE,
                    PokemonNature.GENTLE,
                    PokemonNature.HARDY,
                    PokemonNature.HASTY,
                    PokemonNature.IMPISH,
                    PokemonNature.JOLLY,
                    PokemonNature.LAX,
                    PokemonNature.LONELY,
                    PokemonNature.MILD,
                    PokemonNature.MODEST,
                    PokemonNature.NAIVE,
                    PokemonNature.NAUGHTY,
                    PokemonNature.QUIET,
                    PokemonNature.QUIRKY,
                    PokemonNature.RASH,
                    PokemonNature.RELAXED,
                    PokemonNature.SASSY,
                    PokemonNature.SERIOUS,
                    PokemonNature.TIMID,
                ]

                const Gender: PokemonGender[] = [
                    PokemonGender.MALE,
                    PokemonGender.FEMALE,
                ]

                const newUser: userData | null = await db.registerNewUser(interaction.user.id, nextTrainerId);

                await db.setNewPokemonOwner(generateFlake(), interaction.user.id, pokemon.pokemonPicture, pokemon.pokemonName, Nature[Math.random() * Nature.length>>0], Gender[Math.random() * Gender.length>>0], true);

                await choiceMsg.edit({embeds: [new EmbedBuilder().setColor(Colours.GREEN).setDescription('You have successfully chosen \`Charmander\` as your starter Pokémon.')], components: []});
            }

            if (i.customId === "squirtle") {
                const pokemon: Pokemon | null = await db.getPokemon('Squirtle');
                if (!pokemon) return;


                const Nature: PokemonNature[] = [
                    PokemonNature.TIMID,
                    PokemonNature.BASHFUL,
                    PokemonNature.BRAVE,
                    PokemonNature.BOLD,
                    PokemonNature.CALM,
                    PokemonNature.CAREFUL,
                    PokemonNature.DOCILE,
                    PokemonNature.GENTLE,
                    PokemonNature.HARDY,
                    PokemonNature.HASTY,
                    PokemonNature.IMPISH,
                    PokemonNature.JOLLY,
                    PokemonNature.LAX,
                    PokemonNature.LONELY,
                    PokemonNature.MILD,
                    PokemonNature.MODEST,
                    PokemonNature.NAIVE,
                    PokemonNature.NAUGHTY,
                    PokemonNature.QUIET,
                    PokemonNature.QUIRKY,
                    PokemonNature.RASH,
                    PokemonNature.RELAXED,
                    PokemonNature.SASSY,
                    PokemonNature.SERIOUS,
                    PokemonNature.TIMID,
                ]

                const Gender: PokemonGender[] = [
                    PokemonGender.MALE,
                    PokemonGender.FEMALE,
                ]

                const newUser: userData | null = await db.registerNewUser(interaction.user.id, nextTrainerId);

                await db.setNewPokemonOwner(generateFlake(), interaction.user.id, pokemon.pokemonPicture, pokemon.pokemonName, Nature[Math.random() * Nature.length>>0], Gender[Math.random() * Gender.length>>0], true);

                await choiceMsg.edit({embeds: [new EmbedBuilder().setColor(Colours.GREEN).setDescription('You have successfully chosen \`Squirtle\` as your starter Pokémon.')], components: []});
            }
        });

        collector.on('end', async (i, reason): Promise<void> => {
            console.log(i, reason);
        });

        //const registeredUser: userData | null = await db.registerNewUser(interaction.user.id, nextTrainerId);
        return;
    },
});


