  {folders.map((folder) => (
    <div
      key={folder.id}
      className="flex items-center gap-1.5 px-2 py-1.5 hover:bg-gray-100 rounded-md cursor-pointer"
      onClick={() => onFolderClick(folder)}
    >
      <div 
        className="w-3 h-3 rounded-full"
        style={{ 
          backgroundColor: folder.color,
          boxShadow: '0 0 0 1px rgba(255,255,255,0.5), 0 1px 2px rgba(0,0,0,0.1)'
        }}
      />
      <span className="text-sm text-gray-700">{folder.name}</span>
    </div>
  ))} 