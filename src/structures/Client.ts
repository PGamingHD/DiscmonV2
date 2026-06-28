import {
  ApplicationCommandDataResolvable,
  ApplicationCommandType,
  Client,
  ClientEvents,
  Collection,
  GatewayIntentBits,
  Partials,
} from "discord.js";

import glob from "glob";
import { promisify } from "util";
import path from "path";
import { readdirSync } from "fs";

import { Event } from "./Event";
import { CommandType, MenuType, RegisterCommandsOptions } from "../@types";
import { ButtonType, ModalType, TextType } from "../@types/Command";

import logger from "../utils/logger";
import { HasUpperCase } from "../utils/misc";
import autoPoster from "../utils/actions/autoPoster";
import catchBuddy from "../utils/actions/catchBuddy";
import redis from "../utils/redis";

const globPromise = promisify(glob);

export class ExtendedClient extends Client {
  textcommands: Collection<string, TextType> = new Collection();
  commands: Collection<string, CommandType> = new Collection();
  contextmenus: Collection<string, MenuType> = new Collection();
  modals: Collection<string, ModalType> = new Collection();
  buttons: Collection<string, ButtonType> = new Collection();

  changelogFiles: Collection<number, any> = new Collection();

  awardCooldowns: Collection<string, string> = new Collection();
  xpCooldowns: Collection<string, string> = new Collection();
  captchaSent: Collection<string, string> = new Collection();
  battleCooldowns: Collection<string, string> = new Collection();

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMembers,
      ],
      partials: [Partials.Channel],
    });
  }

  // =========================
  // START BOT
  // =========================
  async start() {
    await this.login(process.env.TOKEN);
    const modules = await this.RegisterModules();
    await this.HandleReady(modules.global, modules.guild);
  }

  // =========================
  // IMPORT HELPER
  // =========================
  async ImportFile(filePath: string) {
    try {
      return (await import(filePath))?.default;
    } catch (err) {
      logger.error(`Failed to import file: ${filePath}`);
      console.error(err);
      return null;
    }
  }

  // =========================
  // REGISTER MODULES
  // =========================
  async RegisterModules() {
    await redis.incr("client:restarts");

    const globalCommands: ApplicationCommandDataResolvable[] = [];
    const guildCommands: ApplicationCommandDataResolvable[] = [];

    const root = path.join(__dirname, "..");

    const commandFiles = await globPromise("/commands/*/*{.ts,.js}", { root });
    const textFiles = await globPromise("/text/*/*{.ts,.js}", { root });
    const modalFiles = await globPromise("/modals/*/*{.ts,.js}", { root });
    const buttonFiles = await globPromise("/buttons/*/*{.ts,.js}", { root });
    const eventFiles = await globPromise("/events/*{.ts,.js}", { root });

    // =========================
    // COMMANDS
    // =========================
    for (const filePath of commandFiles) {
      const command: CommandType | MenuType = await this.ImportFile(filePath);
      if (!command?.name) continue;

      if (command.main) {
        guildCommands.push(command);
      } else {
        globalCommands.push(command);
      }

      if (command.type === ApplicationCommandType.ChatInput) {
        this.commands.set(command.name, command);
      } else {
        this.contextmenus.set(command.name, command as MenuType);
      }
    }

    // =========================
    // TEXT COMMANDS
    // =========================
    for (const filePath of textFiles) {
      const command: TextType = await this.ImportFile(filePath);
      if (!command?.name) continue;

      this.textcommands.set(command.name, command);
    }

    // =========================
    // MODALS
    // =========================
    for (const filePath of modalFiles) {
      const modal: ModalType = await this.ImportFile(filePath);
      if (!modal?.customId) continue;

      this.modals.set(modal.customId, modal);
    }

    // =========================
    // BUTTONS
    // =========================
    for (const filePath of buttonFiles) {
      const button: ButtonType = await this.ImportFile(filePath);
      if (!button?.customId) continue;

      this.buttons.set(button.customId, button);
    }

    // =========================
    // CHANGELONGS
    // =========================
    const changelogs = readdirSync(process.cwd() + "/src/changelog/");

    for (const file of changelogs) {
      const filecontent = require(process.cwd() + `/src/changelog/${file}`);

      this.changelogFiles.set(filecontent.ChangelogNumber, {
        ChangelogTitle: filecontent.ChangelogTitle,
        ChangelogDescription: filecontent.ChangelogDescription,
        ChangelogTimestamp: filecontent.ChangelogTimestamp,
      });
    }

    // =========================
    // EVENTS
    // =========================
    for (const filePath of eventFiles) {
      const event: Event<keyof ClientEvents> = await this.ImportFile(filePath);
      if (!event) continue;

      this.on(event.event, event.run);
    }

    return {
      global: globalCommands,
      guild: guildCommands,
    };
  }

  // =========================
  // READY + COMMAND DEPLOY
  // =========================
  async HandleReady(
    global: ApplicationCommandDataResolvable[],
    guilds: ApplicationCommandDataResolvable[],
  ) {
    this.once("ready", async () => {
      try {
        logger.log("Bot ready!");

        if (!this.application) {
          await this.application;
        }

        console.log("GLOBAL COMMANDS:", global.length);
        console.log("GUILD COMMANDS:", guilds.length);

        // =========================
        // GLOBAL COMMANDS
        // =========================
        await this.application?.commands.set(global);

        logger.log("Global commands registered");

        // =========================
        // GUILD COMMANDS
        // =========================
        const guildId = process.env.GUILD_ID;

        if (guildId) {
          const guild = await this.guilds.fetch(guildId);

          await guild.commands.set(guilds);

          logger.log("Guild commands registered");
        }

        await autoPoster(this);
        await catchBuddy(this);
      } catch (err) {
        logger.error("Failed during ready initialization:");
        console.error(err);
      }
    });
  }

  // =========================
  // REGISTER WRAPPER
  // =========================
  async Registerer(
    global: ApplicationCommandDataResolvable[],
    guild: ApplicationCommandDataResolvable[],
  ) {
    await this.HandleReady(global, guild);
  }
}
