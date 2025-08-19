"use client";

import { useState } from "react";
import ButtonIcon from "../../cross/button-icon";
import FilterIcon from "../../icons/filter";
import FiltersSidebar from "./filters-sidebar";

export default function FiltersSidebarButton() {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const openFilters = () => setIsFiltersOpen(true);
  const closeFilters = () => setIsFiltersOpen(false);

  return (
    <>
      <ButtonIcon className="text-uala-primary" onClick={openFilters}>
        <FilterIcon className="size-6" />
      </ButtonIcon>

      {/* Sidebar de filtros */}
      <FiltersSidebar isOpen={isFiltersOpen} onClose={closeFilters} />
    </>
  );
}
