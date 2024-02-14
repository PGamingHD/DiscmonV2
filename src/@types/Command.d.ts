import {
  ChatInputApplicationCommandData,
  ChatInputCommandInteraction,
  CommandInteractionOptionResolver,
  MessageApplicationCommandData,
  MessageContextMenuCommandInteraction,
  PermissionResolvable,
  UserApplicationCommandData,
  UserContextMenuCommandInteraction,
  ModalSubmitInteraction,
  ModalSubmitInteractionCollectorOptions,
  ModalSubmitFields,
  Message,
  ButtonInteraction,
} from "discord.js";
import { ExtendedClient } from "../structures/Client";

interface TextOptions {
  message: Message;
  client: ExtendedClient;
  args: any;
}

interface RunOptions {
  client: ExtendedClient;
  interaction: ChatInputCommandInteraction;
  args: CommandInteractionOptionResolver;
}

interface MenuOptions {
  client: ExtendedClient;
  interaction:
    | MessageContextMenuCommandInteraction
    | UserContextMenuCommandInteraction;
  args: CommandInteractionOptionResolver;
}

interface ModalOptions {
  client: ExtendedClient;
  interaction: ModalSubmitInteraction;
  args: ModalSubmitFields;
}

interface ButtonOptions {
  client: ExtendedClient;
  interaction: ButtonInteraction;
}

type TextFunction = (options: TextOptions) => any;
type RunFunction = (options: RunOptions) => any;
type MenuFunction = (options: MenuOptions) => any;
type ModalFunction = (options: ModalOptions) => any;
type ButtonFunction = (options: ButtonOptions) => any;

export type TextType = {
  name: string;
  run: TextFunction;
  hidden?: boolean;
} & MessageApplicationCommandData;

export type CommandType = {
  noDefer?: boolean;
  developerRestricted?: boolean;
  adminRestricted?: boolean;
  modRestricted?: boolean;
  requireAccount?: boolean;
  userPermissions?: PermissionResolvable[];
  main?: boolean;
  run: RunFunction;
} & ChatInputApplicationCommandData;

export type MenuType = {
  userPermissions?: PermissionResolvable[];
  main?: boolean;
  run: MenuFunction;
} & (MessageApplicationCommandData | UserApplicationCommandData);

export type ModalType = {
  customId: string;
  run: ModalFunction;
} & ModalSubmitInteractionCollectorOptions<any>;

export type ButtonType = {
  customId: string;
  run: ButtonFunction;
};
