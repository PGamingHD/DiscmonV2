import {
  APIEmbed,
  ApplicationCommandOptionType,
  EmbedBuilder,
  Message,
  TextChannel,
} from "discord.js";
import { Command } from "../../structures/Command";
import {
  globalCodes,
  Pokemon,
  PokemonRarity,
  Pokemons,
  PokemonServer,
  PokeType,
  RewardType,
  userData,
} from "@prisma/client";
import { CapitalizeFirst, GenerateFlake } from "../../utils/misc";
import { Colours } from "../../@types/Colours";
import db from "../../utils/database";
import { chunk } from "lodash";
import sendPagination from "../../utils/messages/sendPagination";
import forceSpawn from "../../utils/actions/forceSpawn";
import { inspect } from "util";

export default new Command({
  name: "dev",
  description: "Developer commands, restricted to developers only",
  developerRestricted: true,
  requireAccount: true,
  noDefer: true,
  main: true,
  options: [
    {
      name: "addpokemon",
      description: "Add a new Pokémon to the database",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "pokedexid",
          description: "The Pokédex ID of the Pokémon",
          type: ApplicationCommandOptionType.Integer,
          required: true,
        },
        {
          name: "name",
          description: "What is the name of the pokemon?",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
        {
          name: "pokerarity",
          description:
            "common, uncommon, rare, legend, mythical, ultrabeast, shiny, developer, one only!",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
        {
          name: "poketype",
          description: 'The pokémons type, separate types with "," only!',
          type: ApplicationCommandOptionType.String,
          required: true,
        },
        {
          name: "evolvename",
          description:
            'What is the name of the evolve of this pokemon? ("none" if no evolve)',
          type: ApplicationCommandOptionType.String,
          required: true,
        },
        {
          name: "evolvelevel",
          description: "The level this pokémon will evolve into new pokémon",
          type: ApplicationCommandOptionType.Integer,
          required: true,
        },
        {
          name: "currentstage",
          description: "What stage of evolution this pokémon is in",
          type: ApplicationCommandOptionType.Integer,
          required: true,
        },
        {
          name: "hasalolan",
          description: "Does the pokémon have alolan version or not?",
          type: ApplicationCommandOptionType.Boolean,
          required: true,
        },
        {
          name: "ev_hp",
          description: "The default HP EV for this Pokémon",
          type: ApplicationCommandOptionType.Integer,
          required: true,
        },
        {
          name: "ev_attack",
          description: "The default Attack EV for this Pokémon",
          type: ApplicationCommandOptionType.Integer,
          required: true,
        },
        {
          name: "ev_def",
          description: "The default Defense EV for this Pokémon",
          type: ApplicationCommandOptionType.Integer,
          required: true,
        },
        {
          name: "ev_spatk",
          description: "The default Special Attack EV for this Pokémon",
          type: ApplicationCommandOptionType.Integer,
          required: true,
        },
        {
          name: "ev_spdef",
          description: "The default Special Defense EV for this Pokémon",
          type: ApplicationCommandOptionType.Integer,
          required: true,
        },
        {
          name: "ev_speed",
          description: "The default Speed EV for this Pokémon",
          type: ApplicationCommandOptionType.Integer,
          required: true,
        },
      ],
    },
    {
      name: "despawnpokemon",
      description: "Despawn a Pokémon from the channel",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "name",
          description: "The name of the pokémon you wish to despawn",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    },
    {
      name: "fetchpokemons",
      description: "View all caught Pokémons & spawned",
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: "spawnmax",
      description: "Increase spawn time to make next message a certain spawn",
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: "spawnpokemon",
      description: "Spawn a Pokémon into the server",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "pokename",
          description: "The name of the pokémon you wish to spawn",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
        {
          name: "pokelevel",
          description: "The level the Pokémon should be spawned at",
          type: ApplicationCommandOptionType.Integer,
          required: true,
        },
        {
          name: "maxiv",
          description: "If the Pokémon should be max IV or randomized",
          type: ApplicationCommandOptionType.Boolean,
          required: true,
        },
        {
          name: "shiny",
          description: "If the Pokémon spawned is shiny or not",
          type: ApplicationCommandOptionType.Boolean,
          required: true,
        },
      ],
    },
    {
      name: "createcode",
      description: "Create a code that can be redeemed",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "code",
          description: "The code you wish to create",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
        {
          name: "type",
          description: "The code type you want to create",
          type: ApplicationCommandOptionType.String,
          required: true,
          choices: [
            {
              name: "Coins",
              value: "COINS",
            },
            {
              name: "Pokemons (NOT IMPLEMENTED)",
              value: "POKEMONS",
            },
            {
              name: "Tokens",
              value: "TOKENS",
            },
          ],
        },
        {
          name: "rewardamount",
          description: "The amount you will be rewarded for redeeming",
          type: ApplicationCommandOptionType.Integer,
          required: true,
        },
        {
          name: "maxuses",
          description: "The amount of redeems this code can have",
          type: ApplicationCommandOptionType.Integer,
          required: true,
        },
      ],
    },
    {
      name: "wipedata",
      description: "Wipe a users data with everything included",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "userid",
          description: "The users ID you wish to wipe",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    },
    {
      name: "listguilds",
      description: "List all guilds the bot is currently in",
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: "eval",
      description: "Evaluate an exprecion with the API",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "toeval",
          description: "The code to evaluate",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    },
    {
      name: "economy",
      description: "Alter the economy of a trainer",
      type: ApplicationCommandOptionType.SubcommandGroup,
      options: [
        {
          name: "set",
          description: "Set a trainers economy",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "userid",
              description: "The users ID you wish to alter",
              type: ApplicationCommandOptionType.String,
              required: true,
            },
            {
              name: "type",
              description:
                "The type of economy you wish to alter for the trainer",
              type: ApplicationCommandOptionType.String,
              required: true,
              choices: [
                {
                  name: "Coins",
                  value: "COINS",
                },
                {
                  name: "Tokens",
                  value: "TOKENS",
                },
              ],
            },
            {
              name: "amount",
              description: "The amount you wish to alter the users economy",
              type: ApplicationCommandOptionType.Integer,
              required: true,
            },
          ],
        },
        {
          name: "add",
          description: "Add economy to a trainer",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "userid",
              description: "The users ID you wish to alter",
              type: ApplicationCommandOptionType.String,
              required: true,
            },
            {
              name: "type",
              description:
                "The type of economy you wish to alter for the trainer",
              type: ApplicationCommandOptionType.String,
              required: true,
              choices: [
                {
                  name: "Coins",
                  value: "COINS",
                },
                {
                  name: "Tokens",
                  value: "TOKENS",
                },
              ],
            },
            {
              name: "amount",
              description: "The amount you wish to alter the users economy",
              type: ApplicationCommandOptionType.Integer,
              required: true,
            },
          ],
        },
      ],
    },
  ],
  run: async ({ interaction, client }) => {
    if (interaction.options.getSubcommand() === "addpokemon") {
      const pokeId: number | null = interaction.options.getInteger("pokedexid");
      let pokeName: string | null = interaction.options.getString("name");
      let evolveName: string | null =
        interaction.options.getString("evolvename");
      const pokeRarity: string | null =
        interaction.options.getString("pokerarity");
      const pokeType: string | null = interaction.options.getString("poketype");
      const evolveStage: number | null =
        interaction.options.getInteger("currentstage");
      const evolveLevel: number | null =
        interaction.options.getInteger("evolvelevel");
      const hasAlolan: boolean | null =
        interaction.options.getBoolean("hasalolan");

      const evHP: number | null = interaction.options.getInteger("ev_hp");
      const evAttack: number | null =
        interaction.options.getInteger("ev_attack");
      const evDef: number | null = interaction.options.getInteger("ev_def");
      const evSpAtk: number | null = interaction.options.getInteger("ev_spatk");
      const evSpDef: number | null = interaction.options.getInteger("ev_spdef");
      const evSpeed: number | null = interaction.options.getInteger("ev_speed");

      if (!pokeId) return;
      if (!pokeName) return;
      if (!evolveName) return;
      if (!pokeRarity) return;
      if (!pokeType) return;
      if (!evolveStage) return;
      if (!evolveLevel) return;
      if (!hasAlolan === null) return;

      if (!evHP) return;
      if (!evAttack) return;
      if (!evDef) return;
      if (!evSpAtk) return;
      if (!evSpDef) return;
      if (!evSpeed) return;

      pokeName = pokeName.toLowerCase();
      pokeName = CapitalizeFirst(pokeName);

      evolveName = evolveName.toLowerCase();
      evolveName = CapitalizeFirst(evolveName);

      const pokePicture: string = `https://pgaminghd.github.io/discmon-images/pokemon-sprites/normal/${pokeId}.png`;
      const pokeShinyPicture: string = `https://pgaminghd.github.io/discmon-images/pokemon-sprites/shiny/${pokeId}.png`;

      let pokeAlolanPicture: string | null;
      if (hasAlolan) {
        pokeAlolanPicture = `https://pgaminghd.github.io/discmon-images/pokemon-sprites/alolan/normal/${pokeId}.png`;
      } else {
        pokeAlolanPicture = null;
      }

      if (
        pokeRarity.toUpperCase() !== PokemonRarity.RARE &&
        pokeRarity.toUpperCase() !== PokemonRarity.COMMON &&
        pokeRarity.toUpperCase() !== PokemonRarity.UNCOMMON &&
        pokeRarity.toUpperCase() !== PokemonRarity.LEGEND &&
        pokeRarity.toUpperCase() !== PokemonRarity.MYTHICAL &&
        pokeRarity.toUpperCase() !== PokemonRarity.ULTRABEAST &&
        pokeRarity.toUpperCase() !== PokemonRarity.SHINY &&
        pokeRarity.toUpperCase() !== PokemonRarity.DEVELOPER
      )
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setColor(Colours.RED)
              .setDescription(
                "The rarity is invalid, must be of a valid rarity."
              ),
          ],
        });

      const alrExists: Pokemon | null = await db.GetPokemon(pokeName);

      if (alrExists)
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setColor(Colours.RED)
              .setDescription("The Pokémon you tried to add already exists."),
          ],
        });

      const pokemonType: PokeType[] = [
        PokeType.NORMAL,
        PokeType.FIRE,
        PokeType.WATER,
        PokeType.GRASS,
        PokeType.FLYING,
        PokeType.FIGHTING,
        PokeType.POISON,
        PokeType.ELECTRIC,
        PokeType.GROUND,
        PokeType.ROCK,
        PokeType.PSYCHIC,
        PokeType.ICE,
        PokeType.BUG,
        PokeType.GHOST,
        PokeType.STEEL,
        PokeType.DRAGON,
        PokeType.DARK,
        PokeType.FAIRY,
      ];

      const allTypes: string[] = pokeType.split(",");

      if (allTypes.length === 0)
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setColor(Colours.RED)
              .setDescription(
                "The types field is empty, please enter atleast 1 type."
              ),
          ],
        });

      const pokemonTypes: any[] = [];
      for (const type of allTypes) {
        if (!pokemonType.includes(type.toUpperCase() as PokeType))
          return interaction.reply({
            ephemeral: true,
            embeds: [
              new EmbedBuilder()
                .setColor(Colours.RED)
                .setDescription(
                  "One of the entered Pokémon types are invalid."
                ),
            ],
          });

        pokemonTypes.push({
          pokemonType: type.toUpperCase(),
          typeUniqueId: GenerateFlake(),
        });
      }

      await db.AddNewPokemon({
        pokemonId: GenerateFlake(),
        pokemonPokedex: pokeId,
        pokemonName: pokeName,
        pokemonPicture: pokePicture,
        pokemonRarity: pokeRarity.toUpperCase(),
        pokemonShinyPicture: pokeShinyPicture,
        pokemonAlolanPicture: pokeAlolanPicture,
        pokemonEvolve: {
          create: {
            evolveUniqueId: GenerateFlake(),
            nextEvolveName: evolveName,
            nextEvolveLevel: evolveLevel,
            currentEvolveStage: evolveStage,
          },
        },
        pokemonType: {
          create: pokemonTypes,
        },
        pokemonEVs: {
          create: {
            HP: evHP,
            Attack: evAttack,
            Defense: evDef,
            SpecialAtk: evSpAtk,
            SpecialDef: evSpDef,
            Speed: evSpeed,
          },
        },
      });

      return interaction.reply({
        ephemeral: true,
        embeds: [
          new EmbedBuilder()
            .setColor(Colours.GREEN)
            .setDescription(
              `The Pokémon \`${pokeName}\` has been added into the database successfully with all types & evolve data!`
            ),
        ],
      });
    } else if (interaction.options.getSubcommand() === "despawnpokemon") {
      let pokeName: string | null = await interaction.options.getString("name");

      if (!pokeName) return;
      if (!interaction.guild) return;
      if (!interaction.channel) return;

      pokeName = CapitalizeFirst(pokeName);

      const spawnedPokemon: Pokemons | null = await db.FindSpawnedPokemon(
        interaction.channel.id,
        pokeName
      );
      if (!spawnedPokemon)
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setColor(Colours.RED)
              .setDescription(
                "The Pokémon with that name is not spawned in this channel, is the channel correct?"
              ),
          ],
        });

      if (spawnedPokemon) {
        try {
          const channel: TextChannel = (await interaction.guild.channels.fetch(
            spawnedPokemon.spawnedChannel as string
          )) as TextChannel;
          if (!channel) return;
          const oldMessage: Message<true> = await channel.messages.fetch(
            spawnedPokemon.spawnedMessage as string
          );
          await oldMessage.edit({
            content: `:x: The \`${spawnedPokemon.pokemonName}\` was forcefully despawned by a Developer.`,
            embeds: [],
            components: [],
          });
        } catch {}

        await db.DeleteSpawnedPokemon(spawnedPokemon.pokemonId);
      }

      return interaction.reply({
        ephemeral: true,
        embeds: [
          new EmbedBuilder()
            .setColor(Colours.GREEN)
            .setDescription(
              `The Pokémon \`${pokeName}\` was successfully despawned from this channel!`
            ),
        ],
      });
    } else if (interaction.options.getSubcommand() === "fetchpokemons") {
      const allPokemons: any = await db.FindAllPokemons();
      const pokemonData: string[] = [];

      for (const pokemon of allPokemons) {
        const IVpercentage =
          pokemon.PokemonIVs.HP +
          pokemon.PokemonIVs.Attack +
          pokemon.PokemonIVs.Defense +
          pokemon.PokemonIVs.SpecialAtk +
          pokemon.PokemonIVs.SpecialDef +
          pokemon.PokemonIVs.Speed;
        const IVtotal: string = ((IVpercentage / 186) * 100).toFixed(2);

        pokemonData.push(
          `***[${pokemon.pokemonCatch === true ? "S" : "C"}]*** ${
            pokemon.pokemonOwner === null
              ? `\`${pokemon.spawnedServer}\``
              : `\`${pokemon.pokemonOwner}\``
          } **${pokemon.pokemonName}** • Lvl. ${
            pokemon.pokemonLevel
          } • *IV ${IVtotal}%*`
        );
      }

      const pages: string[][] = chunk(pokemonData, 15);
      const embeds: APIEmbed[] = [];

      let currentPage: number = 0;
      for (const page of pages) {
        currentPage++;
        embeds.push({
          title: `👑 All Pokémons 👑`,
          description: `${page.join("\n")}`,
          footer: {
            text: `Page ${currentPage} of ${pages.length}`,
          },
          color: Colours.MAIN,
        });
      }

      return sendPagination(interaction, embeds, 120000, 120000, true, 0);
    } else if (interaction.options.getSubcommand() === "spawnmax") {
      if (!interaction.guild) return;

      await db.IncrementServerSpawnChance(interaction.guild.id, 50);

      return interaction.reply({
        ephemeral: true,
        embeds: [
          new EmbedBuilder()
            .setColor(Colours.GREEN)
            .setDescription(
              `The server spawner was made \`100%\`, next message will instantly spawn a Pokémon!`
            ),
        ],
      });
    } else if (interaction.options.getSubcommand() === "spawnpokemon") {
      let pokeName: string | null = interaction.options.getString("pokename");
      const pokeLevel: number | null =
        interaction.options.getInteger("pokelevel");
      const maxIV: boolean | null = interaction.options.getBoolean("maxiv");
      const isShiny: boolean | null = interaction.options.getBoolean("shiny");

      if (!pokeName) return;
      if (!pokeLevel) return;
      if (maxIV === null) return;
      if (isShiny === null) return;
      if (!interaction.guild) return;

      pokeName = CapitalizeFirst(pokeName);

      const getPokemon: Pokemon | null = await db.GetPokemon(pokeName);
      const getPokemonServer: PokemonServer | null = await db.GetServer(
        interaction.guild.id
      );

      if (!getPokemon)
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setColor(Colours.RED)
              .setDescription(
                "No Pokémon was found with the specified name, is it valid?"
              ),
          ],
        });
      if (!getPokemonServer)
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setColor(Colours.RED)
              .setDescription(
                "No Pokémon Server was found, please send a message first to initialize."
              ),
          ],
        });

      await forceSpawn(
        interaction,
        pokeName,
        getPokemonServer,
        pokeLevel,
        maxIV,
        isShiny
      );

      return interaction.reply({
        ephemeral: true,
        embeds: [
          new EmbedBuilder()
            .setColor(Colours.GREEN)
            .setDescription(
              `The Pokémon \`${pokeName}\` was successfully spawned with level \`${pokeLevel}\`!`
            ),
        ],
      });
    } else if (interaction.options.getSubcommand() === "createcode") {
      const code: string | null = interaction.options.getString("code");
      const type: string | null = interaction.options.getString("type");
      const maxuses: number | null = interaction.options.getInteger("maxuses");
      const rewardamount: number | null =
        interaction.options.getInteger("rewardamount");

      if (!code) return;
      if (!type) return;
      if (!maxuses) return;
      if (!rewardamount) return;

      const findExisting: globalCodes | null = await db.FindCode(code);
      if (findExisting)
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setColor(Colours.RED)
              .setDescription(
                `A code with the exact same name already exists, please try another name!`
              ),
          ],
        });

      await db.CreateCode(code, type as RewardType, rewardamount, maxuses);

      return interaction.reply({
        ephemeral: true,
        embeds: [
          new EmbedBuilder()
            .setColor(Colours.GREEN)
            .setDescription(
              `The code \`${code}\` has been successfully added with redeem amount of \`${maxuses}\`!`
            ),
        ],
      });
    } else if (interaction.options.getSubcommand() === "wipedata") {
      const userId: string | null = interaction.options.getString("userid");
      if (!userId) return;

      const usersData: userData | null = await db.FindPokemonTrainer(userId);
      if (!usersData)
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setColor(Colours.RED)
              .setDescription(`The UserID you wish to wipe is not valid.`),
          ],
        });

      await db.DeleteAllTrainerPokemons(usersData.userId);
      await db.RemoveTrainerData(usersData.userId);

      return interaction.reply({
        ephemeral: true,
        embeds: [
          new EmbedBuilder()
            .setColor(Colours.GREEN)
            .setDescription(`The users data has been successfully wiped.`),
        ],
      });
    } else if (interaction.options.getSubcommand() === "listguilds") {
      const guilds = client.guilds.cache;

      const data: string[] = [];
      guilds.map((guild) =>
        data.push(
          `**[**\`${guild.id}\`**]** • ***${guild.name}*** • *${guild.memberCount} members*`
        )
      );

      const pages: string[][] = chunk(data, 15);
      const embeds: APIEmbed[] = [];

      let currentPage: number = 0;
      for (const page of pages) {
        currentPage++;
        embeds.push({
          title: `🤖 Client Guilds 🤖`,
          description: `${page.join("\n")}`,
          footer: {
            text: `Page ${currentPage} of ${pages.length}`,
          },
          color: Colours.MAIN,
        });
      }

      return sendPagination(interaction, embeds, 120000, 120000, true, 0);
    } else if (interaction.options.getSubcommand() === "eval") {
      if (interaction.user.id !== "266726434855321600") return;
      const evalMsg: string | null = interaction.options.getString("toeval");

      if (!evalMsg)
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(Colours.RED)
              .setDescription(`Please insert arguments to evaluate.`),
          ],
        });

      let evaled;
      try {
        if (evalMsg.includes(`token`)) return;

        evaled = await eval(evalMsg);
        let string: string = inspect(evaled);
        if (!client.token) return;
        if (!client.user) return;

        if (string.includes(client.token)) return;

        let evalEmbed: EmbedBuilder = new EmbedBuilder().setTitle(
          `${client.user.username} | EVALUTION`
        );
        evalEmbed.setDescription(
          `***Input:***\n\`\`\`js\n${evalMsg}\n\`\`\`\n***Output:***\n\`\`\`js\n${
            !!string ? "?" : string
          }\n\`\`\``
        );
        return interaction.reply({
          embeds: [evalEmbed.setColor(Colours.MAIN).setTimestamp()],
        });
      } catch (e: any) {
        const evalEmbed2 = new EmbedBuilder();
        evalEmbed2.setTitle(`Something went wrong`);
        evalEmbed2.setDescription(`\`\`\`${e.message}\`\`\``);
        return interaction.reply({
          embeds: [evalEmbed2.setColor(Colours.RED).setTimestamp()],
        });
      }
    } else if (interaction.options.getSubcommandGroup() === "economy") {
      const userId = interaction.options.getString("userid") || "123";
      const type = interaction.options.getString("type") || "COINS";
      const amount = interaction.options.getInteger("amount") || 0;
      const status = interaction.options.getSubcommand() || "add";

      const getTrainer = await db.FindPokemonTrainer(userId);

      if (!getTrainer)
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setColor(Colours.RED)
              .setDescription(`The trainer you tried to alter does not exist.`),
          ],
        });

      if (status === "set") {
        if (type === "COINS") {
          await db.SetCoins(userId, amount);
        } else {
          await db.SetTokens(userId, amount);
        }

        return interaction.reply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setColor(Colours.GREEN)
              .setDescription(
                `The trainers economy has been successfully set to \`${amount}\` **${CapitalizeFirst(
                  type.toLowerCase()
                )}**!`
              ),
          ],
        });
      } else if (status === "add") {
        if (type === "COINS") {
          await db.AddCoins(userId, amount);
        } else {
          await db.AddTokens(userId, amount);
        }

        return interaction.reply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setColor(Colours.GREEN)
              .setDescription(
                `The trainers economy has been successfully added \`${amount}\` **${CapitalizeFirst(
                  type.toLowerCase()
                )}**`
              ),
          ],
        });
      } else {
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setColor(Colours.RED)
              .setDescription(
                `The subcommand you tried to use is not valid or does not exist anymore.`
              ),
          ],
        });
      }
    } else {
      return interaction.reply({
        ephemeral: true,
        embeds: [
          new EmbedBuilder()
            .setColor(Colours.RED)
            .setDescription(
              `The subcommand you tried to use is not valid or does not exist anymore.`
            ),
        ],
      });
    }
  },
});
