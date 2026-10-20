import path from "path";
import multer from "multer";
import { createClient } from "@supabase/supabase-js";

// Supabase Storage 업로드 (service_role 키는 서버에서만 사용)
let client;
function getClient() {
  if (!client) {
    const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY 환경변수가 없습니다.");
    }
    client = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });
  }
  return client;
}

const bucket = () => process.env.SUPABASE_BUCKET || "uploads";

// 디스크 대신 메모리로 받아서 바로 Storage로 올림 (이미지만, 5MB 제한)
export const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_, file, cb) => cb(null, file.mimetype.startsWith("image/")),
});

// folder 예: "postImages", "profiles" → 공개 URL 반환
export async function uploadImage(file, folder) {
  const ext = path.extname(file.originalname).toLowerCase();
  const name = `${Date.now()}_${Math.random().toString(36).slice(2)}${ext}`;
  const objectPath = `${folder}/${name}`;

  const storage = getClient().storage.from(bucket());
  const { error } = await storage.upload(objectPath, file.buffer, {
    contentType: file.mimetype,
    upsert: false,
  });
  if (error) throw error;

  return storage.getPublicUrl(objectPath).data.publicUrl;
}
