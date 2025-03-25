import React, { useState } from 'react';
import './FolderPanel.css';
import FolderResultCard from './FolderResultCard';
import folderIcon from '../assets/folder.png'; // 👈 your custom icon

const FolderPanel = () => {
  // This would typically come from your app state management
  const [folderDocuments, setFolderDocuments] = useState([
    {
      id: 1,
      title: "Colorado - Regulation No. 1: Emissions Standards",
      description: "Establishes baseline emissions standards for industrial operations in Colorado.",
      jurisdiction: "Colorado",
      type: "Regulation"
    },
    {
      id: 2,
      title: "Texas - Air Quality Standard Permit for Oil and Gas",
      description: "Standard permit for emissions from oil and gas sites.",
      jurisdiction: "Texas",
      type: "Permit"
    },
    {
      id: 3,
      title: "Colorado - Guidance on Methane Rule Implementation",
      description: "Explains how to comply with new methane standards.",
      jurisdiction: "Colorado",
      type: "Guidance"
    }
  ]);

  const handleRemoveDocument = (documentId) => {
    setFolderDocuments(docs => docs.filter(doc => doc.id !== documentId));
  };

  return (
    <div className="folder-panel">
      <div className="folder-header">
        <div className="folder-title-section">
          <h3 className="folder-title">Folder</h3>
          <div className="folder-subtitle">
            <img src={folderIcon} alt="Folder" className="folder-panel-icon" />
            <span className="folder-name">Download folder</span>
          </div>
        </div>
      </div>
      <div className="folder-contents">
        <p className="doc-count">
          {folderDocuments.length} of {folderDocuments.length} documents
        </p>
        <div className="folder-results-list">
          {folderDocuments.map(doc => (
            <FolderResultCard
              key={doc.id}
              document={doc}
              onRemove={handleRemoveDocument}
            />
          ))}
          {folderDocuments.length === 0 && (
            <p className="empty-folder-message">No documents in folder</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FolderPanel;
