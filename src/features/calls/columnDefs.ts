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
    headerName: "호출번호",
    field: "call_no",
    minWidth: 120,
  },
  {
    headerName: "차량번호",
    field: "vehicle_no",
    minWidth: 100,
  },
  {
    headerName: "호출일시",
    field: "call_dt",
    minWidth: 150,
    valueFormatter: (params) => formatTimestamp(params.value),
  },
  {
    headerName: "출발지",
    field: "origin",
    minWidth: 150,
  },
  {
    headerName: "목적지",
    field: "destination",
    minWidth: 150,
  },
  {
    headerName: "호출상태",
    field: "call_status",
    minWidth: 100,
  },
  {
    headerName: "승차시간",
    field: "boarding_dt",
    minWidth: 150,
    valueFormatter: (params) => formatTimestamp(params.value),
  },
  {
    headerName: "하차시간",
    field: "alighting_dt",
    minWidth: 150,
    valueFormatter: (params) => formatTimestamp(params.value),
  },
  {
    headerName: "비고",
    field: "remark",
    minWidth: 150,
  },
];
