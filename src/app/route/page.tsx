"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Grid from "@/components/Grid";
import { FilterForm } from "@/components/ui/FilterForm";
import { getRouteList } from "@/lib/api/route";
import { routeColumnDefs } from "@/features/route/columnDefs";
import { defaultFilters, routeFields } from "@/features/route/fieldconfig";
import type { RouteFilters, RouteRow } from "@/types/route";

export default function RoutePage() {
  const gridRef = useRef(null);

  const [filters, setFilters] = useState<RouteFilters>(defaultFilters);
  const [allRows, setAllRows] = useState<RouteRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRouteList = async () => {
      setLoading(true);
      try {
        const response = await getRouteList(filters);
        setAllRows(response.routes);
      } catch (error) {
        console.error("Failed to fetch route list:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRouteList();
  }, [filters]);

  const rowData = useMemo(() => {
    return allRows.filter((r) => {
      const matchRoute = filters.routeName
        ? String(r["route_nm"])?.includes(filters.routeName)
        : true;
      return matchRoute;
    });
  }, [allRows, filters]);

  const columnDefs = useMemo(() => routeColumnDefs, []);

  return (
    <section className="rounded-xl border bg-white p-4">
      <div className="mb-4">
        <h1 className="text-xl font-semibold">노선관리</h1>
      </div>

      <FilterForm<RouteFilters>
        fields={routeFields}
        defaultValues={defaultFilters}
        values={filters}
        onChange={setFilters}
        onSearch={(v) => setFilters(v)}
        className="mb-4"
      />

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
          height={"calc(100vh - 350px)"}
          enableNumberColoring={true}
        />
      )}
    </section>
  );
}
