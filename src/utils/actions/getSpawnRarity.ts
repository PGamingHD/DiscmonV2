import { randomNumber } from "../misc";

export default function (): string {
    const randomRarity: number = randomNumber(1, 50000);

    //COMMON 1-41950 - 41950/50000 TO GET
    //UNCOMMON 41950-46950 - 5000/50000 TO GET
    //RARE 46950-49450 - 2500/50000 TO GET
    //LEGENDARY 49450-49700 - 250/50000 TO GET
    //MYTHICAL 49700-49850 - 150/50000 TO GET
    //ULTRA BEAST 49850-49950 - 100/50000 TO GET
    //SHINY 49950-50000 - 50/50000 TO GET

    let spawnedrarity: string = 'Common';

    if (randomRarity < 41950) { //COMMON RARITY RANDOMIZER
        spawnedrarity = 'Common';
    }

    if (randomRarity > 41950 && randomRarity < 46950) { //UNCOMMON RARITY RANDOMIZER
        spawnedrarity = 'Uncommon';
    }

    if (randomRarity > 46950 && randomRarity < 49450) { //RARE RARITY RANDOMIZER
        spawnedrarity = 'Rare';
    }

    if (randomRarity > 49450 && randomRarity < 49700) { //LEGENDARY RARITY RANDOMIZER
        spawnedrarity = 'Legendary';
    }

    if (randomRarity > 49700 && randomRarity < 49850) { //MYTHICAL RARITY RANDOMIZER
        spawnedrarity = 'Mythical';
    }

    if (randomRarity > 49850 && randomRarity < 49950) { //ULTRABEAST RARITY RANDOMIZER
        spawnedrarity = 'Mythical'
        //spawnedrarity = 'Ultrabeast';
    }

    if (randomRarity > 49950 && randomRarity < 50000) { //SHINY RARITY RANDOMIZER
        spawnedrarity = 'Mythical'
        //spawnedrarity = 'Shiny';
    }

    return spawnedrarity;
}