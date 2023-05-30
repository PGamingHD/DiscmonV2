import logger from "./logger";
import {
    Generator
} from 'snowflake-generator'
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

export function formatSeconds(seconds: number): string {
    const hours: number = Math.floor(seconds / (60 * 60));
    const minutes: number = Math.floor((seconds % (60 * 60)) / 60);
    const secs: number = Math.floor(seconds % 60);
    const time: string[] = [];
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