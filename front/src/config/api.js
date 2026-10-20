// 배포 시 REACT_APP_API_BASE 에 백엔드 주소를 넣음 (예: https://api.example.com/api)
export const API_BASE = (
  process.env.REACT_APP_API_BASE || "http://localhost:4000/api"
).replace(/\/$/, "");

// 업로드 이미지 등 /api 가 붙지 않는 서버 경로용
export const SERVER_URL = API_BASE.replace(/\/api$/, "");
