// App.jsx
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import TopNav from './components/TopNav';
import SidebarFilters from './components/SidebarFilters';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import FolderPanel from './components/FolderPanel';
import FoldersPage from './components/FoldersPage';
import PiCoPilot from './components/PiCoPilot';
import LoginPage from './components/LoginPage';
import { FolderProvider } from './context/FolderContext';
import { WorkingFolderProvider } from './context/WorkingFolderContext';
import { FolderPageProvider } from './context/FolderPageContext';
import mockDataCO2 from './mockDataCO2.js';
import mockDataNM from './mockDataNM';
import mockDataSCAQMD from './mockDataSCAQMD';
import mockDataBAAD from './mockDataBAAD';
import mockDataTX from './mockDataTX';
import mockDataWA from './mockDataWA';
import mockDataUT from './mockDataUT';
import './App.css';

// Combine all mock data
const MOCK_DOCUMENTS = [
  ...mockDataCO2,
  ...mockDataNM,
  ...mockDataSCAQMD,
  ...mockDataBAAD,
  ...mockDataTX,
  ...mockDataWA,
  ...mockDataUT
];

function MainContent() {
  const [results, setResults] = useState(MOCK_DOCUMENTS);
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  const applyFilters = (documents, activeFilters, query) => {
    return documents.filter(doc => {
      // First apply search query
      const matchesSearch = !query || 
        doc.title?.toLowerCase().includes(query.toLowerCase()) || 
        doc.description?.toLowerCase().includes(query.toLowerCase()) ||
        doc.keywords?.some(keyword => keyword.toLowerCase().includes(query.toLowerCase()));

      if (!matchesSearch) return false;

      // If no filters are selected, show all documents
      const activeFilterKeys = Object.entries(activeFilters)
        .filter(([_, value]) => value)
        .map(([key]) => key);

      if (activeFilterKeys.length === 0) return true;

      // Check if document matches any selected jurisdiction or type
      return activeFilterKeys.some(filter => 
        doc.jurisdiction === filter || 
        (Array.isArray(doc.type) ? doc.type.includes(filter) : doc.type === filter)
      );
    });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setResults(applyFilters(MOCK_DOCUMENTS, filters, query));
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setResults(applyFilters(MOCK_DOCUMENTS, newFilters, searchQuery));
  };

  const isHomePage = location.pathname === '/' || location.hash === '#/';
  const isFoldersPage = location.pathname === '/folders' || location.hash === '#/folders';
  const isPiCoPilotPage = location.pathname === '/copilot' || location.hash === '#/copilot';

  return (
    <div className="app-wrapper">
      <div className="top-border" />
      <TopNav />

      <div className="main-layout">
        <aside className={`sidebar ${isPiCoPilotPage ? 'disabled' : ''}`}>
          <SidebarFilters 
            onFilterChange={handleFilterChange} 
            isDisabled={isPiCoPilotPage}
          />
        </aside>

        <main className={`main-section ${isPiCoPilotPage ? 'full-width' : ''}`}>
          {isHomePage && (
            <div className="center-content">
              <SearchBar onSearch={handleSearch} />
              <SearchResults results={results} />
            </div>
          )}
          
          {isFoldersPage && (
            <FoldersPage />
          )}

          {isPiCoPilotPage && (
            <PiCoPilot />
          )}
        </main>

        {isHomePage && (
          <aside className="folder-panel">
            <FolderPanel />
          </aside>
        )}
      </div>
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <WorkingFolderProvider>
        <FolderProvider>
          <FolderPageProvider>
            <Routes>
              <Route 
                path="/login" 
                element={
                  !isAuthenticated ? (
                    <LoginPage onLogin={setIsAuthenticated} />
                  ) : (
                    <Navigate to="/" replace />
                  )
                } 
              />
              <Route
                path="/*"
                element={
                  isAuthenticated ? (
                    <MainContent />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
            </Routes>
          </FolderPageProvider>
        </FolderProvider>
      </WorkingFolderProvider>
    </Router>
  );
}

export default App;
