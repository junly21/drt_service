"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ColDef, ICellRendererParams } from "ag-grid-community";

import Grid from "@/components/Grid";
import { FilterForm } from "@/components/ui/FilterForm";
import {
  defaultFilters,
  dispatchFields,
} from "@/features/dispatch/fieldconfig";
import { getDispatchList } from "@/lib/api/dispatch";
import { formatTimestamp } from "@/lib/utils";
import type {
  DispatchFilters,
  DispatchGridRow,
  DispatchRow,
  DispatchStopEntry,
} from "@/types/dispatch";

function StopTimelineCell({
  value,
}: ICellRendererParams<DispatchGridRow, DispatchStopEntry[]>) {
  const stops = value ?? [];

  if (!stops.length) {
    return <span className="text-gray-400">표시할 정류장이 없습니다</span>;
  }

  return (
    <div className="flex w-full flex-wrap gap-3">
      {stops.map((stop) => (
        <div
          key={`${stop.point_id}-${stop.algh_dtm ?? "na"}`}
          className="flex w-24 flex-col rounded-lg border border-gray-200 px-3 py-2 shadow-sm">
          <p className="text-xs font-medium text-gray-500">{stop.point_id}</p>
          <p className="text-sm font-semibold text-gray-800">
            {stop.algh_dtm ? formatTimestamp(stop.algh_dtm, "HH:mm") : "-"}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function DispatchPage() {
  const gridRef = useRef(null);

  const [filters, setFilters] = useState<DispatchFilters>(defaultFilters);
  const [allRows, setAllRows] = useState<DispatchRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDispatchList = async () => {
      setLoading(true);
      try {
        const response = await getDispatchList(filters);
        setAllRows(response.dispatches);
      } catch (error) {
        console.error("Failed to fetch dispatch list:", error);
        // TODO: 사용자 피드백 (토스트 등) 추가
      } finally {
        setLoading(false);
      }
    };

    void fetchDispatchList();
  }, [filters]);

  const filteredRows = useMemo(() => {
    const keyword = filters.dispatchDate?.trim();
    const filtered = keyword
      ? allRows.filter((row) => {
          const formatted = formatTimestamp(
            row.dispatch_dt,
            "YYYY-MM-DD HH:mm:ss"
          );
          return formatted.includes(keyword);
        })
      : allRows;

    return [...filtered].sort((a, b) => {
      const dispatchCompare = b.dispatch_dt - a.dispatch_dt;
      if (dispatchCompare !== 0) {
        return dispatchCompare;
      }

      const routeCompare = a.route_id.localeCompare(b.route_id);
      if (routeCompare !== 0) {
        return routeCompare;
      }

      return a.dispatch_seq - b.dispatch_seq;
    });
  }, [allRows, filters.dispatchDate]);

  const groupedRows = useMemo<DispatchGridRow[]>(() => {
    const routeMap = new Map<string, DispatchGridRow>();

    filteredRows.forEach((row) => {
      const key = `${row.dispatch_dt}-${row.route_id}`;
      if (!routeMap.has(key)) {
        routeMap.set(key, {
          dispatch_dt: row.dispatch_dt,
          route_id: row.route_id,
          stops: [],
        });
      }

      const routeRow = routeMap.get(key);
      if (routeRow && row.algh_dtm != null) {
        routeRow.stops.push({
          point_id: row.point_id,
          algh_dtm: row.algh_dtm,
          dispatch_seq: row.dispatch_seq,
        });
      }
    });

    routeMap.forEach((routeRow) => {
      routeRow.stops.sort((a, b) => a.dispatch_seq - b.dispatch_seq);
    });

    return Array.from(routeMap.values());
  }, [filteredRows]);

  const columnDefs = useMemo<ColDef<DispatchGridRow>[]>(() => {
    return [
      {
        headerName: "배차일자",
        field: "dispatch_dt",
        pinned: "left",
        sortable: true,
        minWidth: 140,
        valueFormatter: (params: { value?: number }) =>
          params.value ? formatTimestamp(params.value, "YYYY-MM-DD") : "-",
      },
      {
        headerName: "노선ID",
        field: "route_id",
        pinned: "left",
        minWidth: 140,
        cellClass: "font-semibold",
      },
      {
        headerName: "배차표",
        field: "stops",
        flex: 1,
        minWidth: 2000,
        maxWidth: 9999,
        cellRenderer: StopTimelineCell,
      },
    ];
  }, []);

  return (
    <section className="rounded-xl border bg-white p-4">
      <div className="mb-4">
        <h1 className="text-xl font-semibold">배차관리</h1>
      </div>

      <FilterForm<DispatchFilters>
        fields={dispatchFields}
        defaultValues={defaultFilters}
        values={filters}
        onChange={setFilters}
        onSearch={(values) => setFilters(values)}
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
          rowData={groupedRows}
          columnDefs={columnDefs}
          gridRef={gridRef}
          gridOptions={{}}
          height={"calc(100vh - 400px)"}
          enableNumberColoring={true}
          rowHeight={60}
        />
      )}
    </section>
  );
}
