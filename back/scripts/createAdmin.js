import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import "dotenv/config";

// 사용법: node scripts/createAdmin.js <email> <password> [name] [SUPER|MANAGER]
const prisma = new PrismaClient();

const [email, password, name = "관리자", role = "SUPER"] = process.argv.slice(2);

async function main() {
  if (!email || !password) {
    console.error("사용법: node scripts/createAdmin.js <email> <password> [name] [SUPER|MANAGER]");
    process.exit(1);
  }

  const hashed = await bcrypt.hash(password, 10);

  // 이미 있으면 비밀번호/이름/권한만 갱신
  const admin = await prisma.admin.upsert({
    where: { email },
    update: { password: hashed, name, role },
    create: { email, password: hashed, name, role },
  });

  console.log(`✔ 관리자 계정 준비 완료: ${admin.email} (${admin.role}, id=${admin.admin_id})`);
}

main()
  .catch((err) => {
    console.error("관리자 생성 오류:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
