/**
 * Call 페이지 필터 폼 관련 설정
 */

import type { FieldConfig } from "@/types/filterForm";
import type { CallFilters } from "@/types/call";

export const defaultFilters: CallFilters = {
  routeId: "",
  deviceId: "",
  startPointId: "",
  endPointId: "",
};

export const callFields: FieldConfig[] = [
  {
    name: "routeId",
    label: "노선ID",
    type: "text",
    placeholder: "노선ID",
  },
  {
    name: "deviceId",
    label: "디바이스ID",
    type: "text",
    placeholder: "디바이스ID",
  },
  {
    name: "startPointId",
    label: "출발지ID",
    type: "text",
    placeholder: "출발지ID",
  },
  {
    name: "endPointId",
    label: "도착지ID",
    type: "text",
    placeholder: "도착지ID",
  },
];
