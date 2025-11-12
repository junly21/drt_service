/**
 * Dispatch(배차) 관련 타입 정의
 */

export interface DispatchRow extends Record<string, unknown> {
  dispatch_seq: number;
  point_id: string;
  route_id: string;
  algh_dtm: number;
  remark: string | null;
  dispatch_dt: number;
  vehicle_id: string;
}

export interface DispatchFilters {
  dispatchDate: string;
}

export interface DispatchListResponse {
  dispatches: DispatchRow[];
  total: number;
}

export interface DispatchListParams {
  dispatchDate?: string;
  page?: number;
  pageSize?: number;
}
