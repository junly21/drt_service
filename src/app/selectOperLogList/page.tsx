"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Grid from "@/components/Grid";
import { FilterForm } from "@/components/ui/FilterForm";
import { getOperLogList } from "@/lib/api/operLog";
import { operLogColumnDefs } from "@/features/operLog/columnDefs";
import {
  defaultFilters,
  operLogFields,
} from "@/features/operLog/fieldconfig";
import type { OperLogFilters, OperLogRow } from "@/types/operLog";
import { formatTimestamp } from "@/lib/utils";

export default function OperLogPage() {
  const gridRef = useRef(null);

  const [filters, setFilters] = useState<OperLogFilters>(defaultFilters);
  const [rows, setRows] = useState<OperLogRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const response = await getOperLogList(filters);
        setRows(response.logs);
      } catch (error) {
        console.error("Failed to fetch oper logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [filters]);

  const rowData = useMemo(() => {
    return rows.filter((row) => {
      const matchOperDate = filters.operDate
        ? formatTimestamp(row["oper_dtm"], "YYYY-MM-DD").includes(
            filters.operDate
          )
        : true;
      return matchOperDate;
    });
  }, [rows, filters]);

  const columnDefs = useMemo(() => operLogColumnDefs, []);

  return (
    <section className="rounded-xl border bg-white p-4">
      <div className="mb-4">
        <h1 className="text-xl font-semibold">운행로그 조회</h1>
      </div>

      <FilterForm<OperLogFilters>
        fields={operLogFields}
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

