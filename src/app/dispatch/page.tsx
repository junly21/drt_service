"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import Grid from "@/components/Grid";
import { FilterForm } from "@/components/ui/FilterForm";
import { dispatchColumnDefs } from "@/features/dispatch/columnDefs";
import {
  defaultFilters,
  dispatchFields,
} from "@/features/dispatch/fieldconfig";
import { getDispatchList } from "@/lib/api/dispatch";
import { formatTimestamp } from "@/lib/utils";
import type { DispatchFilters, DispatchRow } from "@/types/dispatch";

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

  const rowData = useMemo(() => {
    const keyword = filters.dispatchDate?.trim();
    if (!keyword) {
      return allRows;
    }

    return allRows.filter((row) => {
      const formatted = formatTimestamp(row.dispatch_dt, "YYYY-MM-DD HH:mm:ss");
      return formatted.includes(keyword);
    });
  }, [allRows, filters.dispatchDate]);

  const columnDefs = useMemo(() => dispatchColumnDefs, []);

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
