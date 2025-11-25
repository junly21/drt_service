"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import "ol/ol.css";
import { Map, View } from "ol";
import { XYZ } from "ol/source";
import { Tile } from "ol/layer";
import { defaults } from "ol/control";
import { fromLonLat } from "ol/proj";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import LineString from "ol/geom/LineString";
import { Style, Stroke, Icon } from "ol/style";
import Overlay from "ol/Overlay";
import { VWORLD_API_KEY } from "@/config/vworld";
import { getRouteNodes, getVehicleMarkers } from "@/lib/api/monitoring";
import type { RouteNode, VehicleMarker } from "@/types/monitoring";
import { getStopList, type StopRow } from "@/lib/api/marker";

export default function MonitoringPage() {
  const mapRef = useRef<Map | null>(null);
  const vectorSourceRef = useRef<VectorSource | null>(null);
  const vehicleSourceRef = useRef<VectorSource | null>(null);
  const stopSourceRef = useRef<VectorSource | null>(null);
  const overlayRef = useRef<Overlay | null>(null);
  const routeNodesLoadedRef = useRef(false);
  const stopsLoadedRef = useRef(false);
  const [loading, setLoading] = useState(false);

  // Catmull-Rom 스플라인으로 부드러운 곡선 생성
  const createSmoothCurve = (
    points: number[][],
    numPoints: number = 10
  ): number[][] => {
    if (points.length < 2) return points;
    if (points.length === 2) return points;

    const result: number[][] = [];
    result.push(points[0]); // 첫 번째 포인트

    // 각 세그먼트마다 곡선 생성
    for (let i = 0; i < points.length - 1; i++) {
      // Catmull-Rom 스플라인을 위한 4개 포인트
      const p0 = i > 0 ? points[i - 1] : points[i];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = i < points.length - 2 ? points[i + 2] : points[i + 1];

      // p1과 p2 사이의 곡선 생성
      for (let j = 1; j <= numPoints; j++) {
        const t = j / numPoints;
        const t2 = t * t;
        const t3 = t2 * t;

        // Catmull-Rom 스플라인 공식
        const x =
          0.5 *
          (2 * p1[0] +
            (-p0[0] + p2[0]) * t +
            (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 +
            (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3);
        const y =
          0.5 *
          (2 * p1[1] +
            (-p0[1] + p2[1]) * t +
            (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 +
            (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3);

        result.push([x, y]);
      }
    }

    result.push(points[points.length - 1]); // 마지막 포인트
    return result;
  };

  // 노선 경로 데이터 로드 및 지도에 표시 (한 번만 실행)
  const loadRouteNodes = useCallback(async () => {
    // 이미 로드된 경우 스킵
    if (routeNodesLoadedRef.current) return;

    setLoading(true);
    try {
      const response = await getRouteNodes();
      const nodes = response.nodes || [];
      const vectorSource = vectorSourceRef.current;
      const map = mapRef.current;
      if (!vectorSource || !map) {
        console.warn("vectorSource or map is not ready");
        return;
      }

      vectorSource.clear();
      console.log("nodes", nodes);
      // route_id별로 그룹화
      const routesByRouteId = nodes.reduce((acc, node) => {
        if (!acc[node.route_id]) {
          acc[node.route_id] = [];
        }
        acc[node.route_id].push(node);
        return acc;
      }, {} as Record<string, RouteNode[]>);

      const allCoordinates: number[][] = [];

      // 각 노선별로 경로 그리기
      Object.entries(routesByRouteId).forEach(([routeId, routeNodes]) => {
        // point_seq 순서대로 정렬
        const sortedNodes = [...routeNodes].sort(
          (a, b) => a.point_seq - b.point_seq
        );

        // 경로선 그리기 (부드러운 곡선으로 연결)
        if (sortedNodes.length > 1) {
          const rawCoordinates = sortedNodes.map((node) =>
            fromLonLat([node.gps_x, node.gps_y])
          );
          allCoordinates.push(...rawCoordinates);

          // Catmull-Rom 스플라인으로 부드러운 곡선 생성
          const smoothCoordinates = createSmoothCurve(rawCoordinates, 8);

          const lineFeature = new Feature({
            geometry: new LineString(smoothCoordinates),
            route_id: routeId,
          });
          lineFeature.setStyle(
            new Style({
              stroke: new Stroke({ color: "#007bff", width: 5 }),
            })
          );
          vectorSource.addFeature(lineFeature);
        }

        // 각 포인트를 마커로 표시 (정류장만 표시)
        sortedNodes.forEach((node) => {
          const isStation = node.point_type === "STN";
          const coord = fromLonLat([node.gps_x, node.gps_y]);
          allCoordinates.push(coord);

          // 정류장(STN)만 표시
          if (!isStation) return;

          const feature = new Feature({
            geometry: new Point(coord),
            point_id: node.point_id,
            point_type: node.point_type,
            route_id: node.route_id,
          });

          // 정류장(STN): 버스 정류장 이미지 사용
          feature.setStyle(
            new Style({
              image: new Icon({
                src: "/busstop.png",
                scale: 0.1,
                anchor: [0.5, 1],
              }),
            })
          );

          vectorSource.addFeature(feature);
        });
      });

      console.log(
        "vectorSource features count:",
        vectorSource.getFeatures().length
      );
      console.log("map layers count:", map.getLayers().getLength());

      // 지도 뷰포트를 모든 좌표를 포함하도록 조정
      if (allCoordinates.length > 0) {
        const extent = vectorSource.getExtent();
        if (extent && extent[0] !== Infinity) {
          map.getView().fit(extent, {
            padding: [50, 50, 50, 50],
            duration: 500,
          });
        }
      }

      // 노선 데이터 로드 완료 표시
      routeNodesLoadedRef.current = true;
    } catch (error) {
      console.error("Failed to load route nodes:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 정류장 데이터 로드 및 지도에 표시 (한 번만 실행)
  const loadStops = useCallback(async () => {
    if (stopsLoadedRef.current) return;

    try {
      const response = await getStopList();
      const stops = response.stops || [];
      const stopSource = stopSourceRef.current;
      const map = mapRef.current;
      if (!stopSource || !map) {
        console.warn("stopSource or map is not ready");
        return;
      }

      stopSource.clear();

      stops.forEach((stop: StopRow) => {
        const coord = fromLonLat([stop.gps_x, stop.gps_y]);
        const feature = new Feature({
          geometry: new Point(coord),
          stn_id: stop.stn_id,
          stn_nm: stop.stn_nm,
          stn_no: stop.stn_no,
          stn_type: stop.stn_type,
          remark: stop.remark,
          gps_x: stop.gps_x,
          gps_y: stop.gps_y,
          direction: stop.direction,
        });

        feature.setStyle(
          new Style({
            image: new Icon({
              src: "/busstop.png",
              scale: 0.1,
              anchor: [0.5, 1],
            }),
          })
        );

        stopSource.addFeature(feature);
      });

      stopsLoadedRef.current = true;
    } catch (error) {
      console.error("Failed to load stops:", error);
    }
  }, []);

  // 버스 마커 데이터 로드 및 지도에 표시
  const loadVehicleMarkers = useCallback(async () => {
    try {
      const response = await getVehicleMarkers();
      const vehicles = response.vehicles || [];
      const vehicleSource = vehicleSourceRef.current;
      const map = mapRef.current;
      if (!vehicleSource || !map) {
        console.warn("vehicleSource or map is not ready");
        return;
      }

      vehicleSource.clear();

      // vehicle_id별로 그룹화하고 가장 최신값만 사용
      const latestVehicles = vehicles.reduce((acc, vehicle) => {
        const existing = acc[vehicle.vehicle_id];
        if (!existing || vehicle.oper_dtm > existing.oper_dtm) {
          acc[vehicle.vehicle_id] = vehicle;
        }
        return acc;
      }, {} as Record<string, VehicleMarker>);

      // 각 버스 마커 표시
      Object.values(latestVehicles).forEach((vehicle) => {
        // 주의: 응답에서 gps_x가 위도, gps_y가 경도로 보이므로 순서 조정
        const coord = fromLonLat([vehicle.gps_y, vehicle.gps_x]);
        const feature = new Feature({
          geometry: new Point(coord),
          vehicle_id: vehicle.vehicle_id,
          vehicle_no: vehicle.vehicle_no,
          oper_dtm: vehicle.oper_dtm,
          heading: vehicle.heading,
          speed: vehicle.speed,
        });

        // heading을 라디안으로 변환 (OpenLayers는 라디안 사용)
        // 시계방향으로 90도 추가 회전 필요 (아이콘 기본 방향 보정)
        const rotation = (vehicle.heading * Math.PI) / 180;

        feature.setStyle(
          new Style({
            image: new Icon({
              src: "/bus.png",
              scale: 0.3,
              rotation: rotation,
              anchor: [0.5, 0.5],
            }),
          })
        );
        vehicleSource.addFeature(feature);
      });
    } catch (error) {
      console.error("Failed to load vehicle markers:", error);
    }
  }, []);

  // 지도 초기화 (벡터 레이어 포함)
  useEffect(() => {
    const vectorSource = new VectorSource();
    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    const stopSource = new VectorSource();
    const stopLayer = new VectorLayer({
      source: stopSource,
    });

    const vehicleSource = new VectorSource();
    const vehicleLayer = new VectorLayer({
      source: vehicleSource,
    });

    // 툴팁 오버레이 생성
    const tooltipElement = document.createElement("div");
    tooltipElement.className =
      "bg-black text-white text-xs rounded px-2 py-1 pointer-events-none";
    tooltipElement.style.display = "none";
    document.body.appendChild(tooltipElement);

    const overlay = new Overlay({
      element: tooltipElement,
      positioning: "bottom-center",
      offset: [0, -10],
    });

    const map = new Map({
      controls: defaults({ zoom: true, rotate: false }).extend([]),
      layers: [
        new Tile({
          visible: true,
          source: new XYZ({
            url: `http://api.vworld.kr/req/wmts/1.0.0/${VWORLD_API_KEY}/Base/{z}/{y}/{x}.png`,
          }),
        }),
        vectorLayer,
        stopLayer,
        vehicleLayer,
      ],
      target: "monitoring-map",
      overlays: [overlay],
      view: new View({
        center: fromLonLat([126.949402, 37.373081]),
        zoom: 17,
        maxZoom: 18,
      }),
    });

    // 마우스 호버 이벤트 처리
    let hoveredFeature: Feature | null = null;
    map.on("pointermove", (e) => {
      const feature = map.forEachFeatureAtPixel(
        e.pixel,
        (f) => f as Feature
      ) as Feature | null;

      if (feature && feature.get("vehicle_id")) {
        // 버스 마커에 호버
        if (hoveredFeature !== feature) {
          hoveredFeature = feature;
          const vehicleNo = feature.get("vehicle_no");
          const vehicleId = feature.get("vehicle_id");
          const speed = feature.get("speed");
          const operDtm = feature.get("oper_dtm");
          const heading = feature.get("heading");

          const date = new Date(operDtm);
          const dateStr = `${date.getFullYear()}-${String(
            date.getMonth() + 1
          ).padStart(2, "0")}-${String(date.getDate()).padStart(
            2,
            "0"
          )} ${String(date.getHours()).padStart(2, "0")}:${String(
            date.getMinutes()
          ).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;

          // m/s를 km/h로 변환 (1 m/s = 3.6 km/h)
          const speedKmh = speed * 3.6;
          tooltipElement.innerHTML = `
            <div class="font-semibold">${vehicleNo}</div>
            <div>차량ID: ${vehicleId}</div>
            <div>속도: ${speedKmh.toFixed(2)} km/h</div>
            <div>방향: ${heading}°</div>
            <div>시간: ${dateStr}</div>
          `;
          tooltipElement.style.display = "block";
          overlay.setPosition(e.coordinate);
        }
      } else if (feature && feature.get("stn_id")) {
        if (hoveredFeature !== feature) {
          hoveredFeature = feature;
          const stnNm = feature.get("stn_nm");
          const direction = feature.get("direction");

          tooltipElement.innerHTML = `
            <div>정류장명: ${stnNm || ""}</div>
            <div>방향: ${direction || ""}</div>
          `;
          tooltipElement.style.display = "block";
          overlay.setPosition(e.coordinate);
        }
      } else {
        // 호버 해제
        if (hoveredFeature) {
          hoveredFeature = null;
          tooltipElement.style.display = "none";
          overlay.setPosition(undefined);
        }
      }
    });

    mapRef.current = map;
    vectorSourceRef.current = vectorSource;
    vehicleSourceRef.current = vehicleSource;
    stopSourceRef.current = stopSource;
    overlayRef.current = overlay;

    // 노선 데이터는 한 번만 로드
    loadRouteNodes();
    loadStops();

    // 버스 데이터 초기 로드 및 주기적 업데이트
    loadVehicleMarkers();
    const interval = setInterval(() => {
      loadVehicleMarkers();
    }, 5000);

    return () => {
      clearInterval(interval);
      map.setTarget(undefined);
      // tooltipElement가 body의 자식인지 확인 후 제거
      if (tooltipElement && tooltipElement.parentNode === document.body) {
        document.body.removeChild(tooltipElement);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 의존성 제거: 지도는 한 번만 초기화

  return (
    <section className="rounded-lg border p-6 bg-white">
      <h2 className="text-xl font-semibold mb-2">모니터링</h2>
      <p className="text-sm text-muted-foreground mb-4">
        지도에서 버스 이동경로 실시간 표출
      </p>
      <div className="h-[720px]" style={{ height: "calc(100vh - 300px)" }}>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p>경로 데이터를 불러오는 중...</p>
          </div>
        ) : null}
        <div
          id="monitoring-map"
          className="relative overflow-hidden rounded-[24px] border border-gray-200 h-full w-full"
        />
      </div>
    </section>
  );
}
