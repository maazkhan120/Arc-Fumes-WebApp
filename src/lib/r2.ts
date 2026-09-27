import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME;
const publicUrl = process.env.R2_PUBLIC_DOMAIN || process.env.R2_PUBLIC_URL;

const hasR2Credentials =
  Boolean(accountId &&
  accessKeyId &&
  secretAccessKey &&
  bucketName &&
  !accessKeyId.includes("your-") &&
  !accessKeyId.includes("demo-"));

let s3Client: S3Client | null = null;

if (hasR2Credentials) {
  s3Client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: accessKeyId!,
      secretAccessKey: secretAccessKey!,
    },
  });
}

export async function uploadImage(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string
): Promise<{ imageUrl: string; r2Key: string }> {
  const sanitizedName = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const key = `products/${sanitizedName}`;

  if (s3Client && bucketName && publicUrl) {
    try {
      await s3Client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: key,
          Body: fileBuffer,
          ContentType: contentType,
        })
      );

      const cleanedBaseUrl = publicUrl.replace(/\/$/, "");
      const fullImageUrl = `${cleanedBaseUrl}/${key}`;

      return {
        imageUrl: fullImageUrl,
        r2Key: key,
      };
    } catch (error) {
      console.warn("Cloudflare R2 upload error, falling back to local storage:", error);
    }
  }

  // Development Fallback: Store locally in public/uploads/
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const filePath = path.join(uploadsDir, sanitizedName);
  fs.writeFileSync(filePath, fileBuffer);

  return {
    imageUrl: `/uploads/${sanitizedName}`,
    r2Key: `local/${sanitizedName}`,
  };
}
