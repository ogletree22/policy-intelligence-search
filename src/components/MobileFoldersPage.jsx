import React, { useState } from 'react';
import { useWorkingFolder } from '../context/WorkingFolderContext';
import { FaTrash, FaPlus, FaChevronDown, FaChevronUp, FaEdit, FaCheck, FaTimes, FaEye, FaChevronRight } from 'react-icons/fa';
import { FolderIconWithIndicator, FOLDER_COLORS } from './FolderIconWithIndicator';
import './MobileLayout.css';
import WorkingFolderView from './WorkingFolderView';

const MobileFoldersPage = ({ isOpen, onClose }) => {
  const { folders, createFolder, deleteFolder, renameFolder, removeFromFolder } = useWorkingFolder();
  const [expandedFolderIds, setExpandedFolderIds] = useState([]);
  const [showCreateInput, setShowCreateInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [renamingFolderId, setRenamingFolderId] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const [viewingFolder, setViewingFolder] = useState(null);

  if (!isOpen) return null;

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      createFolder(newFolderName.trim());
      setNewFolderName('');
      setShowCreateInput(false);
    }
  };

  const handleRenameFolder = (folderId) => {
    if (renameValue.trim()) {
      renameFolder(folderId, renameValue.trim());
      setRenamingFolderId(null);
      setRenameValue('');
    }
  };

  return (
    <div className="mobile-folders-page" style={{
      position: 'fixed',
      top: 64,
      left: 0,
      right: 0,
      bottom: 0,
      background: '#f8f9fa',
      zIndex: 999,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Nav-style button row */}
      <div style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        background: '#f8f9fa',
        borderBottom: '1px solid #eee',
        padding: '10px 14px 8px 14px',
        minHeight: 40,
      }}>
        <button
          onClick={() => setShowCreateInput((v) => !v)}
          aria-label="Create folder"
          style={{
            width: 32,
            height: 32,
            background: '#274C77',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'background 0.2s',
            WebkitTapHighlightColor: 'transparent',
            outline: 'none',
          }}
          onMouseOver={e => e.currentTarget.style.background = '#1d3857'}
          onMouseOut={e => e.currentTarget.style.background = '#274C77'}
        >
          +
        </button>
      </div>
      <div style={{ padding: '18px', flex: 1, overflowY: 'auto', background: '#f8f9fa' }}>
        {showCreateInput && (
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
            <input
              type="text"
              value={newFolderName}
              onChange={e => setNewFolderName(e.target.value)}
              placeholder="New folder name"
              style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #ccc', marginRight: 8 }}
              autoFocus
            />
            <button onClick={handleCreateFolder} style={{ background: '#457b9d', color: 'white', border: 'none', borderRadius: 6, padding: '8px 12px', fontWeight: 600, cursor: 'pointer', WebkitTapHighlightColor: 'transparent', outline: 'none' }}>Create</button>
            <button onClick={() => setShowCreateInput(false)} style={{ background: 'none', border: 'none', color: '#888', fontSize: 20, marginLeft: 4, cursor: 'pointer', WebkitTapHighlightColor: 'transparent', outline: 'none' }}><FaTimes /></button>
          </div>
        )}
        {folders && folders.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {folders.map((folder, idx) => (
              <li key={folder.id} style={{
                background: '#dbeafe', // blue-100
                borderRadius: 8,
                marginBottom: 10,
                boxShadow: '0 1px 4px rgba(39,76,119,0.04)',
                padding: 0,
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '6px 10px 4px 10px',
                }}>
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', width: '100%', WebkitTapHighlightColor: 'transparent', outline: 'none' }}
                    onClick={() => {
                      setExpandedFolderIds(prev =>
                        prev.includes(folder.id)
                          ? prev.filter(id => id !== folder.id)
                          : [...prev, folder.id]
                      );
                    }}
                  >
                    {/* Chevron indicator for expand/collapse */}
                    {expandedFolderIds.includes(folder.id) ? (
                      <FaChevronDown style={{ color: '#b6c6e3', fontSize: '16px', marginRight: 2 }} />
                    ) : (
                      <FaChevronRight style={{ color: '#b6c6e3', fontSize: '16px', marginRight: 2 }} />
                    )}
                    <FolderIconWithIndicator indicatorColor={FOLDER_COLORS[idx % FOLDER_COLORS.length]} size={54} count={folder.documents?.length || 0} />
                    <span style={{ fontWeight: 700, fontSize: 20, marginLeft: 0 }}>{folder.name}</span>
                  </div>
                  {expandedFolderIds.includes(folder.id) && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                      <FaEye style={{ color: '#274C77', fontSize: 18, opacity: 0.7, cursor: 'pointer' }} onClick={() => setViewingFolder(folder)} />
                      <button onClick={() => {
                        if (window.confirm('Are you sure you want to delete this folder?')) {
                          deleteFolder(folder.id);
                        }
                      }} style={{ background: 'none', border: 'none', color: '#999', fontSize: 18, cursor: 'pointer', padding: 0 }} onMouseOver={e => e.currentTarget.style.color = '#d32f2f'} onMouseOut={e => e.currentTarget.style.color = '#999'}><FaTrash /></button>
                    </div>
                  )}
                </div>
                {expandedFolderIds.includes(folder.id) && folder.documents && folder.documents.length > 0 && (
                  <ul style={{ listStyle: 'none', padding: '0 0 0 0', margin: 0, background: '#e8f0fe', borderRadius: '0 0 8px 8px' }}>
                    {folder.documents.map(doc => (
                      <li key={doc.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid #dbeafe', fontSize: 15, color: '#274C77' }}>
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 180 }}>{doc.title}</span>
                        <button onClick={() => {
                          if (window.confirm('Are you sure you want to remove this document from the folder?')) {
                            removeFromFolder(doc.id, folder.id);
                          }
                        }} style={{ background: 'none', border: 'none', color: '#999', fontSize: 16, cursor: 'pointer', marginLeft: 8, padding: 0 }} onMouseOver={e => e.currentTarget.style.color = '#d32f2f'} onMouseOut={e => e.currentTarget.style.color = '#999'}><FaTrash /></button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div style={{ color: '#888', textAlign: 'center', marginTop: 40 }}>No folders found.</div>
        )}
        {/* WorkingFolderView modal for folder view */}
        <WorkingFolderView
          isOpen={!!viewingFolder}
          onClose={() => setViewingFolder(null)}
          documents={folders.find(f => f.id === viewingFolder?.id)?.documents || []}
          title={folders.find(f => f.id === viewingFolder?.id)?.name || viewingFolder?.name}
          folder={folders.find(f => f.id === viewingFolder?.id) || viewingFolder}
        />
      </div>
    </div>
  );
};

export default MobileFoldersPage; 