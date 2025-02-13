import { userData } from "@prisma/client";
import {
  Message,
  AttachmentBuilder,
  EmbedBuilder,
  MessageCollector,
  TextBasedChannel,
  GuildChannel,
} from "discord.js";
import { ExtendedClient } from "../../structures/Client";
import db from "../database";
import { Colours } from "../../@types/Colours";
import {
  Canvas,
  createCanvas,
  Image,
  loadImage,
  SKRSContext2D,
  GlobalFonts,
} from "@napi-rs/canvas";
import path from "path";

/*export default async function (
  trainerData: userData,
  message: Message,
  client: ExtendedClient
) {
  if (
    client.firstMsgDate.has(trainerData.userId) &&
    client.messagesSent.has(trainerData.userId)
  ) {
    const data: number | undefined = client.firstMsgDate.get(
      trainerData.userId
    );
    const msgData: number | undefined = client.messagesSent.get(
      trainerData.userId
    );
    if (!data) return;
    if (!msgData) return;

    if (data + 90000 < Date.now()) {
      client.firstMsgDate.set(trainerData.userId, Date.now());
      client.messagesSent.set(trainerData.userId, 1);
      return;
    }

    if (
      data + 90000 > Date.now() &&
      msgData >= 60 &&
      !client.captchaSent.has(trainerData.userId)
    ) {
      GlobalFonts.registerFromPath(
        process.cwd() + "/src/assets/joe.ttf",
        "Comic Sans"
      );
      const canvas: Canvas = createCanvas(1920, 1080);
      const ctx: SKRSContext2D = canvas.getContext("2d");
      const background: Image = await loadImage(
        path.join(process.cwd() + "/src/assets/hude.png")
      );
      let x: number = 0;
      let y: number = 0;
      ctx.drawImage(background, x, y);
      ctx.font = "200px Comic Sans";
      ctx.rotate(0.0);
      let verifyValue: string = makeid(7);
      var text: TextMetrics = ctx.measureText(verifyValue);
      x = canvas.width / 2 - text.width / 2;
      y = 500;
      ctx.fillText(verifyValue, x, background.height / 2);
      let num: number = 5;
      while (num > 0) {
        let max: number = 1080;
        let min: number = 0;
        const a: number = Math.floor(Math.random() * (max - min + 1)) + min;
        max = 1080;
        min = 0;
        const a2 = Math.floor(Math.random() * (max - min + 1)) + min;
        ctx.strokeStyle = "#000000";
        ctx.beginPath();
        ctx.lineWidth = 15;
        ctx.lineTo(0, a);
        ctx.lineTo(1920, a2);
        ctx.stroke();
        num -= 1;
      }

      const attachment = new AttachmentBuilder(await canvas.encode("png"), {
        name: `captcha-${message.author.id}.png`,
      });

      let triesLeft = 5;
      const embed: EmbedBuilder = new EmbedBuilder()
        .setColor(Colours.RED)
        .setTitle("⚠️ Your account has been flagged ⚠️")
        .setDescription(
          `**Due to unexpected behavior from your account, we have chosen to send a captcha for you to solve. Please solve it quick!**\n*No response from bot means the answer is correct.*\n\n*Note: You must have images enabled on Discord in order to view images, if the image does not load please try to enter an answer to refresh it.*\n\n**You have \`${triesLeft}\` tries left, please make sure to read it correctly.**`
        )
        .setImage(`attachment://captcha-${message.author.id}.png`)
        .setFooter({
          text: "You have 2 minutes to solve the captcha, failure to do so will result in a temp lock of your account.",
        });

      client.captchaSent.set(trainerData.userId, true);

      const captchaMsg = await message.channel.send({
        files: [attachment],
        embeds: [embed],
      });

      const filter = (m: Message): boolean => m.author.id === message.author.id;
      const collector: MessageCollector =
        captchaMsg.channel.createMessageCollector({ filter, time: 120000 });
      collector.on("collect", async (m: Message) => {
        if (m.author.bot) return;
        if (m.content !== verifyValue) triesLeft = triesLeft - 1;

        if (triesLeft <= 0) {
          if (trainerData.userTotalTimeouts === 6) {
            await captchaMsg.edit({
              embeds: [
                new EmbedBuilder()
                  .setColor(Colours.RED)
                  .setDescription(
                    `Captcha solve failed, your account has been disabled for suspicious activities multiple times.`
                  ),
              ],
              files: [],
            });
            await db.SetUserBlacklistedStatus(trainerData.userId, true);
            return;
          }

          await captchaMsg.edit({
            embeds: [
              new EmbedBuilder()
                .setColor(Colours.RED)
                .setDescription(
                  `Captcha solve failed, you have been timed out until <t:${Math.floor(
                    (Date.now() +
                      (trainerData.userTotalTimeouts + 1) * 43200000) /
                      1000
                  )}:R> for suspicious activities.`
                ),
            ],
            files: [],
          });
          await db.SetTimeoutStatus(
            trainerData.userId,
            true,
            Date.now() + (trainerData.userTotalTimeouts + 1) * 43200000
          );
          await db.IncrementTotalTimeouts(trainerData.userId);

          return collector.stop();
        }

        if (m.content === verifyValue) {
          await captchaMsg.edit({
            embeds: [
              new EmbedBuilder()
                .setColor(Colours.GREEN)
                .setDescription("You have successfully solved the captcha!"),
            ],
            files: [],
          });

          client.firstMsgDate.delete(trainerData.userId);
          client.messagesSent.delete(trainerData.userId);
          client.captchaSent.delete(trainerData.userId);

          return collector.stop();
        } else {
          await captchaMsg.edit({
            embeds: [
              embed.setDescription(
                `**Due to unexpected behavior from your account, we have chosen to send a captcha for you to solve. Please solve it quick!**\n*No response from bot means the answer is correct.*\n\n*Note: You must have images enabled on Discord in order to view images, if the image does not load please try to enter an answer to refresh it.*\n\n**You have \`${triesLeft}\` tries left, please make sure to read it correctly.**`
              ),
            ],
          }); // files: [attachment]

          client.firstMsgDate.delete(trainerData.userId);
          client.messagesSent.delete(trainerData.userId);
          client.captchaSent.delete(trainerData.userId);

          return;
        }
      });

      collector.on("end", async (collected, reason: string) => {
        if (reason === "time") {
          try {
            if (trainerData.userTotalTimeouts === 6) {
              await captchaMsg.edit({
                embeds: [
                  new EmbedBuilder()
                    .setColor(Colours.RED)
                    .setDescription(
                      `Captcha solve failed, your account has been disabled for suspicious activities multiple times.`
                    ),
                ],
                files: [],
              });
              await db.SetUserBlacklistedStatus(trainerData.userId, true);
              return;
            }

            await captchaMsg.edit({
              embeds: [
                new EmbedBuilder()
                  .setColor(Colours.RED)
                  .setDescription(
                    `Captcha solve failed, you have been timed out until <t:${Math.floor(
                      (Date.now() +
                        (trainerData.userTotalTimeouts + 1) * 43200000) /
                        1000
                    )}:R> for suspicious activities.`
                  ),
              ],
              files: [],
            });
            await db.SetTimeoutStatus(
              trainerData.userId,
              true,
              Date.now() + (trainerData.userTotalTimeouts + 1) * 43200000
            );
            await db.IncrementTotalTimeouts(trainerData.userId);
            return;
          } catch {
            if (trainerData.userTotalTimeouts === 6) {
              await message.channel.send({
                content: `${message.author}`,
                embeds: [
                  new EmbedBuilder()
                    .setColor(Colours.RED)
                    .setDescription(
                      `Captcha solve failed, your account has been disabled for suspicious activities multiple times.`
                    ),
                ],
              });
              await db.SetUserBlacklistedStatus(trainerData.userId, true);
              return;
            }

            await message.channel.send({
              content: `${message.author}`,
              embeds: [
                new EmbedBuilder()
                  .setColor(Colours.RED)
                  .setDescription(
                    `Captcha solve failed, you have been timed out until <t:${Math.floor(
                      (Date.now() +
                        (trainerData.userTotalTimeouts + 1) * 43200000) /
                        1000
                    )}:R> for suspicious activities.`
                  ),
              ],
            });
            await db.SetTimeoutStatus(
              trainerData.userId,
              true,
              Date.now() + (trainerData.userTotalTimeouts + 1) * 43200000
            );
            await db.IncrementTotalTimeouts(trainerData.userId);
            return;
          }
        }
      });
    }

    return client.messagesSent.set(trainerData.userId, msgData + 1);
  } else {
    client.firstMsgDate.set(trainerData.userId, Date.now());
    client.messagesSent.set(trainerData.userId, 1);
    return;
  }

  //WRITE FUNCTION HERE, NOT SURE WHAT YET, USE LOCAL VALUES TO DECIDE AND NOT DATABASE VALUES; WILL PUT TOO MUCH PREASURE ON SYSTEM!
}*/

function makeid(length: number): string {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
