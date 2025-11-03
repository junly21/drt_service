/**
 * Vehicle 관련 API 함수
 * 모든 요청은 POST 메소드로 /api/proxy를 통해 프록시 서버로 전달됩니다.
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
  const endpoint = "/vehicles";

  // POST 요청으로 body에 파라미터 전달
  const response = await post<VehicleListResponse>(endpoint, params);
  return response.data;
}

/**
 * 차량 상세 조회 API (추후 필요시 사용)
 */
export async function getVehicleById(id: string): Promise<VehicleRow> {
  const endpoint = `/vehicles/${id}`;
  const response = await post<VehicleRow>(endpoint, {});
  return response.data;
}
