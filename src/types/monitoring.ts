/**
 * Monitoring 관련 타입 정의
 */

export interface RouteNode {
  point_type: "NODE" | "STN";
  point_id: string;
  route_id: string;
  required_min: number;
  gps_x: number;
  gps_y: number;
  point_seq: number;
  created_at: number;
  updated_at: number;
}

export interface RouteNodeResponse {
  nodes: RouteNode[];
  total: number;
}

export interface VehicleMarker {
  gps_x: number;
  gps_y: number;
  oper_dtm: number;
  heading: number;
  vehicle_no: string;
  vehicle_id: string;
  speed: number;
}

export interface VehicleMarkerResponse {
  vehicles: VehicleMarker[];
  total: number;
}
