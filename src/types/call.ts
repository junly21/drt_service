/**
 * Call 관련 타입 정의
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CallRow = any;

export interface CallFilters {
  vehicleNo?: string;
  startDate?: string;
  endDate?: string;
}

export interface CallListResponse {
  calls: CallRow[];
  total: number;
}

export interface CallListParams {
  vehicleNo?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}
