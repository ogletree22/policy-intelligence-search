import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';

const FolderContext = createContext();

export const useFolderContext = () => {
  const context = useContext(FolderContext);
  if (!context) {
    throw new Error('useFolderContext must be used within a FolderProvider');
  }
  return context;
};

export const FolderProvider = ({ children }) => {
  // Initialize with a default folder
  const [folders, setFolders] = useState([
    {
      id: 1,
      name: 'My Documents',
      documents: []
    }
  ]);
  const [currentFolderId, setCurrentFolderId] = useState(1);

  // Ensure currentFolder is always valid
  const currentFolder = useMemo(() => {
    const folder = folders.find(f => f.id === currentFolderId);
    if (!folder) {
      console.warn('Current folder not found, using default folder');
      return folders[0];
    }
    return folder;
  }, [folders, currentFolderId]);

  // Validate folder state on mount and changes
  useEffect(() => {
    if (!Array.isArray(folders) || folders.length === 0) {
      console.warn('Invalid folders state, reinitializing...');
      setFolders([{
        id: 1,
        name: 'My Documents',
        documents: []
      }]);
      setCurrentFolderId(1);
    }
  }, [folders]);

  const addToFolder = (document) => {
    try {
      if (!document || !document.id) {
        console.error('Invalid document:', document);
        return;
      }

      setFolders(prevFolders => {
        const folder = prevFolders.find(f => f.id === currentFolderId);
        if (!folder) {
          console.error('Current folder not found');
          return prevFolders;
        }

        const docId = Number(document.id);
        const documentExists = folder.documents.some(doc => Number(doc.id) === docId);

        if (!documentExists) {
          const newDoc = {
            id: docId,
            title: document.title,
            url: document.url,
            description: document.description
          };

          return prevFolders.map(f => {
            if (f.id === currentFolderId) {
              return {
                ...f,
                documents: [...f.documents, newDoc]
              };
            }
            return f;
          });
        }
        return prevFolders;
      });
    } catch (error) {
      console.error('Error in addToFolder:', error);
    }
  };

  const removeFromFolder = (documentId) => {
    try {
      if (!documentId) {
        console.error('Invalid document ID:', documentId);
        return;
      }

      const docId = Number(documentId);
      setFolders(prevFolders => {
        return prevFolders.map(f => {
          if (f.id === currentFolderId) {
            return {
              ...f,
              documents: f.documents.filter(doc => Number(doc.id) !== docId)
            };
          }
          return f;
        });
      });
    } catch (error) {
      console.error('Error in removeFromFolder:', error);
    }
  };

  const createFolder = (name) => {
    const newFolder = {
      id: Math.max(...folders.map(f => f.id)) + 1,
      name,
      documents: []
    };
    setFolders(prev => [...prev, newFolder]);
    return newFolder;
  };

  const deleteFolder = (folderId) => {
    if (folders.length === 1) {
      console.warn('Cannot delete the last folder');
      return;
    }
    setFolders(prev => prev.filter(f => f.id !== folderId));
    if (currentFolderId === folderId) {
      setCurrentFolderId(folders[0].id);
    }
  };

  const renameFolder = (folderId, newName) => {
    setFolders(prev => prev.map(f => 
      f.id === folderId 
        ? { ...f, name: newName }
        : f
    ));
  };

  const selectFolder = (folderId) => {
    setCurrentFolderId(folderId);
  };

  const value = useMemo(() => ({
    folders,
    currentFolder,
    currentFolderId,
    addToFolder,
    removeFromFolder,
    createFolder,
    deleteFolder,
    renameFolder,
    selectFolder
  }), [folders, currentFolder, currentFolderId]);

  return (
    <FolderContext.Provider value={value}>
      {children}
    </FolderContext.Provider>
  );
}; 