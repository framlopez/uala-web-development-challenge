import { Suspense } from "react";
import MetricsDashboard from "@/components/metrics-page/metrics-dashboard";
import MetricsSkeleton from "@/components/metrics-page/metrics-skeleton";

export default function MetricsPage() {
  return (
    <div className="container max-w-6xl my-8 lg:my-10">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <h1 className="font-semibold text-2xl">Dashboard de Métricas</h1>
        </div>
        
        <Suspense fallback={<MetricsSkeleton />}>
          <MetricsDashboard />
        </Suspense>
      </div>
    </div>
  );
}
