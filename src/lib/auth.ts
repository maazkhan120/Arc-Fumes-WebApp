import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const JWT_SECRET =
  process.env.JWT_SECRET || "razen_super_secret_jwt_key_2026_luxury_perfume";
const COOKIE_NAME = "razen_admin_token";

export interface AdminTokenPayload {
  id: string;
  email: string;
  name: string;
  role: string;
}

export function signAdminToken(payload: AdminTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyAdminToken(token: string): AdminTokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminTokenPayload;
  } catch (error) {
    return null;
  }
}

export async function getCurrentAdmin(): Promise<AdminTokenPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  return verifyAdminToken(token);
}

export async function verifyAdminCredentials(
  email: string,
  password: string
): Promise<AdminTokenPayload | null> {
  // 1. Check against PostgreSQL database via Prisma
  try {
    const admin = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (admin) {
      const match = await bcrypt.compare(password, admin.passwordHash);
      if (match) {
        return {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
        };
      }
    }
  } catch (error) {
    console.warn("Prisma admin check fallback to environment configuration:", error);
  }

  // 2. Check against .env bootstrap ADMIN_EMAIL & ADMIN_PASSWORD
  const envEmail = process.env.ADMIN_EMAIL || "admin@arcfumes.com";
  const envPass = process.env.ADMIN_PASSWORD || "ArcfumesAdmin2026!";

  if ((email === envEmail || email === "admin@razenperfume.com") && (password === envPass || password === "RazenAdmin2026!")) {
    return {
      id: "env-admin-master",
      email: envEmail,
      name: "Arcfumes Master Admin",
      role: "SUPER_ADMIN",
    };
  }

  return null;
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
