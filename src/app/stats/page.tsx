export default function StatsPage() {
  return (
    <section className="rounded-lg border p-6 bg-white">
      <h2 className="text-xl font-semibold mb-2">호출통계</h2>
      <p className="text-sm text-muted-foreground mb-4">
        차트 기반 호출 통계 시각화
      </p>
      <div className="h-[720px] border rounded-md bg-zinc-50" />
    </section>
  );
}
