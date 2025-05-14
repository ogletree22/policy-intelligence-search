import React, { useState, useRef } from 'react';
import './PiCoPilot.css';
import { useChat } from '../context/ChatContext';
import { useWorkingFolder } from '../context/WorkingFolderContext';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import CreateFolderModal from './CreateFolderModal';

const SourcesPanel = ({ showSourcesPanel = true, setShowSourcesPanel }) => {
  const { chatHistory, activeThreadIndex } = useChat();
  const { folders, addToFolderRemote, createFolderRemote, loadFolders } = useWorkingFolder();
  const [addToFolderDropdownId, setAddToFolderDropdownId] = useState(null);
  const [addToFolderDropdownCoords, setAddToFolderDropdownCoords] = useState({ top: 0, left: 0 });
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [pendingAddToFolderDoc, setPendingAddToFolderDoc] = useState(null);
  const dropdownRef = useRef(null);
  const buttonRefs = useRef({});
  const dropdownCloseTimeout = useRef(null);

  if (!showSourcesPanel) return null;

  // Get sources from the active thread
  const activeThread = typeof activeThreadIndex === 'number' && chatHistory[activeThreadIndex]
    ? chatHistory[activeThreadIndex]
    : null;
  const threadSources = activeThread ? activeThread.citations : [];
  // Only show user-created folders (not 'Working Folder')
  const userFolders = folders ? folders.filter(f => f.name !== 'Working Folder') : [];
  const hasUserFolders = userFolders.length > 0;

  return (
    <div className="citations-panel">
      <div className="citations-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>Sources</span>
        {setShowSourcesPanel && (
          <button
            className="history-btn sources-hide-btn"
            style={{ marginLeft: 8 }}
            onClick={() => setShowSourcesPanel(false)}
            aria-label="Hide sources panel"
          >
            Hide
          </button>
        )}
      </div>
      <div className="citations-list">
        {threadSources && threadSources.length > 0 ? (
          threadSources.map((citation, index) => (
            <div key={index} className="citation-item" style={{ position: 'relative' }}>
              <a
                href={citation.pi_url || citation.url || '#'}
                className="citation-title"
                target="_blank"
                rel="noopener noreferrer"
              >
                {citation.title}
              </a>
              <div className="citation-text">
                {citation.jurisdiction && <div>Jurisdiction: {citation.jurisdiction}</div>}
                {citation.source && <div>Source: {citation.source}</div>}
                {citation.text && <div>{citation.text}</div>}
              </div>
              <button
                ref={el => buttonRefs.current[index] = el}
                className="add-direct-to-folder-button"
                title={hasUserFolders ? 'Add directly to folder' : 'No folders available'}
                onClick={e => {
                  if (hasUserFolders) {
                    if (addToFolderDropdownId === index) {
                      setAddToFolderDropdownId(null);
                    } else {
                      // Get the button's position relative to the citation-item
                      const btn = buttonRefs.current[index];
                      if (btn && btn.parentElement) {
                        const parentRect = btn.parentElement.getBoundingClientRect();
                        const btnRect = btn.getBoundingClientRect();
                        // Always use fallback width for consistent alignment
                        const dropdownWidth = 180;
                        setAddToFolderDropdownCoords({
                          top: btnRect.bottom - parentRect.top,
                          left: btnRect.right - parentRect.left - dropdownWidth // right edge aligns with button
                        });
                      } else {
                        setAddToFolderDropdownCoords({ top: 32, left: 0 });
                      }
                      setAddToFolderDropdownId(index);
                    }
                  } else {
                    setPendingAddToFolderDoc(citation);
                    setShowCreateFolderModal(true);
                  }
                }}
                style={{ marginLeft: 4, position: 'absolute', top: 8, right: 8, zIndex: 10 }}
                onMouseLeave={() => {
                  dropdownCloseTimeout.current = setTimeout(() => setAddToFolderDropdownId(null), 200);
                }}
                onMouseEnter={() => {
                  if (dropdownCloseTimeout.current) {
                    clearTimeout(dropdownCloseTimeout.current);
                    dropdownCloseTimeout.current = null;
                  }
                }}
              >
                <CreateNewFolderIcon style={{ color: '#ffb300', width: 20, height: 20, background: 'none' }} />
              </button>
              {addToFolderDropdownId === index && hasUserFolders && (
                <div
                  ref={dropdownRef}
                  className="add-to-folder-dropdown"
                  style={{
                    position: 'absolute',
                    minWidth: 140,
                    maxWidth: 320,
                    left: addToFolderDropdownCoords.left,
                    top: addToFolderDropdownCoords.top,
                    zIndex: 2000,
                    background: '#fff',
                    border: '1.5px solid #e0e6ed',
                    borderRadius: 10,
                    boxShadow: '0 4px 16px rgba(39,76,119,0.10)',
                    padding: '2px 8px',
                    fontSize: 12,
                    color: '#274C77',
                    fontFamily: 'Roboto Condensed, Roboto, Arial, sans-serif',
                    fontWeight: 400,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    transition: 'left 0.18s cubic-bezier(0.4,0,0.2,1), opacity 0.18s',
                    transform: 'translateX(24px)',
                  }}
                  onMouseEnter={() => {
                    if (dropdownCloseTimeout.current) {
                      clearTimeout(dropdownCloseTimeout.current);
                      dropdownCloseTimeout.current = null;
                    }
                  }}
                  onMouseLeave={() => {
                    dropdownCloseTimeout.current = setTimeout(() => setAddToFolderDropdownId(null), 200);
                  }}
                >
                  {userFolders.map(folder => {
                    const alreadyInFolder = folder.documents.some(doc =>
                      (doc.id && citation.id && doc.id === citation.id) ||
                      (doc.url && citation.url && doc.url === citation.url) ||
                      (doc.title && citation.title && doc.title === citation.title)
                    );
                    return (
                      <div
                        key={folder.id}
                        className="add-to-folder-dropdown-item"
                        style={{
                          display: 'block',
                          width: '100%',
                          textAlign: 'left',
                          padding: '2px 0 2px 10px',
                          background: 'none',
                          border: 'none',
                          cursor: alreadyInFolder ? 'not-allowed' : 'pointer',
                          color: alreadyInFolder ? '#aaa' : 'inherit',
                          opacity: alreadyInFolder ? 0.7 : 1,
                          position: 'relative',
                          borderRadius: 6,
                          transition: 'background 0.15s',
                          fontWeight: 400,
                          fontSize: 12,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                        onMouseDown={e => e.preventDefault()}
                        onClick={async () => {
                          if (!alreadyInFolder) {
                            await addToFolderRemote(citation, folder.id);
                            await loadFolders();
                          }
                          setAddToFolderDropdownId(null);
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(69,123,157,0.07)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                      >
                        {folder.name}
                        {alreadyInFolder && (
                          <span style={{ marginLeft: 8, color: '#4caf50', fontSize: 12, fontWeight: 600 }}>✔</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))
        ) : (
          <div style={{ color: '#888', fontStyle: 'italic', padding: '8px' }}>No sources for this answer.</div>
        )}
        <CreateFolderModal
          isOpen={showCreateFolderModal}
          onClose={() => {
            setShowCreateFolderModal(false);
            setPendingAddToFolderDoc(null);
          }}
          onCreateFolder={async (folderName) => {
            const newFolder = await createFolderRemote(folderName);
            setShowCreateFolderModal(false);
            if (pendingAddToFolderDoc && newFolder && newFolder.id) {
              addToFolderRemote(pendingAddToFolderDoc, newFolder.id);
              setPendingAddToFolderDoc(null);
            }
          }}
        />
      </div>
    </div>
  );
};

export default SourcesPanel; 