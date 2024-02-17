import { RandomizeNumber } from "../misc";

export default async function (): Promise<string> {
  const randomRarity: number = await RandomizeNumber(1, 50000);

  //COMMON 1-33150 - 33150/50000 TO GET
  //UNCOMMON 33150-43150 - 10000/50000 TO GET
  //RARE 43150-48150 - 5000/50000 TO GET
  //LEGENDARY 48150-49150 - 1000/50000 TO GET
  //MYTHICAL 49150-49650 - 500/50000 TO GET
  //ULTRA BEAST 49650-49900 - 250/50000 TO GET
  //SHINY 49900-50000 - 100/50000 TO GET

  let spawnedrarity: string = "Common";

  if (randomRarity < 33500) {
    //COMMON RARITY RANDOMIZER
    spawnedrarity = "Common";
  }

  if (randomRarity > 33500 && randomRarity < 43500) {
    //UNCOMMON RARITY RANDOMIZER
    spawnedrarity = "Uncommon";
  }

  if (randomRarity > 43500 && randomRarity < 48500) {
    //RARE RARITY RANDOMIZER
    spawnedrarity = "Rare";
  }

  if (randomRarity > 48500 && randomRarity < 49500) {
    //LEGENDARY RARITY RANDOMIZER
    spawnedrarity = "Legendary";
  }

  if (randomRarity > 49500 && randomRarity < 49750) {
    //MYTHICAL RARITY RANDOMIZER
    spawnedrarity = "Mythical";
  }

  if (randomRarity > 49850 && randomRarity < 49950) {
    //ULTRABEAST RARITY RANDOMIZER
    spawnedrarity = "Mythical";
    //spawnedrarity = 'Ultrabeast';
  }

  if (randomRarity > 49950 && randomRarity < 50000) {
    //SHINY RARITY RANDOMIZER
    spawnedrarity = "Mythical";
    //spawnedrarity = 'Shiny';
  }

  return spawnedrarity;
}
