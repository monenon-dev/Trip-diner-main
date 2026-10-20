import express from "express";
import { PrismaClient } from "@prisma/client";
import { imageUpload as upload, uploadImage } from "../../utils/storage.js";

const prisma = new PrismaClient();
const router = express.Router();

// 프로필 업로드
router.post("/upload", upload.single("profile"), async (req, res) => {
  try {
    const { userId } = req.body;

    console.log("REQ.FILE:", req.file);
    console.log("REQ.BODY:", req.body);

    if (!req.file) {
      return res.status(400).json({ success: false, message: "파일 없음" });
    }

    const imgPath = await uploadImage(req.file, "profiles");

    await prisma.user.update({
      where: { user_id: Number(userId) },
      data: { profile_img: imgPath },
    });

    return res.json({
      success: true,
      imageUrl: imgPath,
    });
  } catch (err) {
    console.error("업로드 오류 발생:", err);
    return res.status(500).json({
      success: false,
      message: "서버 오류",
    });
  }
});

export default router;
