const fs = require("fs");

const START_ID = 1;
const END_ID = 1025;
const OUTPUT_FILE = "pokedex.json";

const evolutionChainCache = new Map();
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const capitalize = (str) =>
  str
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

function parseEvolutions(chainNode, targetName) {
  const queue = [chainNode];
  while (queue.length > 0) {
    const current = queue.shift();
    if (current.species.name === targetName) {
      return current.evolves_to.map((evo) => {
        const urlParts = evo.species.url.split("/").filter(Boolean);
        const toId = parseInt(urlParts[urlParts.length - 1]);
        const details = evo.evolution_details[0];

        let method = "LEVEL";
        let level = 1;

        if (details) {
          if (details.trigger?.name === "use-item") method = "ITEM";
          else if (details.trigger?.name === "trade") method = "TRADE";
          level = details.min_level || 1;
        }

        return { toPokedexId: toId, level: level, method: method };
      });
    }
    for (const nextNode of current.evolves_to) {
      queue.push(nextNode);
    }
  }
  return [];
}

async function fetchPokedex() {
  const pokedex = {};
  console.log(`Starting data fetch for Pokémon #${START_ID} to #${END_ID}...`);

  for (let id = START_ID; id <= END_ID; id++) {
    try {
      console.log(`Fetching #${id}...`);

      const resPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      if (!resPokemon.ok)
        throw new Error(`Failed to fetch basic data for ID ${id}`);
      const pokemonData = await resPokemon.json();

      const resSpecies = await fetch(
        `https://pokeapi.co/api/v2/pokemon-species/${id}`,
      );
      if (!resSpecies.ok)
        throw new Error(`Failed to fetch species data for ID ${id}`);
      const speciesData = await resSpecies.json();

      const evoUrl = speciesData.evolution_chain.url;
      let evoChainData;
      if (evolutionChainCache.has(evoUrl)) {
        evoChainData = evolutionChainCache.get(evoUrl);
      } else {
        const resEvo = await fetch(evoUrl);
        if (resEvo.ok) {
          evoChainData = await resEvo.json();
          evolutionChainCache.set(evoUrl, evoChainData);
        }
      }

      const baseStats = {};
      pokemonData.stats.forEach((s) => {
        let name = s.stat.name;
        if (name === "special-attack") name = "spAtk";
        if (name === "special-defense") name = "spDef";
        baseStats[name] = s.base_stat;
      });

      let rarity = "COMMON";
      if (speciesData.is_mythical) rarity = "MYTHICAL";
      else if (speciesData.is_legendary) rarity = "LEGENDARY";
      else {
        const bst = pokemonData.stats.reduce((sum, s) => sum + s.base_stat, 0);
        if (bst >= 490) rarity = "RARE";
        else if (bst >= 400) rarity = "UNCOMMON";
      }

      const learnset = [];
      const tmMoves = [];
      const seenLevelMoves = new Set();
      const seenTmMoves = new Set();

      for (const m of pokemonData.moves) {
        const lvlDetail = m.version_group_details.find(
          (d) => d.move_learn_method.name === "level-up",
        );
        if (lvlDetail && !seenLevelMoves.has(m.move.name)) {
          seenLevelMoves.add(m.move.name);
          learnset.push({
            level: lvlDetail.level_learned_at,
            move: capitalize(m.move.name),
          });
        }

        const tmDetail = m.version_group_details.find(
          (d) => d.move_learn_method.name === "machine",
        );
        if (tmDetail && !seenTmMoves.has(m.move.name)) {
          seenTmMoves.add(m.move.name);
          tmMoves.push(capitalize(m.move.name));
        }
      }

      learnset.sort((a, b) => a.level - b.level);
      tmMoves.sort();

      const evolutions = evoChainData
        ? parseEvolutions(evoChainData.chain, pokemonData.name)
        : [];

      pokedex[id] = {
        name: capitalize(pokemonData.name),
        rarity: rarity,
        height: pokemonData.height / 10 || 0,
        weight: pokemonData.weight / 10 || 0,
        types: pokemonData.types.map((t) => t.type.name.toUpperCase()),
        baseStats: baseStats,
        sprites: {
          normal: `https://pgaminghd.github.io/discmon-images/pokemon-sprites/normal/${id}.png`,
          shiny: `https://pgaminghd.github.io/discmon-images/pokemon-sprites/normal/${id}.png`,
        },
        evolutions: evolutions,
        learnset: learnset,
        tmMoves: tmMoves,
      };

      await delay(200);
    } catch (error) {
      console.error(`❌ Error parsing Pokémon ID ${id}:`, error.message);
    }
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(pokedex, null, 2));
  console.log(`\n✅ Finished! Data written successfully to ${OUTPUT_FILE}`);
}

fetchPokedex();
