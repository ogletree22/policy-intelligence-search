// App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import TopNav from './components/TopNav';
import SidebarFilters from './components/SidebarFilters';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import FolderPanel from './components/FolderPanel';
import FoldersPage from './components/FoldersPage';
import MOCK_DOCUMENTS from './mockData';
import './App.css';

function MainContent() {
  const [results, setResults] = useState(MOCK_DOCUMENTS);
  const [filters, setFilters] = useState({});
  const location = useLocation();

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
      <TopNav />

      <div className="main-layout">
        <aside className="sidebar">
          <SidebarFilters onFilterChange={setFilters} />
        </aside>

        <main className="main-section">
          {location.pathname === '/' && (
            <div className="center-content">
              <SearchBar onSearch={handleSearch} />
              <SearchResults results={results} />
            </div>
          )}
          
          {location.pathname === '/folders' && (
            <FoldersPage />
          )}
        </main>

        {location.pathname === '/' && (
          <aside className="folder-panel">
            <FolderPanel />
          </aside>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router basename="/policy-intelligence-search">
      <Routes>
        <Route path="/" element={<MainContent />} />
        <Route path="/folders" element={<MainContent />} />
      </Routes>
    </Router>
  );
}

export default App;
