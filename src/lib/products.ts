import { prisma } from "./prisma";
import { INITIAL_PRODUCTS } from "./products-static";
import { CategoryType, ProductItem } from "@/types";

// Fast in-memory cache for ultra-responsive navigation (< 1ms)
let cachedProductsList: ProductItem[] | null = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 30000; // 30 seconds
const DB_TIMEOUT_MS = 600; // Max 600ms wait for DB before fallback

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Query timed out after ${ms}ms`)), ms)
    ),
  ]);
}

export async function getProducts(options?: {
  category?: CategoryType | "ALL";
  featured?: boolean;
}): Promise<ProductItem[]> {
  const now = Date.now();
  const isCacheValid = cachedProductsList && now - lastFetchTime < CACHE_TTL_MS;

  if (!isCacheValid) {
    try {
      const where: any = { active: true };
      if (options?.category && options.category !== "ALL") {
        where.category = options.category;
      }
      if (options?.featured !== undefined) {
        where.featured = options.featured;
      }

      const products = await withTimeout(
        prisma.product.findMany({
          where,
          include: {
            images: {
              orderBy: { sortOrder: "asc" },
            },
          },
          orderBy: { createdAt: "desc" },
        }),
        DB_TIMEOUT_MS
      );

      if (products && products.length > 0) {
        cachedProductsList = products as unknown as ProductItem[];
        lastFetchTime = now;
        return cachedProductsList;
      }
    } catch (error) {
      // Gracefully fall back without blocking user interface
    }
  }

  // Fast fallback to initial 3 signature perfumes from static catalog
  const catalog = cachedProductsList || INITIAL_PRODUCTS;
  return catalog.filter((p) => {
    if (!p.active) return false;
    if (options?.category && options.category !== "ALL" && p.category !== options.category) {
      return false;
    }
    if (options?.featured !== undefined && p.featured !== options.featured) {
      return false;
    }
    return true;
  });
}

export async function getProductBySlug(slug: string): Promise<ProductItem | null> {
  // First check static or cached catalog for immediate response
  if (cachedProductsList) {
    const found = cachedProductsList.find((p) => p.slug === slug);
    if (found) return found;
  }

  try {
    const product = await withTimeout(
      prisma.product.findUnique({
        where: { slug },
        include: {
          images: {
            orderBy: { sortOrder: "asc" },
          },
        },
      }),
      DB_TIMEOUT_MS
    );

    if (product) {
      return product as unknown as ProductItem;
    }
  } catch (error) {
    // Graceful fallback to static
  }

  const staticMatch = INITIAL_PRODUCTS.find((p) => p.slug === slug);
  return staticMatch || null;
}
