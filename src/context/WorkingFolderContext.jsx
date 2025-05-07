import React, { createContext, useContext, useState } from 'react';

const WorkingFolderContext = createContext();

export function WorkingFolderProvider({ children }) {
  const [workingFolderDocs, setWorkingFolderDocs] = useState([]);
  const [folders, setFolders] = useState([]);
  const [currentFolderId, setCurrentFolderId] = useState(null);

  const addToWorkingFolder = (document) => {
    console.log('Adding document to working folder:', document);
    
    setWorkingFolderDocs(prev => {
      // Check if document already exists
      const exists = prev.some(doc => doc.id === document.id);
      if (exists) {
        console.log('Document already exists in working folder');
        return prev;
      }
      
      // Add new document
      return [...prev, document];
    });
  };

  const removeFromWorkingFolder = (documentId) => {
    console.log('Removing document from working folder:', documentId);
    
    setWorkingFolderDocs(prev => 
      prev.filter(doc => doc.id !== documentId)
    );
  };

  const createFolder = (name) => {
    const newFolder = {
      id: Date.now(), // Use timestamp as unique ID
      name,
      documents: []
    };
    setFolders(prev => [...prev, newFolder]);
    return newFolder;
  };

  const moveToFolder = (documentId, folderId) => {
    // Remove from working folder
    removeFromWorkingFolder(documentId);
    
    // Add to the target folder
    setFolders(prev => prev.map(folder => {
      if (folder.id === folderId) {
        const doc = workingFolderDocs.find(d => d.id === documentId);
        if (doc && !folder.documents.some(d => d.id === documentId)) {
          return {
            ...folder,
            documents: [...folder.documents, doc]
          };
        }
      }
      return folder;
    }));
  };

  const removeFromFolder = (documentId, folderId) => {
    setFolders(prev => prev.map(folder => {
      if (folder.id === folderId) {
        return {
          ...folder,
          documents: folder.documents.filter(doc => doc.id !== documentId)
        };
      }
      return folder;
    }));
  };

  const deleteFolder = (folderId) => {
    setFolders(prev => prev.filter(f => f.id !== folderId));
  };

  const addToFolder = (document, folderId) => {
    setFolders(prev => prev.map(folder => {
      if (folder.id === folderId) {
        // Prevent duplicates
        if (!folder.documents.some(doc => doc.id === document.id)) {
          return {
            ...folder,
            documents: [...folder.documents, document]
          };
        }
      }
      return folder;
    }));
  };

  return (
    <WorkingFolderContext.Provider 
      value={{ 
        workingFolderDocs, 
        addToWorkingFolder, 
        removeFromWorkingFolder,
        folders,
        createFolder,
        moveToFolder,
        removeFromFolder,
        deleteFolder,
        currentFolderId,
        setCurrentFolderId,
        addToFolder
      }}
    >
      {children}
    </WorkingFolderContext.Provider>
  );
}

export function useWorkingFolder() {
  const context = useContext(WorkingFolderContext);
  if (!context) {
    throw new Error('useWorkingFolder must be used within a WorkingFolderProvider');
  }
  return context;
} 