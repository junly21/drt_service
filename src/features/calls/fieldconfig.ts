/**
 * Call 페이지 필터 폼 관련 설정
 */

import type { FieldConfig } from "@/types/filterForm";
import type { CallFilters } from "@/types/call";

export const defaultFilters: CallFilters = {
  callDatetime: "",
  deviceId: "",
};

export const callFields: FieldConfig[] = [
  {
    name: "callDatetime",
    label: "호출일시",
    type: "text",
    placeholder: "호출일시",
  },
  {
    name: "deviceId",
    label: "디바이스ID",
    type: "text",
    placeholder: "디바이스ID",
  },
];
