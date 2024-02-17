import {
  APIEmbed,
  ApplicationCommandOptionType,
  EmbedBuilder,
} from "discord.js";
import { Command } from "../../structures/Command";
import { Colours } from "../../@types/Colours";
import db from "../../utils/database";
import { Pokemons, PokemonsAuction } from "@prisma/client";
import { chunk } from "lodash";
import sendPagination from "../../utils/messages/sendPagination";

export default new Command({
  name: "auctions",
  description:
    "Auction away one of your special friends, or purchase a new one",
  requireAccount: true,
  noDefer: true,
  options: [
    {
      name: "view",
      description: "View existing auctions",
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: "bid",
      description: "Bid on an existing auction",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "id",
          description: "Auction id to bid on",
          type: ApplicationCommandOptionType.Integer,
          required: true,
        },
        {
          name: "amount",
          description: "The amount you wish to bid on the auction",
          type: ApplicationCommandOptionType.Integer,
          required: true,
        },
      ],
    },
    {
      name: "add",
      description: "Add one of your beloved friends to the auction",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "id",
          description: "The Pokémon id to send to the market",
          type: ApplicationCommandOptionType.Integer,
          required: true,
        },
        {
          name: "start",
          description: "The start amount for the auction",
          type: ApplicationCommandOptionType.Integer,
          required: true,
        },
      ],
    },
  ],
  run: async ({ interaction, client }) => {
    if (interaction.options.getSubcommand() === "view") {
      const auctions: any = await db.FindAllAuctions();

      if (auctions.length === 0)
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setColor(Colours.RED)
              .setDescription(
                "There are no currently ongoing auctions!\n\n*Please add something before viewing again.*"
              ),
          ],
        });

      const pokemonData: string[] = [];
      for (const auction of auctions) {
        const IVpercentage =
          auction.pokemon.PokemonIVs.HP +
          auction.pokemon.PokemonIVs.Attack +
          auction.pokemon.PokemonIVs.Defense +
          auction.pokemon.PokemonIVs.SpecialAtk +
          auction.pokemon.PokemonIVs.SpecialDef +
          auction.pokemon.PokemonIVs.Speed;
        const IVtotal: string = ((IVpercentage / 186) * 100).toFixed(2);

        pokemonData.push(
          `**[**\`${auction.auctionId}\`**]** ${
            auction.pokemon.pokemonPicture.includes("shiny") ? "✨" : ""
          }${auction.pokemon.pokemonPicture.includes("alolan") ? "💿" : ""} **${
            auction.pokemon.pokemonName
          }** • Lvl. ${
            auction.pokemon.pokemonLevel
          } • *IV ${IVtotal}%* • Ends <t:${Math.floor(
            parseInt(auction.endTime) / 1000
          )}:R>\n• Bid: 💎 ${
            auction.auctionCurrent === 0
              ? auction.auctionStart.toLocaleString("en-US")
              : auction.auctionCurrent.toLocaleString("en-US")
          } Pokétokens • <@!${auction.leaderData}> • ${
            auction.bidAmounts == 0
              ? `Auction created <t:${Math.floor(
                  parseInt(auction.leaderBidTime) / 100
                )}:R>`
              : `Bid placed <t:${Math.floor(
                  parseInt(auction.leaderBidTime) / 1000
                )}:R>`
          } • Bids: ${auction.bidAmounts}`
        );
      }

      const pages: string[][] = chunk(pokemonData, 10);
      const embeds: APIEmbed[] = [];

      let currentPage: number = 0;
      for (const page of pages) {
        currentPage++;
        embeds.push({
          title: `👑 __Ongoing Pokémon Auctions__ 👑`,
          description: `${page.join("\n\n")}`,
          footer: {
            text: `Page ${currentPage} of ${pages.length}`,
          },
          color: Colours.MAIN,
        });
      }

      return sendPagination(interaction, embeds, 120000, 120000, false, 0);
    } else if (interaction.options.getSubcommand() === "bid") {
      const id: number | null = interaction.options.getInteger("id");
      const amount: number | null = interaction.options.getInteger("amount");

      if (!id) return;
      if (!amount) return;

      const auction: any = await db.FindSpecificAuction(id);
      const usersData = await db.FindPokemonTrainer(interaction.user.id);
      if (!usersData) return;

      if (!auction)
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setColor(Colours.RED)
              .setDescription(
                "The auction in which id was provided is not valid, please enter a valid auction id."
              ),
          ],
        });
      if (auction.pokemon.pokemonOwner === interaction.user.id)
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setColor(Colours.RED)
              .setDescription(
                "That auction is owned by you, you may not bid on your own auction."
              ),
          ],
        });
      if (auction.leaderData === interaction.user.id)
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setColor(Colours.RED)
              .setDescription(
                "You already have the highest current bid, please wait for someone to outbid you."
              ),
          ],
        });
      if (
        auction.auctionCurrent === 0
          ? auction.auctionStart >= amount
          : auction.auctionCurrent >= amount
      )
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setColor(Colours.RED)
              .setDescription("Your bid must exceed the current auction bid."),
          ],
        });
      if (amount > usersData.userTokens)
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setColor(Colours.RED)
              .setDescription(
                "You cannot afford to place this bid, please try again."
              ),
          ],
        });

      await db.SetAuctionBid(
        id,
        amount,
        auction.bidAmounts + 1,
        Date.now(),
        interaction.user.id
      );

      return interaction.reply({
        ephemeral: true,
        embeds: [
          new EmbedBuilder()
            .setColor(Colours.GREEN)
            .setDescription(
              `You have successfully bid 💎 **${amount}** Pokétokens for auction \`${id}\`!`
            ),
        ],
      });
    } else if (interaction.options.getSubcommand() === "add") {
      const id: number | null = interaction.options.getInteger("id");
      const start: number | null = interaction.options.getInteger("start");

      if (!id) return;
      if (!start) return;

      const pokemonData: Pokemons | null = await db.FindPlacementPokemon(
        interaction.user.id,
        id
      );
      if (!pokemonData)
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setColor(Colours.RED)
              .setDescription(
                "The selected Pokémon does not exist, please try another id."
              ),
          ],
        });
      if (pokemonData.pokemonSelected)
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setColor(Colours.RED)
              .setDescription(
                "That Pokémon is selected, please select another Pokémon to auction out or select another Pokémon."
              ),
          ],
        });
      if (pokemonData.pokemonAuction)
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setColor(Colours.RED)
              .setDescription(
                "That Pokémon is already listed on the auction, please select another Pokémon."
              ),
          ],
        });
      if (pokemonData.pokemonFavorite)
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setColor(Colours.RED)
              .setDescription(
                "That Pokémon is on your favorites list, you wouldn't want to lose it, right?"
              ),
          ],
        });

      let incrementAucId: number = 1;
      const findFirstId: PokemonsAuction | null = await db.FindNextAuctionId();
      if (findFirstId) incrementAucId = findFirstId.auctionId + 1;

      await db.SetPokemonAuction(pokemonData.pokemonId, true);
      await db.AddPokemonAuction(
        pokemonData.pokemonId,
        interaction.user.id,
        Date.now() + 86400000,
        start,
        incrementAucId,
        Date.now()
      );

      setTimeout(async (): Promise<void> => {
        const findAuction: any = await db.FindSpecificAuction(incrementAucId);

        if (findAuction) {
          await db.SetPokemonAuction(pokemonData.pokemonId, false);
          await db.RemovePokemonAuction(pokemonData.pokemonId);

          if (!findAuction.leaderData) return;

          const findUser = await db.FindPokemonTrainer(findAuction.leaderData);
          const findSeller = await db.FindPokemonTrainer(
            findAuction.pokemon.pokemonOwner
          );

          if (!findUser) return;
          if (!findSeller) return;

          const getHighestPoke: Pokemons[] = await db.GetPokemonNextPokeId(
            findAuction.leaderData
          );

          let incrementId;
          if (
            getHighestPoke.length === 0 &&
            getHighestPoke[0].pokemonPlacementId === null
          )
            incrementId = 1;
          if (
            getHighestPoke.length >= 1 &&
            getHighestPoke[0].pokemonPlacementId !== null
          )
            incrementId = getHighestPoke[0].pokemonPlacementId + 1;
          if (!incrementId) incrementId = 1;

          await db.SetPokemonOwner(
            pokemonData.pokemonId,
            findAuction.leaderData,
            incrementId
          );
          if (findAuction.leaderData !== findAuction.pokemon.pokemonOwner) {
            await db.SetTokens(
              findAuction.leaderData,
              parseInt(findUser.userTokens.toString()) -
                findAuction.auctionCurrent
            );
            await db.SetTokens(
              findAuction.pokemon.pokemonOwner,
              findSeller.userTokens + findAuction.auctionCurrent
            );
          }
        }
      }, 1000 * 60 * 60 * 24);

      return interaction.reply({
        ephemeral: true,
        embeds: [
          new EmbedBuilder()
            .setColor(Colours.GREEN)
            .setDescription(
              `You have successfully added your \`${pokemonData.pokemonName}\` to the auction.`
            ),
        ],
      });
    } else {
      return;
    }
  },
});
