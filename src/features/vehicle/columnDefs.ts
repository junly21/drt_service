export const vehicleColumnDefs = [
  {
    headerName: "-",
    valueGetter: "node.rowIndex + 1",
    width: 60,
    flex: 0,
    resizable: false,
  },
  {
    headerName: "차량번호",
    field: "vehicle_no",
    minWidth: 100,
  },
  { headerName: "권역코드", field: "area", minWidth: 80 },
  { headerName: "운수사", field: "운수사", minWidth: 80 },
  { headerName: "차량종류", field: "차량종류", minWidth: 90 },
  { headerName: "차량상태", field: "vehicle_status", minWidth: 90 },
  // { headerName: "제조사", field: "제조사", minWidth: 80 },
  // { headerName: "모델명", field: "모델명", minWidth: 100 },
  { headerName: "출고일자", field: "start_dt", minWidth: 90 },
  { headerName: "연료형태", field: "연료형태", minWidth: 90 },
  { headerName: "비고", field: "비고", minWidth: 150 },
];
