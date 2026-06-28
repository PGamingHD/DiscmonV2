const fs = require("fs");

// Configuration: There are currently around 307 abilities up to Gen 9.
// Setting the limit to 315 will capture everything currently available.
const START_ID = 1;
const END_ID = 315;
const OUTPUT_FILE = "abilities.json";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const capitalize = (str) =>
  str
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

async function fetchAbilities() {
  const abilitiesDatabase = {};
  console.log(
    `Starting ability data fetch from ID #${START_ID} to #${END_ID}...`,
  );

  for (let id = START_ID; id <= END_ID; id++) {
    try {
      console.log(`Fetching Ability #${id}...`);

      const res = await fetch(`https://pokeapi.co/api/v2/ability/${id}`);

      // Skip if the ID doesn't exist (handles gaps or end of data)
      if (res.status === 404) {
        continue;
      }
      if (!res.ok) throw new Error(`Failed to fetch ability ID ${id}`);

      const abilityData = await res.json();

      // Ignore spin-off only abilities (like from Pokémon Conquest or Mystery Dungeon)
      if (!abilityData.is_main_series) {
        continue;
      }

      const formattedName = capitalize(abilityData.name);

      // Extract the English flavor text (game description)
      const flavorEntry = abilityData.flavor_text_entries.find(
        (e) => e.language.name === "en",
      );
      let description = flavorEntry ? flavorEntry.flavor_text : "";

      // Fallback: If no game flavor text exists, grab the official mechanical effect text
      if (!description) {
        const effectEntry = abilityData.effect_entries.find(
          (e) => e.language.name === "en",
        );
        description = effectEntry
          ? effectEntry.short_effect
          : "No description available.";
      }

      // Clean up messy line breaks/control characters common in PokéAPI strings
      description = description.replace(/[\n\f\r]/g, " ");

      // Build the object
      abilitiesDatabase[formattedName] = {
        id: abilityData.id,
        name: formattedName,
        description: description,
      };

      // 200ms delay to respect PokéAPI rate limits
      await delay(200);
    } catch (error) {
      console.error(`❌ Error parsing Ability ID ${id}:`, error.message);
    }
  }

  // Save the abilities to disk
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(abilitiesDatabase, null, 2));
  console.log(
    `\n✅ Finished! Ability data written successfully to ${OUTPUT_FILE}`,
  );
}

fetchAbilities();
