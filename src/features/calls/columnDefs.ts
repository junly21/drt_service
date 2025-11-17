import { formatTimestamp } from "@/lib/utils";

export const callColumnDefs = [
  {
    headerName: "-",
    valueGetter: "node.rowIndex + 1",
    width: 60,
    flex: 0,
    resizable: false,
  },
  {
    headerName: "배차순번",
    field: "dispatch_seq",
    minWidth: 120,
  },
  {
    headerName: "노선ID",
    field: "route_id",
    minWidth: 120,
  },
  {
    headerName: "디바이스ID",
    field: "device_id",
    minWidth: 150,
  },
  {
    headerName: "호출일시",
    field: "call_dtm",
    minWidth: 150,
  },
  {
    headerName: "출발지ID",
    field: "start_point_id",
    minWidth: 120,
  },
  {
    headerName: "종점ID",
    field: "end_point_id",
    minWidth: 120,
  },
  {
    headerName: "예약인원",
    field: "rsv_num",
    minWidth: 120,
  },
  {
    headerName: "결제수단",
    field: "payment",
    minWidth: 120,
  },
  {
    headerName: "경도",
    field: "gps_x",
    minWidth: 100,
  },
  {
    headerName: "위도",
    field: "gps_y",
    minWidth: 100,
  },
  {
    headerName: "배차일시",
    field: "dispatch_dt",
    minWidth: 150,
    valueFormatter: (params: { value: unknown }) =>
      formatTimestamp(params.value as number | string | null | undefined),
  },
];
