import { SearchBarWithFilters } from "../SearchBarWithFilters/SearchBarWithFilters";
import { DataTable } from "../DataTable/DataTable";
import { TableTabs } from "../TableTabs/TableTabs";

import { Pagination } from "../../ui/Pagination/Pagination";

export function TableContainer(
    {   
      data, 
      columns, 
      placeholderInput, 
      messageNoSearch, 
      handleClick, 
      rowClassName,
      // Busqueda
      search,
      onSearchChange,
      // Filtros Dropdown
      activeFilters,
      onFilterChange,
      filterGroups,
      // Tabs (opcional)
      tabs,
      activeTab,
      onTabChange,
      // Paginacion
      pagination,
      onPageChange,
      // Le dice a DataTable si hay algo activo (para mensaje de vacio vs no resultados)
      isFiltering
    }) {
    
  return (
    <>

       {tabs?.length > 0 && (
          <TableTabs
              tabs={tabs}
              active={activeTab}
              onChange={onTabChange}
          />
      )}

      <SearchBarWithFilters
          search={search}
          onSearchChange={onSearchChange}
          activeFilters={activeFilters}
          filterGroups={filterGroups}
          onFilterChange={onFilterChange}
          placeholderInput={placeholderInput}
      />

      <DataTable
          data={data}
          columns={columns}
          messageNoSearch={messageNoSearch}
          handleClick={handleClick}
          rowClassName={rowClassName}
          isFiltering={isFiltering}
      />

      {
        pagination && (
          <div className="pagination__container" style={{marginTop: "2.5rem", transform: "scale(0.9)"}}>
            <Pagination 
              pagination={pagination}
              onPageChange={onPageChange}/>
          </div>
        )
      }
      
    </>
  );
}
