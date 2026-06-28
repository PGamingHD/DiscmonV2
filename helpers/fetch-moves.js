const fs = require("fs");

// Configuration: As of Gen 9, there are roughly 920+ moves. Loop up to 1000 to catch everything.
const START_ID = 1;
const END_ID = 1000;
const OUTPUT_FILE = "moves.json";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const capitalize = (str) =>
  str
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

async function fetchMoves() {
  const movesDatabase = {};
  console.log(`Starting move data fetch from ID #${START_ID} to #${END_ID}...`);

  for (let id = START_ID; id <= END_ID; id++) {
    try {
      console.log(`Fetching Move #${id}...`);

      const res = await fetch(`https://pokeapi.co/api/v2/move/${id}`);

      // If we hit a 404, skip it (some IDs are empty gaps or we reached the end)
      if (res.status === 404) {
        continue;
      }
      if (!res.ok) throw new Error(`Failed to fetch move ID ${id}`);

      const moveData = await res.json();
      const formattedName = capitalize(moveData.name);

      // Extract the English game description (flavor text)
      const flavorEntry = moveData.flavor_text_entries.find(
        (e) => e.language.name === "en",
      );
      let description = flavorEntry
        ? flavorEntry.flavor_text
        : "No description available.";

      // Clean up messy line breaks/control characters common in PokéAPI strings
      description = description.replace(/[\n\f\r]/g, " ");

      // Build the object
      movesDatabase[formattedName] = {
        id: moveData.id,
        name: formattedName,
        type: moveData.type.name.toUpperCase(),
        damageClass: moveData.damage_class
          ? moveData.damage_class.name.toUpperCase()
          : "STATUS",
        power: moveData.power || null, // Status moves or variable power moves return null
        accuracy: moveData.accuracy || null, // Moves that never miss (like Swift) return null
        pp: moveData.pp || 0,
        priority: moveData.priority || 0,
        description: description,
      };

      // 200ms delay to keep PokéAPI happy
      await delay(200);
    } catch (error) {
      console.error(`❌ Error parsing Move ID ${id}:`, error.message);
    }
  }

  // Save the moves to disk
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(movesDatabase, null, 2));
  console.log(
    `\n✅ Finished! Move data written successfully to ${OUTPUT_FILE}`,
  );
}

fetchMoves();
