// App.jsx
import React, { useState, useContext, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import TopNav from './components/TopNav';
import SidebarFilters from './components/SidebarFilters';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import FolderPanel from './components/FolderPanel';
import FoldersPage from './components/FoldersPage';
import DynamicSearch from './components/DynamicSearch';
import PiCoPilot from './components/PiCoPilot';
import LoginPage from './components/LoginPage';
import MobileLoginPage from './components/MobileLoginPage';
import MobileLayout from './components/MobileLayout';
import { useMobileDetect } from './utils/mobileDetect';
import { FolderProvider } from './context/FolderContext';
import { WorkingFolderProvider } from './context/WorkingFolderContext';
import { FolderPageProvider } from './context/FolderPageContext';
import { SearchPageProvider, useSearchPage } from './context/SearchPageContext';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import { SidebarProvider, useSidebar } from './context/SidebarContext';
import { FolderExpansionProvider } from './context/FolderExpansionContext';
import './aws-config';
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
  const location = useLocation();
  const { results, loading, error, usingMockData, documentCounts, handleFilterChange } = useSearchPage();
  const isMobile = useMobileDetect();
  const { sidebarCollapsed, resetSidebarAnimation } = useSidebar();

  const isHomePage = location.pathname === '/' || location.hash === '#/';
  const isFoldersPage = location.pathname === '/folders' || location.hash === '#/folders';
  const isPiCoPilotPage = location.pathname === '/copilot' || location.hash === '#/copilot';
  const isDynamicSearchPage = location.pathname === '/dynamic' || location.hash === '#/dynamic' || location.pathname === '/' || location.hash === '#/';

  React.useEffect(() => {
    resetSidebarAnimation();
  }, [location, resetSidebarAnimation]);

  // Return mobile layout if on mobile device
  if (isMobile) {
    console.log('Rendering mobile layout');
    return <MobileLayout />;
  }

  // Desktop layout
  return (
    <div className="app-wrapper">
      <div className="top-border" />
      <TopNav />

      <div className="main-layout">
        <aside className={`sidebar ${isPiCoPilotPage ? 'disabled' : ''}`}>
          <SidebarFilters 
            isDisabled={isPiCoPilotPage} 
            documentCounts={documentCounts}
            onFilterChange={handleFilterChange}
          />
        </aside>

        <main className={`main-section ${isPiCoPilotPage ? 'full-width' : ''}${sidebarCollapsed ? ' sidebar-collapsed' : ''}`}>
          {isHomePage && (
            <div className="center-content">
              <SearchBar />
              <SearchResults />
            </div>
          )}
          
          {isFoldersPage && (
            <FoldersPage />
          )}

          {isPiCoPilotPage && (
            <PiCoPilot />
          )}
          
          {isDynamicSearchPage && (
            <DynamicSearch />
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
  const isMobile = useMobileDetect();
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <WorkingFolderProvider>
        <FolderProvider>
          <FolderPageProvider>
            <SearchPageProvider>
              <ChatProvider>
                <FolderExpansionProvider>
                  <Routes>
                    <Route 
                      path="/login" 
                      element={
                        !user ? (
                          isMobile ? (
                            <MobileLoginPage />
                          ) : (
                            <LoginPage />
                          )
                        ) : (
                          <Navigate to="/dynamic" replace />
                        )
                      } 
                    />
                    <Route
                      path="/"
                      element={
                        user ? (
                          <Navigate to="/dynamic" replace />
                        ) : (
                          <Navigate to="/login" replace />
                        )
                      }
                    />
                    <Route
                      path="/*"
                      element={
                        user ? (
                          <MainContent />
                        ) : (
                          <Navigate to="/login" replace />
                        )
                      }
                    />
                  </Routes>
                </FolderExpansionProvider>
              </ChatProvider>
            </SearchPageProvider>
          </FolderPageProvider>
        </FolderProvider>
      </WorkingFolderProvider>
    </Router>
  );
}

export default function AppWithAuth() {
  return (
    <AuthProvider>
      <SidebarProvider>
        <App />
      </SidebarProvider>
    </AuthProvider>
  );
}
