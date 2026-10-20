// 네이버 검색 API (NAVER API HUB)
// 2026-07 개발자센터(openapi.naver.com) 신규 발급 중단 → NCP API HUB 로 이관
// 응답 형식(items, title, mapx ...)은 기존과 같음
export const NAVER_SEARCH_BASE = "https://naverapihub.apigw.ntruss.com/search/v1";

// env는 호출 시점에 읽음 (import 시점엔 dotenv 로드 전일 수 있음)
export function naverSearchHeaders() {
  return {
    "X-NCP-APIGW-API-KEY-ID": process.env.NAVER_SEARCH_CLIENT_ID?.trim() || "",
    "X-NCP-APIGW-API-KEY": process.env.NAVER_SEARCH_CLIENT_SECRET?.trim() || "",
  };
}

export function hasNaverSearchKey() {
  return Boolean(process.env.NAVER_SEARCH_CLIENT_ID && process.env.NAVER_SEARCH_CLIENT_SECRET);
}
