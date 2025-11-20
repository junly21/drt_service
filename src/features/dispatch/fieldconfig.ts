/**
 * Dispatch 페이지 필터 폼 관련 설정
 */

import type { FieldConfig } from "@/types/filterForm";
import type { DispatchFilters } from "@/types/dispatch";

export const defaultFilters: DispatchFilters = {
  dispatchDate: "",
};

export const dispatchFields: FieldConfig[] = [
  {
    name: "dispatchDate",
    label: "배차일자",
    type: "text",
    placeholder: "배차일자 검색",
  },
];
