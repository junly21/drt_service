/**
 * Vehicle 관련 API 함수
 * Next.js API Route를 통해 백엔드로 요청합니다.
 */

import { post } from "@/lib/api/client";
import type {
  VehicleListParams,
  VehicleListResponse,
  VehicleRow,
} from "@/types/vehicle";

/**
 * 차량 목록 조회 API
 * @param params 조회 파라미터
 * @returns 차량 목록 및 전체 개수
 */
export async function getVehicleList(
  params: VehicleListParams = {}
): Promise<VehicleListResponse> {
  return post<VehicleListResponse>("/api/vehicles", params);
}

/**
 * 차량 상세 조회 API (추후 필요시 사용)
 */
export async function getVehicleById(id: string): Promise<VehicleRow> {
  return post<VehicleRow>(`/api/vehicles/${id}`, { vehicle_id: id });
}
