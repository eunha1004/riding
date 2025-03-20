// Naver Maps API 클라이언트

// 거리 계산 결과 인터페이스
export interface DistanceResult {
  distance: number; // 미터 단위
  duration: number; // 초 단위
  isValid: boolean;
}

/**
 * 두 주소 사이의 거리와 예상 소요 시간을 계산합니다.
 * @param origin 출발지 주소
 * @param destination 도착지 주소
 * @returns 거리(미터), 소요 시간(초), 유효성 여부를 포함한 객체
 */
export const calculateDistance = async (
  origin: string,
  destination: string,
): Promise<DistanceResult> => {
  try {
    // 실제 API 연동 시 여기에 Naver Maps API 호출 코드 구현
    // 현재는 더미 데이터로 대체

    // 더미 데이터: 두 주소 간 거리를 5~15km 사이로 랜덤하게 설정
    // 주소 문자열에 따라 다른 값을 반환하도록 수정 (예시 데이터)
    let distance = 0;

    // 주소 문자열의 길이를 기반으로 거리 계산 (예시용)
    const combinedLength = origin.length + destination.length;
    distance = 3000 + combinedLength * 100; // 기본 3km + 주소 길이에 따른 추가 거리

    // 최소 3km, 최대 15km로 제한
    distance = Math.max(3000, Math.min(15000, distance));

    // 평균 속도 40km/h로 가정하여 소요 시간 계산 (초 단위)
    // 40km/h = 11.11m/s
    const duration = Math.floor(distance / 11.11);

    console.log(`계산된 거리: ${distance}m, 소요 시간: ${duration}초`);

    return {
      distance,
      duration,
      isValid: true,
    };
  } catch (error) {
    console.error("거리 계산 중 오류 발생:", error);
    return {
      distance: 0,
      duration: 0,
      isValid: false,
    };
  }
};

/**
 * 소요 시간(초)을 기반으로 도착 시간을 계산합니다.
 * @param pickupTime 출발 시간 ("오전 7:30" 형식)
 * @param durationSeconds 소요 시간 (초 단위)
 * @returns 도착 예정 시간 ("오전 8:15" 형식)
 */
export const calculateArrivalTime = (
  pickupTime: string,
  durationSeconds: number,
): string => {
  if (!pickupTime) return "";

  // 시간 문자열 파싱 (예: "오전 7:30")
  const periodMatch = pickupTime.match(/(오전|오후)/);
  const timeMatch = pickupTime.match(/(\d+):(\d+)/);

  if (!periodMatch || !timeMatch) return "";

  const period = periodMatch[0]; // "오전" 또는 "오후"
  let hour = parseInt(timeMatch[1]);
  const minute = parseInt(timeMatch[2]);

  // 12시간제에서 24시간제로 변환
  if (period === "오후" && hour < 12) hour += 12;
  if (period === "오전" && hour === 12) hour = 0;

  // 초를 시간과 분으로 변환
  const durationMinutes = Math.floor(durationSeconds / 60);
  const additionalHours = Math.floor(durationMinutes / 60);
  const additionalMinutes = durationMinutes % 60;

  // 시간 계산
  let newHour = hour + additionalHours;
  let newMinute = minute + additionalMinutes;

  // 분이 60을 넘으면 시간 조정
  if (newMinute >= 60) {
    newHour += 1;
    newMinute -= 60;
  }

  // 24시간제에서 12시간제로 다시 변환
  const newPeriod = newHour < 12 ? "오전" : "오후";
  const displayHour = newHour % 12 === 0 ? 12 : newHour % 12;

  return `${newPeriod} ${displayHour}:${newMinute < 10 ? "0" + newMinute : newMinute}`;
};

/**
 * 두 시간 사이의 차이가 유효한지 확인합니다 (1시간 이내)
 * @param pickupTime 출발 시간 ("오전 7:30" 형식)
 * @param dropoffTime 도착 시간 ("오전 8:30" 형식)
 * @returns 유효 여부 (true/false)
 */
export const isTimeGapValid = (
  pickupTime: string,
  dropoffTime: string,
): boolean => {
  if (!pickupTime || !dropoffTime) return true;

  // 시간 문자열 파싱
  const pickupPeriodMatch = pickupTime.match(/(오전|오후)/);
  const pickupTimeMatch = pickupTime.match(/(\d+):(\d+)/);
  const dropoffPeriodMatch = dropoffTime.match(/(오전|오후)/);
  const dropoffTimeMatch = dropoffTime.match(/(\d+):(\d+)/);

  if (
    !pickupPeriodMatch ||
    !pickupTimeMatch ||
    !dropoffPeriodMatch ||
    !dropoffTimeMatch
  )
    return true;

  // 시간 추출
  const pickupPeriod = pickupPeriodMatch[0];
  let pickupHour = parseInt(pickupTimeMatch[1]);
  const pickupMinute = parseInt(pickupTimeMatch[2]);

  const dropoffPeriod = dropoffPeriodMatch[0];
  let dropoffHour = parseInt(dropoffTimeMatch[1]);
  const dropoffMinute = parseInt(dropoffTimeMatch[2]);

  // 12시간제에서 24시간제로 변환
  if (pickupPeriod === "오후" && pickupHour < 12) pickupHour += 12;
  if (pickupPeriod === "오전" && pickupHour === 12) pickupHour = 0;

  if (dropoffPeriod === "오후" && dropoffHour < 12) dropoffHour += 12;
  if (dropoffPeriod === "오전" && dropoffHour === 12) dropoffHour = 0;

  // 분 단위로 변환하여 차이 계산
  const pickupMinutes = pickupHour * 60 + pickupMinute;
  const dropoffMinutes = dropoffHour * 60 + dropoffMinute;
  const diffMinutes = dropoffMinutes - pickupMinutes;

  // 1시간(60분)을 초과하는지 확인
  return diffMinutes <= 60 && diffMinutes > 0;
};
