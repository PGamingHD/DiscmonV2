import logger from "./logger";
import {
    Generator
} from 'snowflake-generator'
import {PokemonGender, PokemonNature} from "@prisma/client";
import {Colours} from "../@types/Colours";
import {
    EmbedBuilder,
    WebhookClient
} from "discord.js";
import typeChart from "./charts/effectiveChart";
import randomNumber from 'random-number-csprng';
const SnowflakeGenerator: Generator = new Generator(1420070400000);

export function generateGuid(): string {
    var d: number = new Date().getTime();
    var d2: number = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c: string) {
        var r: number = Math.random() * 16;
        if(d > 0){
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }

        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

export function generateFlake(): string {
    const Snowflake: bigint | bigint[] = SnowflakeGenerator.generate(1, Date.now());
    return Snowflake.toString().replace('n', '');
}

export function capitalizeFirst(string: string): string {
    let toReturn: string = string;
    try {
        toReturn = string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    } catch (e) {
        toReturn = string
    }

    return toReturn;
}

export async function randomizeNumber(min: number, max: number): Promise<number> {
    if (min >= max) return min;
    return await randomNumber(min, max);
}

export function randomizeNature(): PokemonNature {
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

    return Nature[Math.random() * Nature.length>>0];
}

export function randomizeGender(): PokemonGender {
    const Gender: PokemonGender[] = [
        PokemonGender.MALE,
        PokemonGender.FEMALE,
    ]

    return Gender[Math.random() * Gender.length>>0];
}

export function formatSeconds(seconds: number): string {
    const days: number = Math.floor(seconds / (24 * 60 * 60))
    const hours: number = Math.floor(seconds / (60 * 60));
    const minutes: number = Math.floor((seconds % (60 * 60)) / 60);
    const secs: number = Math.floor(seconds % 60);
    const time: string[] = [];
    if (days >= 1) time.push(`${days}d`)
    if (hours >= 1) time.push(`${hours}h`);
    if (minutes >= 1) time.push(`${minutes}m`);
    if (seconds >= 1) time.push(`${secs}s`);

    return time.join(' ');
}

export function hasUpperCase(str: string): boolean {
    return str !== str.toLowerCase();
}

export function escapeRegex(str: string): string | void {
    try {
        return str.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
    } catch (e) {
        return logger.error(e);
    }
}

export function calculatePokemonHP(Level: number, BaseEV: number, HPiv: number, currentEV: number): number {
    return Math.floor(0.01 * (2 * BaseEV + HPiv + Math.floor(0.25 * currentEV)) * Level) + Level + 10;
}

//Attack = move power, Level = poke level, Defense = DefenseEV, defenderType = stringed types, move = moveChart[moveIndex]
export function calculateDamage(attackerAttack: number, attackerLevel: number, defenderDefense: number, defenderType: string[], move: any): number {
    // Calculate base damage
    const baseDamage: number = Math.floor((2 * attackerLevel / 5 + 2) * (move.power === -1 ? 50 : move.power) * attackerAttack / defenderDefense / 50) + 2;

    // Apply type effectiveness
    const effectiveness: number = typeChart[move.type.toLowerCase()][defenderType[0].toLowerCase()] * (defenderType[1] ? typeChart[move.type.toLowerCase()][defenderType[1].toLowerCase()] : 1);
    const typeMultiplier: 1 | 2 | 0.5 = effectiveness === 0 ? 0.5 : effectiveness === 2 ? 2 : 1;

    // Calculate critical hit
    const isCritical: boolean = Math.random() <= move.criticalChance;
    const criticalMultiplier: 1 | 2 = isCritical ? 2 : 1;

    // Apply random factor (between 0.85 and 1.00)
    const randomFactor: number = Math.random() * (1.00 - 0.85) + 0.85;

    // Calculate final damage
    const damageDone: number = Math.floor(baseDamage * typeMultiplier * criticalMultiplier * randomFactor);

    // Subtract damage from defender's HP
    return damageDone;
}

export async function hintGame(word: string): Promise<string> {
    let returnString: string = "";
    for (let i: number = 0; i < word.length; i++) {
        returnString += '_';
    }

    let returnStrings: string[] = returnString.split('');

    let counter: number = 0;
    for (let i: number = 0; counter < Math.ceil(word.length / 2); i++) {
        const randomNum: number = await randomizeNumber(1, word.length);
        const char: string = returnString.charAt(randomNum);

        if (char === word.charAt(randomNum)) continue;

        returnStrings[randomNum] = word.charAt(randomNum);
        returnString = returnStrings.join('');
        counter++;
    }

    return returnString;
}

export async function sleep(time: number): Promise<void> {
    await new Promise(r => setTimeout(r, time));
}

export async function sendWebhook(webhookLink: string, webhookTitle: string, webhookDesc: string, webhookColor: Colours) {
    const webhook: WebhookClient = new WebhookClient({
        url: webhookLink
    });

    await webhook.send({
        embeds: [
            new EmbedBuilder()
                .setColor(webhookColor)
                .setTitle(webhookTitle)
                .setDescription(webhookDesc)
                .setTimestamp()
        ]
    });
}

export async function sendWebhookWithImage(webhookLink: string, webhookTitle: string, webhookDesc: string, webhookImage: string, webhookColor: Colours) {
    const webhook: WebhookClient = new WebhookClient({
        url: webhookLink
    });

    await webhook.send({
        embeds: [
            new EmbedBuilder()
                .setColor(webhookColor)
                .setTitle(webhookTitle)
                .setDescription(webhookDesc)
                .setTimestamp()
                .setImage(webhookImage)
        ]
    });
}