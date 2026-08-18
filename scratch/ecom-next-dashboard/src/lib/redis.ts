import { Redis } from '@upstash/redis'
import { Queue } from 'bullmq'

// Redis Client for General Caching
export const redisClient = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// BullMQ Connection Configuration (using Redis for Queueing)
export const queueConnection = {
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
}

// Initialize Sync Queue
export const syncQueue = new Queue('sync-data-queue', {
  connection: queueConnection
})
