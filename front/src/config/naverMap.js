// 네이버 클라우드 Maps Client ID (배포 시 REACT_APP_NAVER_MAP_KEY 에 넣음)
// NCP 콘솔의 Web 서비스 URL 에 등록된 주소에서만 지도가 뜸
export const NAVER_MAP_KEY = process.env.REACT_APP_NAVER_MAP_KEY || "";

export const NAVER_MAP_SCRIPT_URL = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NAVER_MAP_KEY}`;
