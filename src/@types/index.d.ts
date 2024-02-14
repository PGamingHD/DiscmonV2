export { sendEmbedOptions } from "./sendEmbedOptions";
export {
  CommandType,
  MenuType,
  TextType,
  ButtonType,
  ModalType,
} from "./Command";
export { RegisterCommandsOptions } from "./Client";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      token: string;
      guildId: string;
      enviroment: "dev" | "prod" | "debug";
      DATABASE_URL: string;
    }
  }
}

export {};
