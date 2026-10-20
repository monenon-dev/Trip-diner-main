import { PrismaClient } from "@prisma/client";
import { getPlaces } from "../apis/tourApi.js";
import "dotenv/config";

// 사용법: node scripts/fetchPlaces.js [도시...]   (생략하면 전체 도시)
const prisma = new PrismaClient();

const areaCodeMap = { 서울: 1, 대구: 4, 부산: 6, 제주: 39 };
const contentTypes = { 12: "관광지", 14: "문화시설", 28: "레포츠", 39: "음식점" };

// city.name은 unique가 아니라서 이름으로 찾고 없으면 생성
async function getOrCreateCity(cityName) {
  const found = await prisma.city.findFirst({ where: { name: cityName } });
  if (found) return found;
  return prisma.city.create({ data: { name: cityName, country: "대한민국" } });
}

async function saveCity(cityName) {
  const areaCode = areaCodeMap[cityName];
  if (!areaCode) {
    console.error(`❌ 알 수 없는 도시: ${cityName}`);
    return;
  }

  const city = await getOrCreateCity(cityName);
  console.log(`⏳ ${cityName} 데이터 수집 중...`);
  let total = 0;

  for (const [contentTypeId, category] of Object.entries(contentTypes)) {
    const places = await getPlaces({ areaCode, contentTypeId });

    for (const p of places) {
      if (!p.contentId) continue;

      // content_id 기준 upsert → 좋아요/일정에서 만든 행과 같은 행을 씀
      await prisma.place.upsert({
        where: { content_id: String(p.contentId) },
        update: { city_id: city.city_id },
        create: {
          content_id: String(p.contentId),
          external_id: BigInt(p.contentId),
          name: p.title,
          category,
          address: p.address || null,
          lat: p.lat,
          lng: p.lng,
          image_url: p.image,
          description: p.overview || null,
          city_id: city.city_id,
        },
      });
    }

    total += places.length;
    console.log(`  ✔ ${category} → ${places.length}개 저장`);
  }

  console.log(`🎉 ${cityName} 저장 완료 (총 ${total}개)\n`);
}

(async () => {
  const targets = process.argv.slice(2);
  for (const name of targets.length ? targets : Object.keys(areaCodeMap)) {
    await saveCity(name);
  }
  await prisma.$disconnect();
  process.exit();
})();
