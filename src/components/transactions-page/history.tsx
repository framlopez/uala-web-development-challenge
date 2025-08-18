import DownloadIcon from "../icons/download";
import FilterIcon from "../icons/filter";
import HistoryList from "./history-list";

export default function History() {
	return (
		<div className="mt-6">
			<div className="flex justify-between items-center">
				<h2>Historial de transacciones</h2>
				<div className="flex items-center">
					<button className="p-3 text-primary" type="button">
						<FilterIcon className="size-6" />
					</button>
					<button className="p-3 text-primary" type="button">
						<DownloadIcon className="size-6" />
					</button>
				</div>
			</div>

			<div className="mt-2">
				<HistoryList />
			</div>
		</div>
	);
}
