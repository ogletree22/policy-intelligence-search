import React from 'react';
import PropTypes from 'prop-types';
import './FolderPanel.css';
import FolderResultCard from './FolderResultCard';
import folderIcon from '../assets/Folder.png';
import { useFolderContext } from '../context/FolderContext';

const FolderPanel = ({ subtitle = "Download folder" }) => {
  const { currentFolder, removeFromFolder } = useFolderContext();

  const renderHeader = () => (
    <>
      <h2 className="folder-title">Folder</h2>
      <div className="folder-header">
        <div className="folder-subtitle">
          <img src={folderIcon} alt="Folder icon" className="folder-panel-icon" />
          <span className="folder-name">{currentFolder.name}</span>
        </div>
      </div>
    </>
  );

  const renderDocumentsList = () => (
    <div className="folder-results-list">
      {currentFolder.documents.map(doc => (
        <FolderResultCard
          key={doc.id}
          document={doc}
          onRemove={removeFromFolder}
        />
      ))}
      {currentFolder.documents.length === 0 && (
        <p className="empty-folder-message">No documents in folder</p>
      )}
    </div>
  );

  return (
    <div className="folder-panel">
      {renderHeader()}
      <div className="folder-contents">
        <p className="doc-count">
          {currentFolder.documents.length} of {currentFolder.documents.length} documents
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
