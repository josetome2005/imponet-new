import { useTableFilters } from "../../../hooks/UseTableFilters";
import { SearchBarWithFilters } from "../SearchBarWithFilters/SearchBarWithFilters";
import { DataTable } from "../DataTable/DataTable";
import { TableTabs } from "../TableTabs/TableTabs";

import { useState } from "react";

export function TableContainer(
    {   
      data, 
      columns, 
      filters, 
      searchFields, 
      tabs, 
      placeholderInput, 
      messageNoSearch, 
      handleClick, 
      rowClassName, 
    }) {
    
  const initialFilter = "todos"

  const [activeTab, setActiveTab] = useState(
    tabs?.[0]?.key ?? null
  );

  const {
    search,
    setSearch,
    activeFilters,
    setActiveFilter,
    filteredData,
    filterGroups,
    isFiltering
  } = useTableFilters(data, searchFields, filters, initialFilter, tabs, activeTab);

  return (
    <>

       {tabs?.length > 0 && (
          <TableTabs
              tabs={tabs}
              active={activeTab}
              onChange={setActiveTab}
          />
      )}

      <SearchBarWithFilters
            search={search}
            onSearchChange={setSearch}
            activeFilters={activeFilters}
            filterGroups={filterGroups}
            onFilterChange={setActiveFilter}
            filterGroups={filterGroups}
            placeholderInput={placeholderInput}
      />

      <DataTable 
            data={filteredData} 
            columns={columns}
            messageNoSearch={messageNoSearch}
            handleClick={handleClick}
            rowClassName={rowClassName}
            isFiltering={isFiltering}
      />
    </>
  );
}
