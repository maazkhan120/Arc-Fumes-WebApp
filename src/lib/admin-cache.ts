import { prisma } from "./prisma";

// In-memory cache for fast sub-5ms admin page transitions
let cachedOrders: any[] | null = null;
let lastOrdersFetch = 0;

let cachedMessages: any[] | null = null;
let lastMessagesFetch = 0;

const CACHE_TTL_MS = 15000; // 15 seconds
const DB_TIMEOUT_MS = 1200; // 1.2s timeout before graceful fallback

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Query timed out after ${ms}ms`)), ms)
    ),
  ]);
}

export async function getAdminOrders(): Promise<any[]> {
  const now = Date.now();
  if (cachedOrders && now - lastOrdersFetch < CACHE_TTL_MS) {
    return cachedOrders;
  }

  try {
    const orders = await withTimeout(
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          items: true,
          statusHistory: {
            orderBy: { createdAt: "desc" },
          },
        },
      }),
      DB_TIMEOUT_MS
    );

    if (orders) {
      cachedOrders = orders;
      lastOrdersFetch = now;
      return cachedOrders;
    }
  } catch (error) {
    console.warn("Fast fallback for admin orders:", error);
    if (cachedOrders) return cachedOrders;
  }

  return cachedOrders || [];
}

export async function getAdminMessages(): Promise<any[]> {
  const now = Date.now();
  if (cachedMessages && now - lastMessagesFetch < CACHE_TTL_MS) {
    return cachedMessages;
  }

  try {
    const messages = await withTimeout(
      prisma.contactMessage.findMany({
        orderBy: { createdAt: "desc" },
      }),
      DB_TIMEOUT_MS
    );

    if (messages) {
      cachedMessages = messages;
      lastMessagesFetch = now;
      return cachedMessages;
    }
  } catch (error) {
    console.warn("Fast fallback for admin messages:", error);
    if (cachedMessages) return cachedMessages;
  }

  return cachedMessages || [];
}

export function invalidateOrdersCache() {
  cachedOrders = null;
  lastOrdersFetch = 0;
}

export function invalidateMessagesCache() {
  cachedMessages = null;
  lastMessagesFetch = 0;
}
