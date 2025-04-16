import React from 'react';
import PropTypes from 'prop-types';
import './FolderPanel.css';
import FolderResultCard from './FolderResultCard';
import folderIcon from '../assets/Folder.png';
import { useWorkingFolder } from '../context/WorkingFolderContext';

const FolderPanel = ({ subtitle = "Working folder" }) => {
  const { workingFolderDocs, removeFromWorkingFolder } = useWorkingFolder();

  const handleRemove = (docId) => {
    if (docId) {
      removeFromWorkingFolder(docId);
    }
  };

  const renderHeader = () => (
    <>
      <h2 className="folder-title">Working Folder</h2>
      <div className="folder-header">
        <div className="folder-subtitle">
          <img src={folderIcon} alt="Folder icon" className="folder-panel-icon" />
          <span className="folder-name">Working Folder</span>
        </div>
      </div>
    </>
  );

  const renderDocumentsList = () => (
    <div className="folder-results-list">
      {workingFolderDocs.map(doc => (
        <FolderResultCard
          key={doc.id}
          document={doc}
          onRemove={() => handleRemove(doc.id)}
        />
      ))}
      {workingFolderDocs.length === 0 && (
        <p className="empty-folder-message">No documents in folder</p>
      )}
    </div>
  );

  return (
    <div className="folder-panel">
      {renderHeader()}
      <div className="folder-contents">
        <p className="doc-count">
          {workingFolderDocs.length} of {workingFolderDocs.length} documents
        </p>
        {renderDocumentsList()}
      </div>
    </div>
  );
};

FolderPanel.propTypes = {
  subtitle: PropTypes.string
};

export default FolderPanel;
