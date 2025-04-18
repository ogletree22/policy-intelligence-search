import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import './FoldersPage.css';

interface Document {
  id: string;
  title: string;
  description: string;
  tags: string[];
}

interface Folder {
  id: string;
  name: string;
  documents: Document[];
}

// Update mock data to include more files
const mockFolders: Folder[] = [
  {
    id: '1',
    name: 'Colorado - Regulation Number 1',
    documents: [
      {
        id: '1',
        title: 'Emission Standards Document',
        description: 'Establishes emission standards and control requirements for particulate matter, sulfur oxides, and carbon monoxide.',
        tags: ['Colorado', 'Regulation']
      },
      {
        id: '2',
        title: 'Testing Requirements',
        description: 'Details monitoring, testing, and reporting requirements for affected sources.',
        tags: ['Testing', 'Requirements']
      },
      {
        id: '3',
        title: 'Implementation Guidelines',
        description: 'Guidelines for implementing emission control measures and compliance tracking.',
        tags: ['Guidelines', 'Implementation']
      }
    ]
  },
  {
    id: '2',
    name: 'Colorado - Regulation Number 3',
    documents: [
      {
        id: '4',
        title: 'Permitting Requirements',
        description: 'Implements permitting requirements for stationary sources.',
        tags: ['Colorado', 'Permits']
      },
      {
        id: '5',
        title: 'Application Procedures',
        description: 'Details application procedures and documentation requirements.',
        tags: ['Procedures', 'Applications']
      },
      {
        id: '6',
        title: 'Monitoring Guidelines',
        description: 'Emission limits and monitoring requirements for affected facilities.',
        tags: ['Monitoring', 'Guidelines']
      }
    ]
  }
];

const FoldersPage: React.FC = () => {
  const [folders] = useState<Folder[]>(mockFolders);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set());

  const toggleDescription = (fileId: string) => {
    setExpandedDescriptions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(fileId)) {
        newSet.delete(fileId);
      } else {
        newSet.add(fileId);
      }
      return newSet;
    });
  };

  return (
    <div className="folders-container">
      <div className="folders-header">
        <h1>Document search</h1>
      </div>

      <div className="search-container">
        <FaSearch className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="e.g. nox regulations colorado"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p className="doc-count">101 of 101 documents</p>
        <div className="sort-container">
          <span className="sort-label">Sort:</span>
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="relevance">Relevance</option>
            <option value="date">Date</option>
            <option value="title">Title</option>
          </select>
        </div>
      </div>

      <div className="folders-scroll-container">
        <div className="folders-grid">
          {folders.map((folder) => (
            <div key={folder.id} className="folder-card">
              <h2 className="folder-title">{folder.name}</h2>
              <p className="folder-description">
                Contains {folder.documents.length} documents related to {folder.name.toLowerCase()}
              </p>
              <div className="folder-meta">
                <span className="folder-type">Folder</span>
                <span className="document-count">{folder.documents.length} documents</span>
              </div>
              <div className="folder-files-container">
                {folder.documents.map((doc) => (
                  <div key={doc.id} className="file-card">
                    <h3 className="file-title">{doc.title}</h3>
                    <div 
                      className={`file-description ${expandedDescriptions.has(doc.id) ? 'expanded' : ''}`}
                      onClick={() => toggleDescription(doc.id)}
                    >
                      {doc.description}
                    </div>
                    <div className="file-tags">
                      {doc.tags.map((tag) => (
                        <span key={tag} className="file-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FoldersPage; 