/**
 * Vehicle 관련 타입 정의
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type VehicleRow = any;

export interface VehicleFilters {
  vehicleNo: string;
}

export interface VehicleListResponse {
  vehicles: VehicleRow[];
  total: number;
}

export interface VehicleListParams {
  vehicleNo?: string;
  page?: number;
  pageSize?: number;
}
