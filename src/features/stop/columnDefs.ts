import { formatTimestamp } from "@/lib/utils";

export const stopColumnDefs = [
  {
    headerName: "-",
    valueGetter: "node.rowIndex + 1",
    width: 60,
    flex: 0,
    resizable: false,
  },
  { headerName: "정류장번호", field: "stn_no", minWidth: 120 },
  { headerName: "정류장명", field: "stn_nm", minWidth: 140 },
  { headerName: "위도", field: "gps_y", minWidth: 100 },
  { headerName: "경도", field: "gps_x", minWidth: 100 },
  {
    headerName: "정보수집일",
    field: "start_dt",
    minWidth: 120,
    valueFormatter: (params) => formatTimestamp(params.value),
  },
  { headerName: "정류장형태", field: "stn_type", minWidth: 110 },
  { headerName: "비고", field: "remark", minWidth: 150 },
];

