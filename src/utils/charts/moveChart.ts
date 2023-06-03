interface Move {
    name: string;
    type: string;
    power: number;
}

const moveChart: Move[] = [
    // Normal moves
    { name: "Tackle", type: "Normal", power: 40 },
    { name: "Quick Attack", type: "Normal", power: 40 },
    { name: "Hyper Beam", type: "Normal", power: 150 },
    { name: "Body Slam", type: "Normal", power: 85 },
    { name: "Facade", type: "Normal", power: 70 },
    { name: "Double-Edge", type: "Normal", power: 120 },
    { name: "Giga Impact", type: "Normal", power: 150 },
    { name: "Crush Claw", type: "Normal", power: 75 },
    { name: "Return", type: "Normal", power: -1 },
    { name: "Last Resort", type: "Normal", power: 140 },

    // Fire moves
    { name: "Ember", type: "Fire", power: 40 },
    { name: "Flamethrower", type: "Fire", power: 90 },
    { name: "Fire Blast", type: "Fire", power: 110 },
    { name: "Fire Punch", type: "Fire", power: 75 },
    { name: "Heat Wave", type: "Fire", power: 95 },
    { name: "Flare Blitz", type: "Fire", power: 120 },
    { name: "Blast Burn", type: "Fire", power: 150 },
    { name: "Inferno", type: "Fire", power: 100 },
    { name: "Mystical Fire", type: "Fire", power: 75 },
    { name: "Eruption", type: "Fire", power: -1 },

    // Water moves
    { name: "Water Gun", type: "Water", power: 40 },
    { name: "Bubble Beam", type: "Water", power: 65 },
    { name: "Hydro Pump", type: "Water", power: 110 },
    { name: "Surf", type: "Water", power: 90 },
    { name: "Aqua Tail", type: "Water", power: 90 },
    { name: "Scald", type: "Water", power: 80 },
    { name: "Waterfall", type: "Water", power: 80 },
    { name: "Liquidation", type: "Water", power: 85 },
    { name: "Dive", type: "Water", power: 80 },
    { name: "Origin Pulse", type: "Water", power: 110 },

    // Grass moves
    { name: "Vine Whip", type: "Grass", power: 45 },
    { name: "Razor Leaf", type: "Grass", power: 55 },
    { name: "Solar Beam", type: "Grass", power: 120 },
    { name: "Leaf Blade", type: "Grass", power: 90 },
    { name: "Energy Ball", type: "Grass", power: 90 },
    { name: "Seed Bomb", type: "Grass", power: 80 },
    { name: "Wood Hammer", type: "Grass", power: 120 },
    { name: "Leaf Storm", type: "Grass", power: 130 },
    { name: "Grass Knot", type: "Grass", power: -1 },
    { name: "Frenzy Plant", type: "Grass", power: 150 },

    // Electric moves
    { name: "Thunder Shock", type: "Electric", power: 40 },
    { name: "Thunderbolt", type: "Electric", power: 90 },
    { name: "Thunder", type: "Electric", power: 110 },
    { name: "Volt Tackle", type: "Electric", power: 120 },
    { name: "Thunder Punch", type: "Electric", power: 75 },
    { name: "Discharge", type: "Electric", power: 80 },
    { name: "Zap Cannon", type: "Electric", power: 120 },
    { name: "Wild Charge", type: "Electric", power: 90 },
    { name: "Electro Ball", type: "Electric", power: -1 },
    { name: "Fusion Bolt", type: "Electric", power: 100 },

    // Ice moves
    { name: "Ice Shard", type: "Ice", power: 40 },
    { name: "Ice Beam", type: "Ice", power: 90 },
    { name: "Blizzard", type: "Ice", power: 110 },
    { name: "Aurora Beam", type: "Ice", power: 65 },
    { name: "Ice Punch", type: "Ice", power: 75 },
    { name: "Icicle Crash", type: "Ice", power: 85 },
    { name: "Freeze-Dry", type: "Ice", power: 70 },
    { name: "Hail", type: "Ice", power: -1 },
    { name: "Frost Breath", type: "Ice", power: 60 },
    { name: "Sheer Cold", type: "Ice", power: -1 },

    // Fighting moves
    { name: "Karate Chop", type: "Fighting", power: 50 },
    { name: "Cross Chop", type: "Fighting", power: 100 },
    { name: "Dynamic Punch", type: "Fighting", power: 100 },
    { name: "Close Combat", type: "Fighting", power: 120 },
    { name: "Focus Blast", type: "Fighting", power: 120 },
    { name: "Superpower", type: "Fighting", power: 120 },
    { name: "Aura Sphere", type: "Fighting", power: 80 },
    { name: "Drain Punch", type: "Fighting", power: 75 },
    { name: "Mach Punch", type: "Fighting", power: 40 },
    { name: "Revenge", type: "Fighting", power: 60 },

    // Poison moves
    { name: "Poison Sting", type: "Poison", power: 15 },
    { name: "Sludge Bomb", type: "Poison", power: 90 },
    { name: "Gunk Shot", type: "Poison", power: 120 },
    { name: "Toxic", type: "Poison", power: -1 },
    { name: "Venoshock", type: "Poison", power: 65 },
    { name: "Poison Jab", type: "Poison", power: 80 },
    { name: "Acid Spray", type: "Poison", power: 40 },
    { name: "Cross Poison", type: "Poison", power: 70 },
    { name: "Sludge Wave", type: "Poison", power: 95 },
    { name: "Clear Smog", type: "Poison", power: 50 },

    // Ground moves
    { name: "Mud-Slap", type: "Ground", power: 20 },
    { name: "Earthquake", type: "Ground", power: 100 },
    { name: "Dig", type: "Ground", power: 80 },
    { name: "Earth Power", type: "Ground", power: 90 },
    { name: "Bone Rush", type: "Ground", power: 25 },
    { name: "Magnitude", type: "Ground", power: -1 },
    { name: "Bulldoze", type: "Ground", power: 60 },
    { name: "High Horsepower", type: "Ground", power: 95 },
    { name: "Drill Run", type: "Ground", power: 80 },
    { name: "Shore Up", type: "Ground", power: -1 },

    // Flying moves
    { name: "Gust", type: "Flying", power: 40 },
    { name: "Aerial Ace", type: "Flying", power: 60 },
    { name: "Brave Bird", type: "Flying", power: 120 },
    { name: "Air Slash", type: "Flying", power: 75 },
    { name: "Hurricane", type: "Flying", power: 110 },
    { name: "Sky Attack", type: "Flying", power: 140 },
    { name: "Roost", type: "Flying", power: -1 },
    { name: "Acrobatics", type: "Flying", power: 55 },
    { name: "Fly", type: "Flying", power: 90 },
    { name: "Oblivion Wing", type: "Flying", power: 80 },

    // Psychic moves
    { name: "Confusion", type: "Psychic", power: 50 },
    { name: "Psychic", type: "Psychic", power: 90 },
    { name: "Psybeam", type: "Psychic", power: 65 },
    { name: "Future Sight", type: "Psychic", power: 120 },
    { name: "Psycho Cut", type: "Psychic", power: 70 },
    { name: "Zen Headbutt", type: "Psychic", power: 80 },
    { name: "Psystrike", type: "Psychic", power: 100 },
    { name: "Stored Power", type: "Psychic", power: -1 },
    { name: "Expanding Force", type: "Psychic", power: 80 },
    { name: "Mirror Coat", type: "Psychic", power: -1 },

    // Bug moves
    { name: "Bug Bite", type: "Bug", power: 60 },
    { name: "X-Scissor", type: "Bug", power: 80 },
    { name: "Megahorn", type: "Bug", power: 120 },
    { name: "Pin Missile", type: "Bug", power: 25 },
    { name: "U-turn", type: "Bug", power: 70 },
    { name: "Lunge", type: "Bug", power: 80 },
    { name: "Fell Stinger", type: "Bug", power: 50 },
    { name: "Bug Buzz", type: "Bug", power: 90 },
    { name: "Sticky Web", type: "Bug", power: -1 },
    { name: "Quiver Dance", type: "Bug", power: -1 },

    // Rock moves
    { name: "Rock Throw", type: "Rock", power: 50 },
    { name: "Ancient Power", type: "Rock", power: 60 },
    { name: "Rock Slide", type: "Rock", power: 75 },
    { name: "Stone Edge", type: "Rock", power: 100 },
    { name: "Rock Blast", type: "Rock", power: 25 },
    { name: "Power Gem", type: "Rock", power: 80 },
    { name: "Rock Tomb", type: "Rock", power: 60 },
    { name: "Head Smash", type: "Rock", power: 150 },
    { name: "Stealth Rock", type: "Rock", power: -1 },
    { name: "Meteor Beam", type: "Rock", power: 120 },

    // Ghost moves
    { name: "Lick", type: "Ghost", power: 30 },
    { name: "Shadow Ball", type: "Ghost", power: 80 },
    { name: "Shadow Claw", type: "Ghost", power: 70 },
    { name: "Shadow Punch", type: "Ghost", power: 60 },
    { name: "Shadow Sneak", type: "Ghost", power: 40 },
    { name: "Hex", type: "Ghost", power: 65 },
    { name: "Night Shade", type: "Ghost", power: -1 },
    { name: "Phantom Force", type: "Ghost", power: 90 },
    { name: "Spectral Thief", type: "Ghost", power: 90 },
    { name: "Poltergeist", type: "Ghost", power: 110 },

    // Dragon moves
    { name: "Dragon Rage", type: "Dragon", power: -1 },
    { name: "Dragon Claw", type: "Dragon", power: 80 },
    { name: "Outrage", type: "Dragon", power: 120 },
    { name: "Dragon Pulse", type: "Dragon", power: 85 },
    { name: "Dragon Rush", type: "Dragon", power: 100 },
    { name: "Draco Meteor", type: "Dragon", power: 130 },
    { name: "Dual Wingbeat", type: "Dragon", power: 40 },
    { name: "Clanging Scales", type: "Dragon", power: 110 },
    { name: "Roar of Time", type: "Dragon", power: 150 },
    { name: "Breaking Swipe", type: "Dragon", power: 60 },

    // Dark moves
    { name: "Pursuit", type: "Dark", power: 40 },
    { name: "Bite", type: "Dark", power: 60 },
    { name: "Crunch", type: "Dark", power: 80 },
    { name: "Dark Pulse", type: "Dark", power: 80 },
    { name: "Night Slash", type: "Dark", power: 70 },
    { name: "Foul Play", type: "Dark", power: 95 },
    { name: "Knock Off", type: "Dark", power: 65 },
    { name: "Throat Chop", type: "Dark", power: 80 },
    { name: "Sucker Punch", type: "Dark", power: 70 },
    { name: "Darkest Lariat", type: "Dark", power: 85 },

    // Steel moves
    { name: "Iron Head", type: "Steel", power: 80 },
    { name: "Metal Claw", type: "Steel", power: 50 },
    { name: "Iron Tail", type: "Steel", power: 100 },
    { name: "Flash Cannon", type: "Steel", power: 80 },
    { name: "Meteor Mash", type: "Steel", power: 90 },
    { name: "Steel Wing", type: "Steel", power: 70 },
    { name: "Bullet Punch", type: "Steel", power: 40 },
    { name: "Steel Beam", type: "Steel", power: 140 },
    { name: "Gyro Ball", type: "Steel", power: -1 },
    { name: "Heavy Slam", type: "Steel", power: -1 },

    // Fairy moves
    { name: "Fairy Wind", type: "Fairy", power: 40 },
    { name: "Moonblast", type: "Fairy", power: 95 },
    { name: "Dazzling Gleam", type: "Fairy", power: 80 },
    { name: "Play Rough", type: "Fairy", power: 90 },
    { name: "Draining Kiss", type: "Fairy", power: 50 },
    { name: "Fairy Lock", type: "Fairy", power: -1 },
    { name: "Misty Terrain", type: "Fairy", power: -1 },
    { name: "Fleur Cannon", type: "Fairy", power: 130 },
    { name: "Light of Ruin", type: "Fairy", power: 140 },
    { name: "Baby-Doll Eyes", type: "Fairy", power: -1 },
];

// Add more moves to the moveChart array as needed

export default moveChart;