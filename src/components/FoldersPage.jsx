import React from 'react';
import { Link } from 'react-router-dom';
import { FaFolder, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import './FoldersPage.css';

const FoldersPage = () => {
  const folders = [
    { 
      id: 1, 
      name: 'HDV NOx research', 
      count: 3,
      documents: [
        'Colorado - Regulation Number 20 - Colorado Low Emission Automobile Regulation',
        'Colorado - Regulation Number 12 - Reduction of Diesel Vehicle Emissions',
        'Colorado - Regulation Number 11 - Motor Vehicle Emissions Inspection Program'
      ]
    },
    { 
      id: 2, 
      name: 'Air toxics', 
      count: 5,
      documents: [
        'Washington - Chapter 173-460 WAC - Controls for new sources of toxic air pollutants',
        'Illinois - Part 232 - Toxic Air Contaminants',
        'Ventura County APCD - 2 Permits - 17: Disclosure of Air Toxics Information',
        'South Coast AQMD - 14: Toxics And Other New Criteria Pollutants',
        'California (SCAQMD) - Rule 307 - Fees for Air Toxics Emissions Inventory'
      ]
    },
    { 
      id: 3, 
      name: 'Minor source modeling', 
      count: 4,
      documents: [
        'Colorado - Air quality modeling guidance for permits - Permitting Atypical',
        'Colorado - Air quality modeling guidance for permits - Colorado Minor NSR',
        'Colorado - Air quality modeling guidance for permits - Colorado Modeling',
        'Colorado - Air permitting guidance memos - Memo 98-03'
      ]
    },
    { 
      id: 4, 
      name: 'Small engine permitting', 
      count: 3,
      documents: [
        'Colorado - Small Engine Regulations',
        'Colorado - Air Permitting for Small Sources',
        'San Diego County APCD - Rule 12: Small Engine Permits'
      ]
    }
  ];

  return (
    <div className="folders-container">
      <div className="folders-list">
        {folders.map((folder) => (
          <div key={folder.id} className="folder-list-item">
            <div className="folder-header">
              <div className="folder-title-section">
                <FaFolder className="folder-icon" />
                <h3>{folder.name}</h3>
                <span className="document-count">{folder.count} of {folder.count} documents</span>
              </div>
              <div className="folder-actions">
                <FaArrowUp className="action-icon" />
                <FaArrowDown className="action-icon" />
              </div>
            </div>
            <div className="folder-documents">
              {folder.documents.map((doc, index) => (
                <Link key={index} to="#" className="document-link">
                  {doc}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoldersPage; 