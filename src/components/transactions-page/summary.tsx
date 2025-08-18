import AnalyzeIcon from "../icons/analyze";
import SummaryTabs from "./summary-tabs";

export default function Summary() {
	return (
		<div className="flex flex-col gap-6 lg:gap-4">
			<h1 className="font-semibold text-base mt-8 lg:mt-10">Tus cobros</h1>

			<div className="flex flex-col gap-4 items-center">
				<SummaryTabs />

				<button
					className="py-3 px-4 flex items-center gap-1 text-sm text-primary"
					type="button"
				>
					<AnalyzeIcon className="size-6" />
					Ver métricas
				</button>
			</div>
		</div>
	);
}
