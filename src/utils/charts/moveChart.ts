interface Move {
    name: string;
    type: string;
    power: number;
    level: number;
}

const moveChart: Move[] = [
    // Normal moves
    { name: "Tackle", type: "Normal", power: 40, level: 1 },
    { name: "Scratch", type: "Normal", power: 40, level: 1 },
    { name: "Pound", type: "Normal", power: 40, level: 1 },
    { name: "Quick Attack", type: "Normal", power: 40, level: 1 },
    { name: "Hyper Fang", type: "Normal", power: 80, level: 1 },
    { name: "Double-Edge", type: "Normal", power: 120, level: 1 },
    { name: "Body Slam", type: "Normal", power: 85, level: 1 },
    { name: "Return", type: "Normal", power: -1, level: 1 },
    { name: "Giga Impact", type: "Normal", power: 150, level: 1 },
    { name: "Facade", type: "Normal", power: 70, level: 1 },

    // Fire moves
    { name: "Ember", type: "Fire", power: 40, level: 1 },
    { name: "Fire Spin", type: "Fire", power: 35, level: 1 },
    { name: "Flame Wheel", type: "Fire", power: 60, level: 1 },
    { name: "Flamethrower", type: "Fire", power: 90, level: 1 },
    { name: "Fire Blast", type: "Fire", power: 110, level: 1 },
    { name: "Inferno", type: "Fire", power: 100, level: 1 },
    { name: "Blaze Kick", type: "Fire", power: 85, level: 1 },
    { name: "Heat Wave", type: "Fire", power: 95, level: 1 },
    { name: "Flare Blitz", type: "Fire", power: 120, level: 1 },
    { name: "Fire Punch", type: "Fire", power: 75, level: 1 },

    // Water moves
    { name: "Bubble", type: "Water", power: 40, level: 1 },
    { name: "Water Gun", type: "Water", power: 40, level: 1 },
    { name: "Aqua Jet", type: "Water", power: 40, level: 1 },
    { name: "Bubble Beam", type: "Water", power: 65, level: 1 },
    { name: "Water Pulse", type: "Water", power: 60, level: 1 },
    { name: "Surf", type: "Water", power: 90, level: 1 },
    { name: "Hydro Pump", type: "Water", power: 110, level: 1 },
    { name: "Waterfall", type: "Water", power: 80, level: 1 },
    { name: "Scald", type: "Water", power: 80, level: 1 },
    { name: "Liquidation", type: "Water", power: 85, level: 1 },

    // Electric moves
    { name: "Thunder Shock", type: "Electric", power: 40, level: 1 },
    { name: "Spark", type: "Electric", power: 65, level: 1 },
    { name: "Thunder Wave", type: "Electric", power: -1, level: 1 },
    { name: "Thunderbolt", type: "Electric", power: 90, level: 1 },
    { name: "Electro Ball", type: "Electric", power: -1, level: 1 },
    { name: "Wild Charge", type: "Electric", power: 90, level: 1 },
    { name: "Discharge", type: "Electric", power: 80, level: 1 },
    { name: "Thunder", type: "Electric", power: 110, level: 1 },
    { name: "Volt Switch", type: "Electric", power: 70, level: 1 },
    { name: "Zap Cannon", type: "Electric", power: 120, level: 1 },

    // Grass moves
    { name: "Vine Whip", type: "Grass", power: 45, level: 1 },
    { name: "Razor Leaf", type: "Grass", power: 55, level: 1 },
    { name: "Bullet Seed", type: "Grass", power: 25, level: 1 },
    { name: "Mega Drain", type: "Grass", power: 40, level: 1 },
    { name: "Leaf Blade", type: "Grass", power: 90, level: 1 },
    { name: "Energy Ball", type: "Grass", power: 90, level: 1 },
    { name: "Giga Drain", type: "Grass", power: 75, level: 1 },
    { name: "Seed Bomb", type: "Grass", power: 80, level: 1 },
    { name: "Leaf Storm", type: "Grass", power: 130, level: 1 },
    { name: "Grass Knot", type: "Grass", power: -1, level: 1 },

    // Ice moves
    { name: "Powder Snow", type: "Ice", power: 40, level: 1 },
    { name: "Ice Shard", type: "Ice", power: 40, level: 1 },
    { name: "Icy Wind", type: "Ice", power: 55, level: 1 },
    { name: "Ice Beam", type: "Ice", power: 90, level: 1 },
    { name: "Blizzard", type: "Ice", power: 110, level: 1 },
    { name: "Aurora Beam", type: "Ice", power: 65, level: 1 },
    { name: "Ice Punch", type: "Ice", power: 75, level: 1 },
    { name: "Frost Breath", type: "Ice", power: 60, level: 1 },
    { name: "Freeze-Dry", type: "Ice", power: 70, level: 1 },
    { name: "Ice Burn", type: "Ice", power: 140, level: 1 },

    // Fighting moves
    { name: "Karate Chop", type: "Fighting", power: 50, level: 1 },
    { name: "Low Kick", type: "Fighting", power: -1, level: 1 },
    { name: "Brick Break", type: "Fighting", power: 75, level: 1 },
    { name: "Dynamic Punch", type: "Fighting", power: 100, level: 1 },
    { name: "Close Combat", type: "Fighting", power: 120, level: 1 },
    { name: "Cross Chop", type: "Fighting", power: 100, level: 1 },
    { name: "Aura Sphere", type: "Fighting", power: 90, level: 1 },
    { name: "Focus Blast", type: "Fighting", power: 120, level: 1 },
    { name: "Superpower", type: "Fighting", power: 120, level: 1 },
    { name: "High Jump Kick", type: "Fighting", power: 130, level: 1 },

    // Poison moves
    { name: "Poison Sting", type: "Poison", power: 15, level: 1 },
    { name: "Sludge", type: "Poison", power: 65, level: 1 },
    { name: "Poison Jab", type: "Poison", power: 80, level: 1 },
    { name: "Toxic Spikes", type: "Poison", power: -1, level: 1 },
    { name: "Sludge Bomb", type: "Poison", power: 90, level: 1 },
    { name: "Gunk Shot", type: "Poison", power: 120, level: 1 },
    { name: "Venoshock", type: "Poison", power: 65, level: 1 },
    { name: "Acid Spray", type: "Poison", power: 40, level: 1 },
    { name: "Cross Poison", type: "Poison", power: 70, level: 1 },
    { name: "Toxic", type: "Poison", power: -1, level: 1 },

    // Ground moves
    { name: "Mud-Slap", type: "Ground", power: 20, level: 1 },
    { name: "Magnitude", type: "Ground", power: -1, level: 1 },
    { name: "Bulldoze", type: "Ground", power: 60, level: 1 },
    { name: "Earthquake", type: "Ground", power: 100, level: 1 },
    { name: "Earth Power", type: "Ground", power: 90, level: 1 },
    { name: "Drill Run", type: "Ground", power: 80, level: 1 },
    { name: "Bone Rush", type: "Ground", power: 25, level: 1 },
    { name: "Precipice Blades", type: "Ground", power: 120, level: 1 },
    { name: "High Horsepower", type: "Ground", power: 95, level: 1 },
    { name: "Shore Up", type: "Ground", power: -1, level: 1 },

    // Flying moves
    { name: "Gust", type: "Flying", power: 40, level: 1 },
    { name: "Wing Attack", type: "Flying", power: 60, level: 1 },
    { name: "Aerial Ace", type: "Flying", power: 60, level: 1 },
    { name: "Air Slash", type: "Flying", power: 75, level: 1 },
    { name: "Hurricane", type: "Flying", power: 110, level: 1 },
    { name: "Brave Bird", type: "Flying", power: 120, level: 1 },
    { name: "Sky Attack", type: "Flying", power: 140, level: 1 },
    { name: "Acrobatics", type: "Flying", power: 55, level: 1 },
    { name: "Fly", type: "Flying", power: 90, level: 1 },
    { name: "Roost", type: "Flying", power: -1, level: 1 },

    // Psychic moves
    { name: "Confusion", type: "Psychic", power: 50, level: 1 },
    { name: "Psybeam", type: "Psychic", power: 65, level: 1 },
    { name: "Psychic", type: "Psychic", power: 90, level: 1 },
    { name: "Psyshock", type: "Psychic", power: 80, level: 1 },
    { name: "Future Sight", type: "Psychic", power: 120, level: 1 },
    { name: "Zen Headbutt", type: "Psychic", power: 80, level: 1 },
    { name: "Extrasensory", type: "Psychic", power: 80, level: 1 },
    { name: "Stored Power", type: "Psychic", power: -1, level: 1 },
    { name: "Psychic Fangs", type: "Psychic", power: 85, level: 1 },
    { name: "Expanding Force", type: "Psychic", power: 80, level: 1 },

    // Bug moves
    { name: "Struggle Bug", type: "Bug", power: 50, level: 1 },
    { name: "Bug Bite", type: "Bug", power: 60, level: 1 },
    { name: "Fury Cutter", type: "Bug", power: 40, level: 1 },
    { name: "X-Scissor", type: "Bug", power: 80, level: 1 },
    { name: "Signal Beam", type: "Bug", power: 75, level: 1 },
    { name: "Bug Buzz", type: "Bug", power: 90, level: 1 },
    { name: "U-turn", type: "Bug", power: 70, level: 1 },
    { name: "Lunge", type: "Bug", power: 80, level: 1 },
    { name: "Megahorn", type: "Bug", power: 120, level: 1 },
    { name: "Quiver Dance", type: "Bug", power: -1, level: 1 },
];

export default moveChart;