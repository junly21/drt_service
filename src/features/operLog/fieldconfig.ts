import type { FieldConfig } from "@/types/filterForm";
import type { OperLogFilters } from "@/types/operLog";

export const defaultFilters: OperLogFilters = {
  operDate: "",
};

export const operLogFields: FieldConfig[] = [
  {
    name: "operDate",
    label: "운행일시",
    type: "text",
    placeholder: "YYYY-MM-DD",
  },
];

