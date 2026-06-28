const fs = require("fs");

const OUTPUT_FILE = "items.json";
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const capitalize = (str) =>
  str
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

async function fetchItems() {
  const itemsDatabase = {};

  try {
    console.log("Fetching the full item index from PokéAPI...");

    // Fetching with a limit of 2500 ensures we catch all items up to Gen 9+
    const resList = await fetch("https://pokeapi.co/api/v2/item?limit=2500");
    if (!resList.ok) throw new Error("Failed to fetch item list index.");

    const listData = await resList.json();
    const items = listData.results;

    console.log(`Found ${items.length} items. Starting data fetch...`);

    for (let i = 0; i < items.length; i++) {
      const itemRef = items[i];

      // Extract the ID from the URL for clean console logs
      const urlParts = itemRef.url.split("/").filter(Boolean);
      const id = urlParts[urlParts.length - 1];

      console.log(
        `[${i + 1}/${items.length}] Fetching Item #${id}: ${itemRef.name}...`,
      );

      try {
        const res = await fetch(itemRef.url);
        if (!res.ok)
          throw new Error(`Failed to fetch data for ${itemRef.name}`);

        const itemData = await res.json();
        const formattedName = capitalize(itemData.name);

        // Find English description
        // Note: The items endpoint uses '.text', with '.flavor_text' as an occasional fallback
        const textEntry = itemData.flavor_text_entries.find(
          (e) => e.language.name === "en",
        );
        let description = textEntry
          ? textEntry.text || textEntry.flavor_text
          : "No description available.";

        // Clean up messy line breaks/control characters common in PokéAPI strings
        description = description.replace(/[\n\f\r]/g, " ");

        // Build the object
        itemsDatabase[formattedName] = {
          id: itemData.id,
          name: formattedName,
          category: itemData.category
            ? capitalize(itemData.category.name)
            : "Other",
          cost: itemData.cost || 0, // In-game pokédollar cost (0 if unsellable/key item)
          sprite: itemData.sprites?.default || "", // Official game PNG sprite URL
          description: description,
        };
      } catch (itemError) {
        console.error(
          `❌ Error parsing item ${itemRef.name}:`,
          itemError.message,
        );
      }

      // 150ms delay to respect PokéAPI rate limits
      await delay(150);
    }

    // Save the clean compiled dictionary to disk
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(itemsDatabase, null, 2));
    console.log(
      `\n✅ Finished! Item data written successfully to ${OUTPUT_FILE}`,
    );
  } catch (error) {
    console.error("❌ Critical error running the item scraper:", error.message);
  }
}

fetchItems();
