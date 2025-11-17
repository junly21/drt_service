/**
 * Monitoring 관련 API 함수
 */

import { post } from "@/lib/api/client";
import type { RouteNodeResponse, VehicleMarkerResponse } from "@/types/monitoring";

/**
 * 노선 노드 목록 조회 API
 * @returns 노선 노드 목록 및 전체 개수
 */
export async function getRouteNodes(): Promise<RouteNodeResponse> {
  return post<RouteNodeResponse>("/api/route-nodes", {});
}

/**
 * 버스 마커 목록 조회 API
 * @returns 버스 마커 목록 및 전체 개수
 */
export async function getVehicleMarkers(): Promise<VehicleMarkerResponse> {
  return post<VehicleMarkerResponse>("/api/vehicle-markers", {});
}
