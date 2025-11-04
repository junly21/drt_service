"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FilterForm } from "@/components/ui/FilterForm";
import Grid from "@/components/Grid";
import VWorldMap from "@/components/VWorldMap";
import { getStopList } from "@/lib/api/stop";
import { stopColumnDefs } from "@/features/stop/columnDefs";
import { defaultFilters, stopFields } from "@/features/stop/fieldconfig";
import type { StopFilters, StopRow } from "@/types/stop";

export default function StopPage() {
  const gridRef = useRef(null);

  const [filters, setFilters] = useState<StopFilters>(defaultFilters);
  const [allRows, setAllRows] = useState<StopRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStopList = async () => {
      setLoading(true);
      try {
        const response = await getStopList(filters);
        setAllRows(response.stops);
      } catch (error) {
        console.error("Failed to fetch stop list:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStopList();
  }, [filters]);

  const rowData = useMemo(() => {
    return allRows.filter((r) => {
      const matchStop = filters.stopName
        ? String(r["stn_nm"])?.includes(filters.stopName)
        : true;
      return matchStop;
    });
  }, [allRows, filters]);

  const columnDefs = useMemo(() => stopColumnDefs, []);

  return (
    <section className="rounded-xl border bg-white p-4">
      <div className="mb-4">
        <h1 className="text-xl font-semibold">정류장관리</h1>
      </div>

      <FilterForm<StopFilters>
        fields={stopFields}
        defaultValues={defaultFilters}
        values={filters}
        onChange={setFilters}
        onSearch={(v) => setFilters(v)}
        className="mb-4"
      />

      {/* 그리드와 지도를 2:1 비율로 배치 */}
      <div className="flex gap-4" style={{ height: "calc(100vh - 350px)" }}>
        {/* 그리드 영역 (2/3) */}
        <div className="flex-[2] flex flex-col">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p>데이터를 불러오는 중...</p>
            </div>
          ) : (
            <Grid
              rowData={rowData}
              columnDefs={columnDefs}
              gridRef={gridRef}
              gridOptions={{}}
              height={"100%"}
              enableNumberColoring={true}
            />
          )}
        </div>

        {/* 지도 영역 (1/3) */}
        <div className="flex-1">
          <VWorldMap mapId="stop-map" className="h-full" />
        </div>
      </div>
    </section>
  );
}
