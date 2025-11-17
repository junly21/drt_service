/**
 * Call 관련 타입 정의
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CallRow = any;

export interface CallFilters {
  routeId?: string;
  deviceId?: string;
  startPointId?: string;
  endPointId?: string;
}

export interface CallListResponse {
  calls: CallRow[];
  total: number;
}

export interface CallListParams {
  routeId?: string;
  deviceId?: string;
  startPointId?: string;
  endPointId?: string;
  page?: number;
  pageSize?: number;
}
