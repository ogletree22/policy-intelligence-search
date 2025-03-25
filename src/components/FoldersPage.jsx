import React from 'react';
import { FaFolder } from 'react-icons/fa';
import './FoldersPage.css';

const FoldersPage = () => {
  const folders = [
    { id: 1, name: 'Policy Documents', count: 15 },
    { id: 2, name: 'Research Papers', count: 8 },
    { id: 3, name: 'Meeting Notes', count: 12 },
    { id: 4, name: 'Reports', count: 20 },
    { id: 5, name: 'Guidelines', count: 6 },
    { id: 6, name: 'Presentations', count: 10 },
  ];

  return (
    <div className="folders-container">
      <h1>Document Folders</h1>
      <div className="folders-grid">
        {folders.map((folder) => (
          <div key={folder.id} className="folder-card">
            <FaFolder className="folder-icon" />
            <h3>{folder.name}</h3>
            <p>{folder.count} documents</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoldersPage; 