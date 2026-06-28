import { REST, Routes, ApplicationCommandDataResolvable } from "discord.js";
import glob from "glob";
import { promisify } from "util";
import path from "path";
import "dotenv/config"; // Ensures your .env file is loaded

const globPromise = promisify(glob);

// Adjust this root path if you place deploy-commands.ts in a different folder depth
const root: string = path.join(__dirname, "..");

async function deployCommands() {
  const globalCommands: ApplicationCommandDataResolvable[] = [];
  const guildSpecific: ApplicationCommandDataResolvable[] = [];

  // 1. Find all command files (mirroring your ExtendedClient logic)
  const commandFiles: string[] = await globPromise("/commands/*/*{.ts,.js}", {
    root,
  });

  console.log(`Found ${commandFiles.length} command files. Categorizing...`);

  for (const filePath of commandFiles) {
    const command = (await import(filePath))?.default;
    if (!command || !command.name) continue;

    if (command.main) {
      guildSpecific.push(command);
    } else {
      globalCommands.push(command);
    }
  }

  // 2. Initialize the REST module
  // Make sure you have your CLIENT_ID in your .env file!
  const rest = new REST({ version: "10" }).setToken(
    process.env.TOKEN as string,
  );

  try {
    console.log(
      `Started refreshing ${globalCommands.length} global and ${guildSpecific.length} local commands.`,
    );

    // 3. Deploy Guild (Local) Commands
    if (process.env.guildId && guildSpecific.length > 0) {
      await rest.put(
        Routes.applicationGuildCommands(
          process.env.CLIENT_ID as string,
          process.env.guildId,
        ),
        { body: guildSpecific },
      );
      console.log(
        `✅ Successfully reloaded ${guildSpecific.length} local (guild) commands.`,
      );
    }

    // 4. Deploy Global Commands
    if (globalCommands.length > 0) {
      await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID as string),
        { body: globalCommands },
      );
      console.log(
        `🌍 Successfully reloaded ${globalCommands.length} global commands.`,
      );
    }
  } catch (error) {
    console.error("❌ Failed to deploy commands:", error);
  }
}

// Run the deployment
deployCommands();
