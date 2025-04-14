import React, { useEffect, useState } from 'react';
import { useSearchPage } from '../contexts/SearchPageContext';
import SidebarFilters from './SidebarFilters';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';

const SearchPage = () => {
  const { results, loading, error, handleSearch, handleFilterChange, searchQuery } = useSearchPage();

  return (
    <div className="app-wrapper">
      <div className="main-layout">
        <aside className="sidebar">
          <SidebarFilters 
            onFilterChange={handleFilterChange}
            searchQuery={searchQuery}
            handleSearch={handleSearch}
            instanceId="search-page"
          />
        </aside>
        <main className="main-content">
          <SearchBar instanceId="search-page" />
          <SearchResults />
        </main>
      </div>
    </div>
  );
};

export default SearchPage; 