import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { requireAdminSessionFromHeaders } from "@/lib/require-admin";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function getConfigError(): string | null {
  const name = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const key = process.env.CLOUDINARY_API_KEY?.trim();
  const secret = process.env.CLOUDINARY_API_SECRET?.trim();
  if (!name || !key || !secret) return "Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to .env (get them from the Cloudinary dashboard).";
  if (name === "your-cloud-name" || key === "your-api-key" || secret === "your-api-secret") return "Replace placeholder Cloudinary values in .env with your real cloud name, API key, and API secret from cloudinary.com.";
  return null;
}

export async function POST(request: Request) {
  const auth = await requireAdminSessionFromHeaders();
  if (auth.error) return auth.error;

  const configError = getConfigError();
  if (configError) {
    return NextResponse.json({ error: configError }, { status: 503 });
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!.trim(),
    api_key: process.env.CLOUDINARY_API_KEY!.trim(),
    api_secret: process.env.CLOUDINARY_API_SECRET!.trim(),
  });

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file || !file.size) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

  try {
    const result = await cloudinary.uploader.upload(base64, {
      folder: "vacation-vibes",
      resource_type: "image",
    });
    return NextResponse.json({ url: result.secure_url });
  } catch (err) {
    const errMessage =
      err instanceof Error
        ? err.message
        : err && typeof err === "object" && "message" in err
          ? String((err as { message?: unknown }).message)
          : err && typeof err === "object" && "error" in err && typeof (err as { error?: { message?: unknown } }).error?.message === "string"
            ? (err as { error: { message: string } }).error.message
            : typeof err === "object" && err !== null
              ? JSON.stringify(err)
              : String(err);
    console.error("Cloudinary upload error:", errMessage, err);
    const userMessage =
      errMessage && /cloud_name is disabled|invalid.*cloud|cloud.*invalid/i.test(errMessage)
        ? "Cloudinary cloud name is invalid or disabled. In .env set CLOUDINARY_CLOUD_NAME to your cloud name from the Cloudinary dashboard (Dashboard → Product credentials)."
        : errMessage || "Upload failed";
    return NextResponse.json(
      { error: userMessage },
      { status: 500 }
    );
  }
}
