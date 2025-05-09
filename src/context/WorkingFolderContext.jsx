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
    setWorkingFolderDocs(prev => prev.filter(doc => doc.id !== documentId));

    // Remove from all folders and add to the target folder
    setFolders(prev => {
      // Find the document in any folder or workingFolderDocs
      let doc = workingFolderDocs.find(d => d.id === documentId);
      if (!doc) {
        for (const folder of prev) {
          const found = folder.documents.find(d => d.id === documentId);
          if (found) {
            doc = found;
            break;
          }
        }
      }
      if (!doc) return prev; // If not found, do nothing

      return prev.map(folder => {
        // Remove from all folders
        let newDocs = folder.documents.filter(d => d.id !== documentId);
        // Add to target folder if not already present
        if (folder.id === folderId && !folder.documents.some(d => d.id === documentId)) {
          newDocs = [...newDocs, doc];
        }
        return { ...folder, documents: newDocs };
      });
    });
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

  const renameFolder = (folderId, newName) => {
    setFolders(prev => prev.map(folder =>
      folder.id === folderId ? { ...folder, name: newName } : folder
    ));
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
        addToFolder,
        renameFolder
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