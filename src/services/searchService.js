// Import mock data
import mockDataCO2 from '../mockDataCO2.js';
import mockDataNM from '../mockDataNM';
import mockDataSCAQMD from '../mockDataSCAQMD.js';
import mockDataBAAD from '../mockDataBAAD';
import mockDataTX from '../mockDataTX';
import mockDataWA from '../mockDataWA';
import mockDataUT from '../mockDataUT';

// Combine all mock data
const MOCK_DOCUMENTS = [
  ...mockDataCO2,
  ...mockDataNM,
  ...mockDataSCAQMD,
  ...mockDataBAAD,
  ...mockDataTX,
  ...mockDataWA,
  ...mockDataUT
];

export const searchDocuments = async (query, filters = {}) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));

  try {
    let results = [...MOCK_DOCUMENTS];

    // Apply search query filter
    if (query) {
      const searchTerms = query.toLowerCase().split(' ');
      results = results.filter(doc => 
        searchTerms.some(term => 
          doc.title?.toLowerCase().includes(term) || 
          doc.description?.toLowerCase().includes(term)
        )
      );
    }

    // Apply jurisdiction filter
    if (filters.jurisdiction && filters.jurisdiction.length > 0) {
      results = results.filter(doc => 
        filters.jurisdiction.includes(doc.jurisdiction)
      );
    }

    // Apply document type filter
    if (filters.documentType && filters.documentType.length > 0) {
      results = results.filter(doc => 
        filters.documentType.includes(doc.documentType)
      );
    }

    // Apply date range filter if implemented
    if (filters.dateRange) {
      // TODO: Implement date range filtering
    }

    return results;
  } catch (error) {
    console.error('Error searching documents:', error);
    throw new Error('Failed to search documents. Please try again.');
  }
}; 