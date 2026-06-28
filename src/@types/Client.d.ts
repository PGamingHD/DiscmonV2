import { ApplicationCommandDataResolvable } from "discord.js";

export interface RegisterCommandsOptions {
  guildId?: string;
  globalCommands: ApplicationCommandDataResolvable[];
  localCommands: ApplicationCommandDataResolvable[];
}
