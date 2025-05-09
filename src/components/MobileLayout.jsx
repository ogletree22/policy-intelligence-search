import React, { useState, useEffect, useContext, useRef } from 'react';
import { useSearchPage } from '../context/SearchPageContext';
import { useWorkingFolder } from '../context/WorkingFolderContext';
import { AuthContext } from '../context/AuthContext';
import { FaUser } from 'react-icons/fa';
import MobileSearchBar from './MobileSearchBar';
import SearchResults from './SearchResults';
import MobileChat from './MobileChat';
import MobileWelcomeOverlay from './MobileWelcomeOverlay';
import piLogo from '../assets/PI Logo long.svg';
import MobileFolderIcon from './MobileFolderIcon';
import WorkingFolderView from './WorkingFolderView';
import piGlobalFolder from '../assets/PI_global_folder.svg';
import './MobileLayout.css';

const MobileLayout = () => {
  const [activeTab, setActiveTab] = useState('search');
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [loadingWelcome, setLoadingWelcome] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { results, loading, error } = useSearchPage();
  const { workingFolderDocs } = useWorkingFolder();
  const { signOut } = useContext(AuthContext);

  // Crossfade search bar transition state
  const [searchBarTransition, setSearchBarTransition] = useState(activeTab === 'search' && (!results || results.length === 0) && !loading && !error ? 'centered' : 'bottom');
  const prevIsSearchEmpty = useRef(activeTab === 'search' && (!results || results.length === 0) && !loading && !error);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowUserMenu(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showUserMenu]);

  useEffect(() => {
    // Delay rendering until we know if the welcome modal should show
    const hasSeen = localStorage.getItem('hasSeenMobileWelcome');
    setShowWelcome(!hasSeen);
    setLoadingWelcome(false);
  }, []);

  // Determine if the search page is empty (no results, not loading, no error)
  const isSearchEmpty = activeTab === 'search' && (!results || results.length === 0) && !loading && !error;

  useEffect(() => {
    // When search is initiated, trigger fade out, then fade in at bottom
    if (prevIsSearchEmpty.current && !isSearchEmpty) {
      setSearchBarTransition('fadingOut');
      setTimeout(() => {
        setSearchBarTransition('fadingIn');
        setTimeout(() => {
          setSearchBarTransition('bottom');
        }, 700);
      }, 700);
    }
    // If user clears search, go back to centered
    if (!prevIsSearchEmpty.current && isSearchEmpty) {
      setSearchBarTransition('centered');
    }
    prevIsSearchEmpty.current = isSearchEmpty;
  }, [isSearchEmpty]);

  if (loadingWelcome) return null;

  return (
    <div className="mobile-layout">
      {showWelcome && (
        <MobileWelcomeOverlay onClose={() => {
          setShowWelcome(false);
          localStorage.setItem('hasSeenMobileWelcome', 'true');
        }} />
      )}
      <div className="mobile-header">
        <div className="header-content">
          <img 
            src={piLogo}
            alt="Policy Intelligence" 
            className="brand-logo-long"
          />
          <div style={{ display: 'flex', alignItems: 'center' }}>
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
            <div className="user-menu">
              <button 
                className="user-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowUserMenu(!showUserMenu);
                }}
                aria-label="User menu"
              >
                <FaUser />
              </button>
              {showUserMenu && (
                <div className="user-dropdown">
                  <button onClick={() => {
                    setShowWelcome(true);
                    setShowUserMenu(false);
                  }}>Help</button>
                  <button onClick={handleSignOut}>Sign Out</button>
                </div>
              )}
            </div>
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
        <>
          {(searchBarTransition === 'centered' || searchBarTransition === 'fadingOut') && (
            <>
              <div className={`search-bar-container centered crossfade${searchBarTransition === 'fadingOut' ? ' fade-out' : ''}`}>
                <MobileSearchBar centered={true} />
              </div>
              {/* Cheat: cover the bottom with a box in the starting state */}
              <div style={{
                position: 'fixed',
                left: 0,
                right: 0,
                bottom: 0,
                height: 64,
                background: '#f8f9fa',
                zIndex: 101
              }} />
            </>
          )}
          {(searchBarTransition === 'bottom' || searchBarTransition === 'fadingIn') && (
            <div className={`search-bar-container crossfade${searchBarTransition === 'fadingIn' ? ' fade-in' : ''}`}>
              <MobileSearchBar centered={false} />
            </div>
          )}
        </>
      )}

      {workingFolderDocs.length > 0 && (
        <div
          className="mobile-folder-fab"
          {...(activeTab === 'chat' ? {} : { onClick: () => setShowFolderModal(true), role: 'button' })}
          style={{
            position: 'fixed',
            bottom: 90,
            right: 20,
            background: 'white',
            borderRadius: 18,
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            padding: '10px 10px 0px 10px',
            zIndex: 120,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: activeTab === 'chat' ? 'default' : 'pointer',
            border: '2px solid #f3f3f3',
            height: 48,
            minWidth: 64,
            minHeight: 40,
            maxWidth: '90vw',
            maxHeight: '90vw',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
            {activeTab === 'chat' ? (
              <img src={piGlobalFolder} alt="PI Global Folder" style={{ width: 32, height: 32 }} />
            ) : (
              <MobileFolderIcon size={44} count={workingFolderDocs.length} />
            )}
          </div>
        </div>
      )}

      {showFolderModal && (
        <WorkingFolderView isOpen={showFolderModal} onClose={() => setShowFolderModal(false)} documents={workingFolderDocs} />
      )}
    </div>
  );
};

export default MobileLayout; 