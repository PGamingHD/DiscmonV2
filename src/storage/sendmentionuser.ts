import { Command } from "../structures/Command";
import sendSelectMentionMenu from "../utils/messages/sendSelectMentionMenu";

export default new Command({
  name: "sendselectmention",
  description: "This is just a user command, desc here!",
  noDefer: true,
  run: async ({ interaction, client }) => {
    return sendSelectMentionMenu(
      interaction,
      true,
      60000,
      60000,
      async (i: any) => {
        if (!i.deferred) await i.deferUpdate();
        console.log("LOGGED SELECTION");
        console.log(i);
      },
      async (i: any, reason: string) => {
        console.log("LOGGED ENDING");
        console.log(i, reason);
      },
      "channelMenu",
      "This is placeholder for channel menu!",
      1,
      "This is the content!"
    );
  },
});
