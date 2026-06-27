require("dotenv").config();
import { createClient, RedisClientType } from "redis";
import logger from "../utils/logger";

export class Redis {
  private isOpen: boolean;

  client: RedisClientType;

  constructor() {
    this.client = createClient({
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
      socket: {
        host: process.env.REDIS_URL,
        port: 14004,
      },
    });

    this.isOpen = this.client.isOpen;

    this.start();
  }

  private async start() {
    try {
      logger.Redis("Connecting to Redis...");

      this.client.on("error", (err) => {
        logger.error(`Redis Error: ${err}`);
      });

      await this.client.connect();

      this.isOpen = this.client.isOpen;

      logger.Redis("Connected to Redis!");
    } catch (err) {
      logger.error(`Failed to connect to Redis: ${err}`);
    }
  }

  //BASIC

  isConnected(): boolean {
    return this.isOpen;
  }

  async set(key: string, value: string) {
    return this.client.set(key, value);
  }

  async get(key: string) {
    return this.client.get(key);
  }

  async incr(key: string) {
    return this.client.incr(key);
  }

  //COOLDOWNS

  async setCooldown(key: string, seconds: number): Promise<void> {
    await this.client.set(key, "1", {
      EX: seconds,
    });
  }

  async hasCooldown(key: string): Promise<boolean> {
    return (await this.client.exists(key)) === 1;
  }

  async getCooldown(key: string): Promise<number> {
    return await this.client.ttl(key);
  }

  async removeCooldown(key: string): Promise<void> {
    await this.client.del(key);
  }
}
