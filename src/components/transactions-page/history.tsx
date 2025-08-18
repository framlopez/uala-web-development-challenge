"use client";

import { useState } from "react";
import ButtonIcon from "../cross/button-icon";
import DownloadIcon from "../icons/download";
import FilterIcon from "../icons/filter";
import FiltersSidebar from "./filters-sidebar";
import HistoryList from "./history-list";

export default function History() {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const openFilters = () => setIsFiltersOpen(true);
  const closeFilters = () => setIsFiltersOpen(false);

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center">
        <h2>Historial de transacciones</h2>
        <div className="flex items-center">
          <ButtonIcon className="text-primary" onClick={openFilters}>
            <FilterIcon className="size-6" />
          </ButtonIcon>
          <ButtonIcon className="text-primary">
            <DownloadIcon className="size-6" />
          </ButtonIcon>
        </div>
      </div>

      <div className="mt-2">
        <HistoryList />
      </div>

      {/* Sidebar de filtros */}
      <FiltersSidebar isOpen={isFiltersOpen} onClose={closeFilters} />
    </div>
  );
}
