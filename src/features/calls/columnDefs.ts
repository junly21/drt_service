import { formatTimestamp } from "@/lib/utils";

export const callColumnDefs = [
  {
    headerName: "-",
    valueGetter: "node.rowIndex + 1",
    width: 60,
    flex: 0,
    resizable: false,
  },
  // {
  //   headerName: "배차순번",
  //   field: "dispatch_seq",
  //   minWidth: 120,
  //   sortable: true,
  // },

  {
    headerName: "호출일시",
    field: "call_dtm",
    minWidth: 150,
  },
  {
    headerName: "노선명",
    field: "route_nm",
    minWidth: 140,
  },
  {
    headerName: "디바이스ID",
    field: "device_id",
    minWidth: 150,
  },
  {
    headerName: "승차정류장",
    field: "start_point_nm",
    minWidth: 140,
  },
  {
    headerName: "하차정류장",
    field: "end_point_nm",
    minWidth: 140,
  },
  {
    headerName: "예약인원",
    field: "rsv_num",
    minWidth: 120,
  },
  {
    headerName: "현재승차인원",
    field: "curren_reserved",
    minWidth: 140,
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
