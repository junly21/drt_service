/**
 * Call 페이지 필터 폼 관련 설정
 */

import type { FieldConfig } from "@/types/filterForm";
import type { CallFilters } from "@/types/call";

export const defaultFilters: CallFilters = {
  vehicleNo: "",
  startDate: "",
  endDate: "",
};

export const callFields: FieldConfig[] = [
  {
    name: "vehicleNo",
    label: "차량번호",
    type: "text",
    placeholder: "차량번호",
  },
  {
    name: "startDate",
    label: "시작일자",
    type: "date",
    placeholder: "시작일자",
  },
  {
    name: "endDate",
    label: "종료일자",
    type: "date",
    placeholder: "종료일자",
  },
];
