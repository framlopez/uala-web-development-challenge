import History from "@/src/components/transactions-page/list-history";
import Summary from "@/src/components/transactions-page/summary";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="container max-w-md my-8 lg:my-10">
      <Summary />
      <Suspense fallback={<div>Cargando...</div>}>
        <History />
      </Suspense>
    </div>
  );
}
