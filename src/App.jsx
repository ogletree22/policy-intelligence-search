import React, { useState } from 'react';
import TopNav from './components/TopNav';
import SidebarFilters from './components/SidebarFilters';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import FolderPanel from './components/FolderPanel';
import MOCK_DOCUMENTS from './mockData';
import './App.css';

function App() {
  const [results, setResults] = useState(MOCK_DOCUMENTS);
  const [filters, setFilters] = useState({});

  const handleSearch = (query) => {
    const q = query.toLowerCase();
    let filtered = MOCK_DOCUMENTS.filter(doc =>
      doc.title?.toLowerCase().includes(q) || doc.description?.toLowerCase().includes(q)
    );

    const activeFilters = Object.keys(filters).filter(key => filters[key]);
    if (activeFilters.length > 0) {
      filtered = filtered.filter(doc =>
        activeFilters.includes(doc.type) || activeFilters.includes(doc.jurisdiction)
      );
    }

    setResults(filtered);
  };

  return (
    <div className="app-wrapper">
      <div className="top-border" />
      <div className="layout-row">
        <aside className="sidebar">
          <SidebarFilters onFilterChange={setFilters} />
        </aside>
        <div className="main-right">
          <TopNav />
          <div className="main-content">
            <div className="center-content">
              <SearchBar onSearch={handleSearch} />
              <SearchResults results={results} />
            </div>
            <aside className="folder-panel">
              <FolderPanel />
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
