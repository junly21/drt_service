/**
 * Dispatch 관련 API 함수
 * Next.js API Route를 통해 백엔드로 요청합니다.
 */

import { post } from "@/lib/api/client";
import type {
  DispatchListParams,
  DispatchListResponse,
  DispatchRow,
} from "@/types/dispatch";

/**
 * 배차 목록 조회 API
 * @param params 조회 파라미터
 * @returns 배차 목록 및 전체 개수
 */
export async function getDispatchList(
  params: DispatchListParams = {}
): Promise<DispatchListResponse> {
  return post<DispatchListResponse>("/api/dispatch", params);
}

/**
 * 배차 상세 조회 API (추후 필요시 사용)
 */
export async function getDispatchById(
  dispatchSeq: number
): Promise<DispatchRow> {
  return post<DispatchRow>(`/api/dispatch/${dispatchSeq}`, {
    dispatch_seq: dispatchSeq,
  });
}
