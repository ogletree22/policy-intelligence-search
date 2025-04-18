import React, { useState, useEffect } from 'react';
import { useSearchPage } from '../context/SearchPageContext';
import { useWorkingFolder } from '../context/WorkingFolderContext';
import MobileSearchBar from './MobileSearchBar';
import SearchResults from './SearchResults';
import MobileChat from './MobileChat';
import MobileWorkingFolderModal from './MobileWorkingFolderModal';
import MobileWelcomeOverlay from './MobileWelcomeOverlay';
import piLogo from '../assets/PI Logo long.svg';
import './MobileLayout.css';

const MobileLayout = () => {
  const [activeTab, setActiveTab] = useState('search');
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const { results, loading } = useSearchPage();
  const { workingFolderDocs } = useWorkingFolder();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="mobile-layout">
      {showWelcome && (
        <MobileWelcomeOverlay onClose={() => setShowWelcome(false)} />
      )}
      <div className="mobile-header">
        <div className="header-content">
          <img 
            src={piLogo}
            alt="Policy Intelligence" 
            className="brand-logo-long"
          />
          <div className="mobile-tabs">
            <button 
              className={`tab-button ${activeTab === 'search' ? 'active' : ''}`}
              onClick={() => handleTabChange('search')}
              aria-label="Search tab"
            >
              Search
            </button>
            <button 
              className={`tab-button ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => handleTabChange('chat')}
              aria-label="Chat tab"
            >
              Co-Pilot
            </button>
          </div>
        </div>
      </div>

      <div className="mobile-content">
        {activeTab === 'search' ? (
          <div className="search-section">
            <SearchResults />
          </div>
        ) : (
          <div className="chat-section">
            <MobileChat />
          </div>
        )}
      </div>

      {activeTab === 'search' && (
        <div className="search-bar-container">
          <MobileSearchBar />
        </div>
      )}

      {workingFolderDocs.length > 0 && (
        <div 
          className="mobile-folder-indicator"
          onClick={() => setShowFolderModal(true)}
          role="button"
          tabIndex={0}
        >
          {workingFolderDocs.length} {workingFolderDocs.length === 1 ? 'document' : 'documents'} in folder
        </div>
      )}

      {showFolderModal && (
        <MobileWorkingFolderModal onClose={() => setShowFolderModal(false)} />
      )}
    </div>
  );
};

export default MobileLayout; 