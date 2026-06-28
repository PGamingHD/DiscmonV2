import {
  ApplicationCommandDataResolvable,
  ApplicationCommandType,
  Client,
  ClientEvents,
  Collection,
  Events,
  GatewayIntentBits,
  Partials,
} from "discord.js";
import glob from "glob";
import { promisify } from "util";
import { Event } from "./Event";
import { CommandType, MenuType, RegisterCommandsOptions } from "../@types";
import { ButtonType, ModalType, TextType } from "../@types/Command";
import path from "path";
import logger from "../utils/logger";
import { HasUpperCase } from "../utils/misc";
import { readdirSync } from "fs";
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

  //GLOBAL TEMP VARIABLES
  awardCooldowns: Collection<string, string> = new Collection();
  xpCooldowns: Collection<string, string> = new Collection();
  battleCooldowns: Collection<string, string> = new Collection();
  changelogFiles: Collection<number, any> = new Collection();
  messagesSent: Collection<string, number> = new Collection<string, number>();
  firstMsgDate: Collection<string, number> = new Collection<string, number>();
  captchaSent: Collection<string, boolean> = new Collection<string, boolean>();

  constructor() {
    super({
      waitGuildTimeout: 1000,
      intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessageTyping,
      ],
      partials: [Partials.Channel],
    });
  }

  async start() {
    const commands = await this.RegisterModules();
    await this.login(process.env.TOKEN);
    this.Registerer(commands.global, commands.local);
  }

  async ImportFile(filePath: string) {
    return (await import(filePath))?.default;
  }

  async registerCommands({
    globalCommands,
    localCommands,
    guildId,
  }: RegisterCommandsOptions) {
    if (!this.application)
      return logger.error("No application to register commands for!");

    console.log(
      `Attempting to register ${globalCommands?.length || 0} global commands.`,
    );

    try {
      await this.application.commands.set(globalCommands);
      console.log("SUCCESS: Global commands registered!");
    } catch (error) {
      console.log("FAILED to register global commands:", error);
    }

    if (guildId) {
      const guild = await this.guilds.fetch(guildId);

      if (guild) {
        guild.commands.set(localCommands);
      }
    }
  }

  async RegisterModules() {
    await redis.incr("client:restarts");

    const globalCommands: ApplicationCommandDataResolvable[] = [];
    const guildSpecfic: ApplicationCommandDataResolvable[] = [];

    const root: string = path.join(__dirname, "..");
    const commandFiles: string[] = await globPromise("/commands/*/*{.ts,.js}", {
      root,
    });
    const textFiles: string[] = await globPromise("/text/*/*{.ts,.js}", {
      root,
    });
    const modalFiles: string[] = await globPromise("/modals/*/*{.ts,.js}", {
      root,
    });
    const buttonFiles: string[] = await globPromise("/buttons/*/*{.ts,.js}", {
      root,
    });

    for (const filePath of commandFiles) {
      const command: CommandType | MenuType = await this.ImportFile(filePath);
      if (!command.name) continue;

      if (command?.main) {
        guildSpecfic.push(command);
        if (HasUpperCase(command.name)) {
          logger.command(`Loaded guild contextmenu command "${command.name}"!`);
        } else {
          logger.command(`Loaded guild command "${command.name}"!`);
        }
      } else {
        globalCommands.push(command);
        if (HasUpperCase(command.name)) {
          logger.command(
            `Loaded global contextmenu command "${command.name}"!`,
          );
        } else {
          logger.command(`Loaded global command "${command.name}"!`);
        }
      }
      if (command.type === ApplicationCommandType.ChatInput) {
        this.commands.set(command.name, command);
      } else {
        this.contextmenus.set(command.name, command as MenuType);
      }
    }

    for (const filePath of textFiles) {
      const command: TextType = await this.ImportFile(filePath);
      if (HasUpperCase(command.name))
        logger.error("Text commands may not be uppercased!");
      if (!command.name) continue;

      logger.text(`Loaded text command "${command.name}"!`);

      this.textcommands.set(command.name, command);
    }

    for (const filePath of modalFiles) {
      const modal: ModalType = await this.ImportFile(filePath);
      if (!modal.customId) continue;

      this.modals.set(modal.customId, modal as ModalType);
    }

    for (const filePath of buttonFiles) {
      const button: ButtonType = await this.ImportFile(filePath);
      if (!button.customId) continue;

      this.buttons.set(button.customId, button as ButtonType);
    }

    const changelogs: string[] = readdirSync(process.cwd() + "/src/changelog/");
    changelogs.map((file: string) => {
      const filecontent = require(process.cwd() + `/src/changelog/${file}`);
      const number = filecontent["ChangelogNumber"];
      this.changelogFiles.set(number, {
        ChangelogTitle: filecontent["ChangelogTitle"],
        ChangelogDescription: filecontent["ChangelogDescription"],
        ChangelogTimestamp: filecontent["ChangelogTimestamp"],
      });
    });

    // Events
    const eventFiles = await globPromise("/events/*{.ts,.js}", { root });
    for (const filePath of eventFiles) {
      const event: Event<keyof ClientEvents> = await this.ImportFile(filePath);
      logger.event(`Loaded event "${event.event}"!`);
      this.on(event.event, event.run);
    }

    return { global: globalCommands, local: guildSpecfic };
  }

  async Registerer(
    globalCommands: ApplicationCommandDataResolvable[],
    guildSpecific: ApplicationCommandDataResolvable[],
  ) {
    this.once(Events.ClientReady, async () => {
      await this.registerCommands({
        globalCommands: globalCommands,
        localCommands: guildSpecific,
        guildId: process.env.guildId,
      });

      await autoPoster(this);
      await catchBuddy(this);
    });
  }
}
