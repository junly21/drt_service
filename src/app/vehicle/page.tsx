"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Grid from "@/components/Grid";
import { FilterForm } from "@/components/ui/FilterForm";
import { getVehicleList } from "@/lib/api/vehicle";
import { vehicleColumnDefs } from "@/features/vehicle/columnDefs";
import { defaultFilters, vehicleFields } from "@/features/vehicle/fieldconfig";
import type { VehicleFilters, VehicleRow } from "@/types/vehicle";

export default function VehiclePage() {
  const gridRef = useRef(null);

  const [filters, setFilters] = useState<VehicleFilters>(defaultFilters);
  const [allRows, setAllRows] = useState<VehicleRow[]>([]);
  const [loading, setLoading] = useState(false);

  // API 호출로 데이터 가져오기
  useEffect(() => {
    const fetchVehicleList = async () => {
      setLoading(true);
      try {
        const response = await getVehicleList(filters);
        setAllRows(response.vehicles);
      } catch (error) {
        console.error("Failed to fetch vehicle list:", error);
        // 에러 처리 (토스트 메시지 등)
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleList();
  }, [filters]);

  // 필터링된 데이터 (필요시 클라이언트 사이드 추가 필터링)
  const rowData = useMemo(() => {
    return allRows.filter((r) => {
      const matchVehicle = filters.vehicleNo
        ? String(r["vehicle_no"]).includes(filters.vehicleNo)
        : true;
      return matchVehicle;
    });
  }, [allRows, filters]);

  const columnDefs = useMemo(() => vehicleColumnDefs, []);

  return (
    <section className="rounded-xl border bg-white p-4">
      {/* 페이지 제목 */}
      <div className="mb-4">
        <h1 className="text-xl font-semibold">차량관리</h1>
      </div>

      <FilterForm<VehicleFilters>
        fields={vehicleFields}
        defaultValues={defaultFilters}
        values={filters}
        onChange={setFilters}
        onSearch={(v) => setFilters(v)}
        className="mb-4"
      />

      {/* 액션 바: 추가/삭제 (필터와 그리드 사이, 우측 정렬) */}
      <div className="flex justify-end gap-2 mb-3">
        <button
          type="button"
          className="px-3 py-2 rounded-md bg-blue-600 text-white text-sm"
          onClick={() => {
            // TODO: 추가 액션 핸들러 연결 예정
          }}>
          추가
        </button>
        <button
          type="button"
          className="px-3 py-2 rounded-md bg-red-500 text-white text-sm"
          onClick={() => {
            // TODO: 삭제 액션 핸들러 연결 예정
          }}>
          삭제
        </button>
      </div>

      {loading ? (
        <div
          className="flex items-center justify-center"
          style={{ height: 560 }}>
          <p>데이터를 불러오는 중...</p>
        </div>
      ) : (
        <Grid
          rowData={rowData}
          columnDefs={columnDefs}
          gridRef={gridRef}
          gridOptions={{}}
          height={"calc(100vh - 400px)"}
          enableNumberColoring={true}
        />
      )}
    </section>
  );
}
