import DownloadModalButton from "../download-modal/button";
import FiltersSidebarButton from "../filters-sidebar/button";
import HistoryList from "./listing";

export default function History() {
  return (
    <div className="mt-6">
      <div className="flex justify-between items-center">
        <h2>Historial de transacciones</h2>
        <div className="flex items-center">
          <FiltersSidebarButton />
          <DownloadModalButton />
        </div>
      </div>

      <div className="mt-2">
        <HistoryList />
      </div>
    </div>
  );
}
