import React from 'react';
import { FaTimes } from 'react-icons/fa';
import './WorkingFolderView.css';

const WorkingFolderView = ({ isOpen, onClose, documents }) => {
  if (!isOpen) return null;

  return (
    <div className="working-folder-overlay">
      <div className="working-folder-modal">
        <div className="working-folder-header">
          <h3>Working Folder Contents</h3>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <div className="working-folder-content">
          {documents.length === 0 ? (
            <p className="empty-message">No documents in working folder</p>
          ) : (
            <ul className="document-list">
              {documents.map((doc, index) => (
                <li key={index} className="document-item">
                  <div className="document-info">
                    <span className="document-title">{doc.title}</span>
                    <span className="document-description">{doc.description}</span>
                    <div className="document-meta">
                      <span className="document-jurisdiction">{doc.jurisdiction}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkingFolderView; 