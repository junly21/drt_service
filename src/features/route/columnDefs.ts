import { formatTimestamp } from "@/lib/utils";

export const routeColumnDefs = [
  {
    headerName: "-",
    valueGetter: "node.rowIndex + 1",
    width: 60,
    flex: 0,
    resizable: false,
  },
  { headerName: "노선명", field: "route_nm", minWidth: 140 },
  { headerName: "권역", field: "area", minWidth: 80 },
  { headerName: "기점", field: "o_stn_id", minWidth: 120 },
  { headerName: "종점", field: "d_stn_id", minWidth: 120 },
  { headerName: "상하행구분", field: "dir_cd", minWidth: 110 },
  {
    headerName: "적용시작일",
    field: "start_dt",
    minWidth: 120,
    valueFormatter: (params: { value: unknown }) =>
      formatTimestamp(params.value as number | string | null | undefined),
  },
  {
    headerName: "적용종료일",
    field: "end_dt",
    minWidth: 120,
    valueFormatter: (params: { value: unknown }) =>
      formatTimestamp(params.value as number | string | null | undefined),
  },
  { headerName: "비고", field: "remark", minWidth: 150 },
];
