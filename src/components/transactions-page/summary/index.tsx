import Link from "next/link";
import Button from "../../cross/button";
import AnalyzeIcon from "../../icons/analyze";
import SummaryTabs from "./tabs";

export default function Summary() {
  return (
    <div className="flex flex-col gap-6 lg:gap-4">
      <h1 className="font-semibold text-base">Tus cobros</h1>

      <div className="flex flex-col gap-4 items-center">
        <SummaryTabs />

        <Link href="#">
          <Button className="text-uala-primary">
            <AnalyzeIcon className="size-6" />
            Ver métricas
          </Button>
        </Link>
      </div>
    </div>
  );
}
