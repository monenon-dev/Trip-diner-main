// 배포 환경 설정 (env는 import 시점이 아니라 호출 시점에 읽음)

// FRONTEND_URL: 쉼표로 여러 개 가능 (예: https://trip.example.com,http://localhost:3000)
export function getAllowedOrigins() {
  return (process.env.FRONTEND_URL || "http://localhost:3000")
    .split(",")
    .map((s) => s.trim().replace(/\/$/, ""))
    .filter(Boolean);
}

// 메일 링크 등에 쓰는 대표 프론트 주소 (첫 번째 값)
export function getFrontendUrl() {
  return getAllowedOrigins()[0];
}

// 요청 Origin이 허용 목록에 있으면 그 값을, 아니면 대표 주소를 돌려줌
export function resolveOrigin(origin) {
  const allowed = getAllowedOrigins();
  return origin && allowed.includes(origin) ? origin : allowed[0];
}

// 로그인 쿠키 옵션
// 프론트/백엔드가 같은 도메인의 서브도메인이면 lax 그대로 OK, 완전히 다른 도메인이면 COOKIE_SAMESITE=none
export function cookieSecurity() {
  const sameSite = (process.env.COOKIE_SAMESITE || "lax").toLowerCase();
  const secure = process.env.COOKIE_SECURE === "true" || sameSite === "none";
  return { sameSite, secure };
}
