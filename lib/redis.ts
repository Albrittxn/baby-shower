import { Redis } from "@upstash/redis";

let redis: Redis | null = null;

export function getRedis() {
  if (redis) return redis;

  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    throw new Error("Redis environment variables are missing.");
  }

  redis = new Redis({ url, token });
  return redis;
}

export const RSVP_LIST_KEY = "jasmine-baby-shower:rsvps";
