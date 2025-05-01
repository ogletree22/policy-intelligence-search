/**
 * Kendra Search API utilities
 */

const API_ENDPOINT = 'https://gbgi989gbe.execute-api.us-west-2.amazonaws.com/sbx/search';
const INDEX_ID = 'ac2e614a-1a60-4788-921f-439355c5756d';

/**
 * Search Kendra with optional jurisdiction filter and document type filter
 * @param {string} query - Search query
 * @param {string} [jurisdiction] - Optional jurisdiction to filter by
 * @param {string} [documentType] - Optional document type (_category) to filter by
 * @param {boolean} [fetchFacets] - Whether to fetch facet counts instead of search results
 * @param {boolean} [suppressErrors] - Whether to suppress error messages (default: false)
 * @returns {Promise<Object>} - Search results or facet counts
 */
export const searchKendra = async (query = '', jurisdiction = null, documentType = null, fetchFacets = false, suppressErrors = false) => {
  try {
    // Trim inputs but preserve the leading space in " Source Report"
    const trimmedQuery = query?.trim() || '';
    const trimmedJurisdiction = jurisdiction?.trim() || null;
    
    // Special handling for document type - don't trim " Source Report"
    let processedDocType = null;
    if (documentType === " Source Report") {
      // Keep the leading space for Source Report
      processedDocType = " Source Report";
      console.log("Preserving leading space in Source Report filter");
    } else {
      // For other document types, trim as usual
      processedDocType = documentType?.trim() || null;
    }
    
    // Create the base request using proper Kendra API structure
    const requestBody = {
      // Return to previous wildcard format since that works with the Lambda
      QueryText: trimmedQuery ? `*${trimmedQuery}*` : '*',
      IndexId: INDEX_ID,
      PageSize: 100
    };

    // Handle facet retrieval with proper Facets structure
    if (fetchFacets) {
      console.log("Requesting facet summary");
      
      // Add facetSummary flag - this is what the Lambda expects
      requestBody.facetSummary = true;
      
      // Add jurisdiction filter if specified - use Lambda parameter style
      if (trimmedJurisdiction) {
        requestBody.jurisdiction = trimmedJurisdiction;
        console.log(`Adding jurisdiction filter to facet request: "${trimmedJurisdiction}"`);
      }

      // Add document type filter if specified - use Lambda parameter style
      if (processedDocType) {
        requestBody._category = processedDocType;
        console.log(`Adding document type filter to facet request: "${processedDocType}"`);
      }
    } else {
      // For regular search results (not facets), we use the Lambda-friendly format
      
      // Add jurisdiction filter if specified
      if (trimmedJurisdiction) {
        requestBody.jurisdiction = trimmedJurisdiction;
        console.log(`Adding jurisdiction filter: "${trimmedJurisdiction}"`);
      }

      // Add document type filter if specified
      if (processedDocType) {
        requestBody._category = processedDocType;
        console.log(`Adding document type filter (_category): "${processedDocType}"`);
      }
    }

    // Log complete request for monitoring
    console.log('Making Kendra request:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    console.log('Response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      // If suppressErrors is true, don't throw and just return empty results
      if (suppressErrors) {
        console.log('Suppressing API error and returning empty results');
        if (fetchFacets) {
          return { 
            facets: {
              documentTypes: {},
              jurisdictions: {}
            }
          };
        } else {
          return {
            results: [],
            totalAvailable: 0
          };
        }
      }
      throw new Error(`Error from Kendra API: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    
    // Log the raw response for debugging
    console.log('Raw Kendra response:', JSON.stringify(data, null, 2).substring(0, 1000) + '...');
    
    // If we requested facets, return them
    if (fetchFacets) {
      console.log("Received facet data response");
      
      // Transform facets into a more usable format
      const docTypeCounts = {};
      const jurisdictionCounts = {};
      
      // Jurisdiction mapping from API values to UI values
      const jurisdictionMapping = {
        'New Mexico': 'New_Mexico',
        'South Coast AQMD': 'South_Coast_AQMD',
        'Bay Area AQMD': 'Bay_Area_AQMD',
        'Sacramento AQMD': 'Sacramento_AQMD',
        // Add direct mappings for non-spaced jurisdictions
        'Colorado': 'Colorado',
        'Texas': 'Texas',
        'Washington': 'Washington',
        'Arizona': 'Arizona',
        'New York': 'New_York'
      };
      
      // Define our primary jurisdictions (UI values)
      const primaryJurisdictions = [
        'Colorado',
        'Texas',
        'New Mexico',
        'Washington',
        'South Coast AQMD',
        'Bay Area AQMD',
        'Arizona',
        'New York',
        'Sacramento AQMD'
      ];
      
      // Check if facets are in an expected format
      if (Array.isArray(data)) {
        console.log("Processing facet data from array format");
        data.forEach(facet => {
          // Process document type counts
          if (facet.DocumentAttributeKey === '_category' && 
              Array.isArray(facet.DocumentAttributeValueCountPairs)) {
            facet.DocumentAttributeValueCountPairs.forEach(pair => {
              if (pair.DocumentAttributeValue && pair.DocumentAttributeValue.StringValue) {
                docTypeCounts[pair.DocumentAttributeValue.StringValue] = pair.Count;
              }
            });
            console.log("Document type counts:", docTypeCounts);
          } 
          // Process jurisdiction counts
          else if (facet.DocumentAttributeKey === 'jurisdiction' && 
                   Array.isArray(facet.DocumentAttributeValueCountPairs)) {
            // Log the raw values for debugging
            console.log("Raw jurisdiction values:", 
              facet.DocumentAttributeValueCountPairs.map(p => ({
                name: p.DocumentAttributeValue?.StringValue,
                count: p.Count
              }))
            );
            
            // Map API jurisdiction values to UI jurisdiction values
            facet.DocumentAttributeValueCountPairs.forEach(pair => {
              if (pair.DocumentAttributeValue && 
                  pair.DocumentAttributeValue.StringValue) {
                const apiJurisdiction = pair.DocumentAttributeValue.StringValue;
                const count = pair.Count;
                
                // Map the API jurisdiction value to our UI label
                const uiJurisdiction = jurisdictionMapping[apiJurisdiction] || apiJurisdiction;
                
                // If already have a count for this jurisdiction, add to it
                jurisdictionCounts[uiJurisdiction] = (jurisdictionCounts[uiJurisdiction] || 0) + count;
              }
            });
            
            // Log the final jurisdiction counts
            console.log("Processed jurisdiction counts:", jurisdictionCounts);
            
            // Set zero counts for jurisdictions with no results instead of warning
            primaryJurisdictions.forEach(jurisdiction => {
              if (!jurisdictionCounts[jurisdiction]) {
                jurisdictionCounts[jurisdiction] = 0;
              }
              console.log(`${jurisdiction}: ${jurisdictionCounts[jurisdiction]}`);
            });
          }
        });
      } else {
        console.warn("Facet data isn't in expected array format:", data);
      }
      
      // Return the processed facet data
      console.log("Returning processed facet data with counts:", {
        documentTypes: Object.keys(docTypeCounts).length,
        jurisdictions: Object.keys(jurisdictionCounts).length
      });
      
      return { 
        facets: {
          documentTypes: docTypeCounts,
          jurisdictions: jurisdictionCounts
        }
      };
    }
    
    // For search results, ensure we have an array of results
    let resultsArray;
    if (Array.isArray(data)) {
      resultsArray = data;
    } else if (data.ResultItems && Array.isArray(data.ResultItems)) {
      resultsArray = data.ResultItems;
    } else if (data.results && Array.isArray(data.results)) {
      resultsArray = data.results;
    } else {
      console.error('Unexpected response format:', data);
      resultsArray = [];
    }
    
    const totalAvailable = data.TotalNumberOfResults || data.TotalResultCount || resultsArray.length || 0;
    
    console.log(`Received ${resultsArray.length} results${trimmedJurisdiction ? ' for ' + trimmedJurisdiction : ''}${processedDocType ? ' with document type "' + processedDocType + '"' : ''}, Total available: ${totalAvailable}`);
    
    return {
      results: resultsArray,
      totalAvailable: totalAvailable
    };
  } catch (error) {
    console.error('Error searching Kendra:', error.message);
    // If suppressErrors is true, return empty results instead of throwing
    if (suppressErrors) {
      console.log('Suppressing error and returning empty results');
      if (fetchFacets) {
        return { 
          facets: {
            documentTypes: {},
            jurisdictions: {}
          }
        };
      } else {
        return {
          results: [],
          totalAvailable: 0
        };
      }
    }
    throw error;
  }
};

/**
 * Normalize a document type string to match our expected categories
 * @param {string} type - The raw document type 
 * @returns {string} - A normalized document type that matches our filter categories
 */
export function normalizeDocumentType(type) {
  if (!type || type === 'Unknown') return 'Unknown';
  
  // Make sure to trim the input
  const typeStr = String(type).toLowerCase();
  const trimmedType = typeStr.trim();
  
  // Exact matches to Kendra document types
  if (trimmedType === 'regulation') return 'Regulation';
  if (trimmedType === 'source report') return ' Source Report'; // Return with leading space for Kendra
  if (typeStr === ' source report') return ' Source Report'; // Match with leading space preserved
  if (trimmedType === 'compliance document') return 'Compliance Document';
  if (trimmedType === 'guidance-policy') return 'Guidance-Policy';
  if (trimmedType === 'form-template') return 'Form-Template';
  if (trimmedType === 'state implementation plan') return 'State Implementation Plan';
  if (trimmedType === 'protocol') return 'Protocol';
  if (trimmedType === 'general info item') return 'General Info Item';
  if (trimmedType === 'legislation') return 'Legislation';
  
  // Partial matches for better categorization
  if (trimmedType.includes('regul') || trimmedType.includes('rule')) return 'Regulation';
  if (trimmedType.includes('source') && trimmedType.includes('report')) return ' Source Report'; // Return with leading space
  if (trimmedType.includes('compliance')) return 'Compliance Document';
  if (trimmedType.includes('guid') || trimmedType.includes('policy')) return 'Guidance-Policy';
  if (trimmedType.includes('form') || trimmedType.includes('template') || trimmedType.includes('application')) return 'Form-Template';
  if (trimmedType.includes('plan') && trimmedType.includes('implementation')) return 'State Implementation Plan';
  if (trimmedType.includes('protocol')) return 'Protocol';
  if (trimmedType.includes('info') || trimmedType.includes('general')) return 'General Info Item';
  if (trimmedType.includes('law') || trimmedType.includes('legislation')) return 'Legislation';
  
  // Default to Unknown if no match
  return 'Unknown';
}

// Add a debug function to log document type details
function logDocTypeDetails(docType) {
  if (!docType) return;
  console.log('Document type details:');
  console.log(`- Original: "${docType}"`);
  console.log(`- Trimmed: "${docType.trim()}"`);
  console.log(`- Length: ${docType.length}`);
  console.log(`- Char codes:`, Array.from(docType).map(c => c.charCodeAt(0)));
  console.log(`- Normalized: "${normalizeDocumentType(docType)}"`);
}

/**
 * Transform Kendra results into a standardized format for the frontend
 * @param {Array} kendraResponse - The raw Kendra response or results array
 * @returns {Array} - Standardized document objects
 */
export const transformKendraResults = (kendraResponse) => {
  if (!kendraResponse || !Array.isArray(kendraResponse)) {
    console.warn('Invalid Kendra response format:', kendraResponse);
    return [];
  }
  
  const resultItems = kendraResponse;
  
  // Log detailed information about the first result
  if (resultItems.length > 0) {
    console.log('Sample Kendra result structure:', JSON.stringify(resultItems[0]).substring(0, 1000) + '...');
    console.log('Document Attributes:', resultItems[0].DocumentAttributes);
  }
  
  return resultItems.map((item, index) => {
    // For debugging, log every 5th item to avoid console flood
    const shouldLog = index % 5 === 0 || index === 0;
    if (shouldLog) {
      console.log(`\nProcessing document ${index}: ${item.DocumentTitle || 'Untitled'}`);
    }
    
    // Extract document type if available - check all possible locations
    let documentType = null;
    let typeSource = 'unknown';
    
    // Check for DocumentAttributes array - prioritize _category as that's what the Lambda uses
    if (Array.isArray(item.DocumentAttributes)) {
      // First look specifically for _category
      const categoryAttr = item.DocumentAttributes.find(attr => attr.Key === '_category');
      if (categoryAttr && categoryAttr.Value && categoryAttr.Value.StringValue) {
        documentType = categoryAttr.Value.StringValue;
        typeSource = '_category attribute';
      } 
      
      if (shouldLog) {
        console.log(`Document Attributes:`, item.DocumentAttributes.map(attr => `${attr.Key}: ${JSON.stringify(attr.Value)}`));
      }
    }
    
    // If we didn't find a document type, check alternative fields
    if (!documentType) {
      if (item.Type) { 
        documentType = item.Type;
        typeSource = 'Type field';
      } else if (item.DocumentType) {
        documentType = item.DocumentType;
        typeSource = 'DocumentType field';
      } else if (item._source && item._source._category) {
        documentType = item._source._category;
        typeSource = '_source._category field';
      }
    }
    
    // If we still don't have a type, try to infer from title
    if (!documentType) {
      const title = item.DocumentTitle || item.Title || '';
      if (title.includes('Regulation') || title.includes('Rule')) {
        documentType = 'Regulation';
        typeSource = 'Inferred from title';
      } else if (title.includes('Report')) {
        documentType = ' Source Report';
        typeSource = 'Inferred from title';
      } else if (title.includes('Guidance') || title.includes('Policy')) {
        documentType = 'Guidance-Policy';
        typeSource = 'Inferred from title';
      } else if (title.includes('Form') || title.includes('Template')) {
        documentType = 'Form-Template';
        typeSource = 'Inferred from title';
      } else if (title.includes('Plan')) {
        documentType = 'State Implementation Plan';
        typeSource = 'Inferred from title';
      } else if (title.includes('Protocol')) {
        documentType = 'Protocol';
        typeSource = 'Inferred from title';
      } else if (title.includes('Law') || title.includes('Legislation')) {
        documentType = 'Legislation';
        typeSource = 'Inferred from title';
      } else if (title.includes('Compliance')) {
        documentType = 'Compliance Document';
        typeSource = 'Inferred from title';
      }
    }
    
    // If no type was found, set to unknown
    if (!documentType) {
      documentType = 'Unknown';
      typeSource = 'Default value';
    }
    
    if (shouldLog) {
      console.log(`Extracted document type: "${documentType}" (Source: ${typeSource})`);
    }
    
    // Extract the URL
    let documentUrl = '';

    // First check for _source_uri in DocumentAttributes as this seems to be the most reliable
    if (Array.isArray(item.DocumentAttributes)) {
      const sourceUriAttr = item.DocumentAttributes.find(attr => attr.Key === '_source_uri');
      if (sourceUriAttr && sourceUriAttr.Value && sourceUriAttr.Value.StringValue) {
        documentUrl = sourceUriAttr.Value.StringValue;
        if (shouldLog) {
          console.log(`URL found in _source_uri attribute: ${documentUrl}`);
        }
      }
    }

    // Fall back to other fields if we didn't find a URL in DocumentAttributes
    if (!documentUrl) {
      if (item.DocumentURI) {
        documentUrl = item.DocumentURI;
        if (shouldLog) console.log(`Using DocumentURI: ${documentUrl}`);
      } else if (item.SourceURI) {
        documentUrl = item.SourceURI;
        if (shouldLog) console.log(`Using SourceURI: ${documentUrl}`);
      } else if (item.DocumentId && item.DocumentId.startsWith('http')) {
        documentUrl = item.DocumentId;
        if (shouldLog) console.log(`Using DocumentId as URL: ${documentUrl}`);
      } else if (item.S3Path) {
        documentUrl = item.S3Path;
        if (shouldLog) console.log(`Using S3Path: ${documentUrl}`);
      } else if (item.Url) {
        documentUrl = item.Url;
        if (shouldLog) console.log(`Using Url field: ${documentUrl}`);
      }
    }
    
    // Check if we found a URL
    if (!documentUrl && shouldLog) {
      console.log('No URL found in document. Available fields:', Object.keys(item));
      console.log('Document ID:', item.DocumentId);
    }

    // If we have a SourceUri directly in the item (comes from Lambda)
    if (!documentUrl && item.SourceUri) {
      documentUrl = item.SourceUri;
      if (shouldLog) console.log(`Using root SourceUri: ${documentUrl}`);
    }

    // Debug the URL
    if (shouldLog) {
      console.log(`Final URL for document: ${documentUrl || 'None found'}`);
    }
    
    // Extract document excerpt/description
    let description = '';
    if (item.DocumentExcerpt && item.DocumentExcerpt.Text) {
      description = item.DocumentExcerpt.Text;
    } else if (item.Excerpt) {
      description = typeof item.Excerpt === 'string' ? item.Excerpt : item.Excerpt.Text || '';
    } else if (item.ExcerptText) {
      description = item.ExcerptText;
    } else if (item.Description) {
      description = item.Description;
    } else if (item.Summary) {
      description = item.Summary;
    }
    
    // If still no description, try to extract it from _source._excerpt or similar fields
    if (!description && item._source && item._source._excerpt) {
      description = item._source._excerpt;
    }
    
    // Create and return the standardized document object
    return {
      id: item.Id || item.DocumentId || `doc-${Math.random().toString(36).substring(2, 15)}`,
      title: item.DocumentTitle || item.Title || 'Untitled Document',
      url: documentUrl || item.SourceUri || '',  // Ensure SourceUri is used for URL
      description: description,
      type: documentType,
      jurisdiction: getJurisdictionFromResponse(item), // Add jurisdiction field
      source: item.UpdatedAt || item.CreatedAt || new Date().toISOString()
    };
  });
};

/**
 * Helper function to extract jurisdiction from Lambda response
 */
function getJurisdictionFromResponse(item) {
  // First check DocumentAttributes for jurisdiction
  if (Array.isArray(item.DocumentAttributes)) {
    const jurisdictionAttr = item.DocumentAttributes.find(
      attr => attr.Key === 'jurisdiction' || attr.Key === 'jurisdiction_name'
    );
    if (jurisdictionAttr?.Value?.StringValue) {
      return jurisdictionAttr.Value.StringValue;
    }
  }

  const title = item.DocumentTitle || '';
  const uri = item.SourceUri || '';
  const documentId = item.DocumentId || '';
  
  // Many California districts have their name in the document title with pattern:
  // [District Name] - [Section]: [Title] - [SubSection]: [Details]
  if (title.includes(' - ')) {
    const districtPart = title.split(' - ')[0].trim();
    
    // Check for California air districts in the title
    const californiaAirDistricts = [
      'Amador APCD',
      'Antelope Valley AQMD',
      'Bay Area AQMD',
      'Butte County AQMD',
      'Calaveras County APCD',
      'Colusa County APCD',
      'Eastern Kern APCD',
      'El Dorado County AQMD',
      'Feather River AQMD',
      'Glenn County APCD',
      'Great Basin Unified APCD',
      'Imperial County APCD',
      'Lake County AQMD',
      'Lassen County APCD',
      'Mariposa County APCD',
      'Mendocino County AQMD',
      'Modoc County APCD',
      'Mojave Desert AQMD',
      'Monterey Bay Unified APCD',
      'North Coast Unified AQMD',
      'Northern Sierra AQMD',
      'Northern Sonoma County APCD',
      'Placer County APCD',
      'Sacramento Metropolitan AQMD',
      'San Diego County APCD',
      'San Joaquin Valley APCD',
      'San Luis Obispo County APCD',
      'Santa Barbara County APCD',
      'Shasta County AQMD',
      'Siskiyou County APCD',
      'South Coast AQMD',
      'Tehama County APCD',
      'Tuolumne County APCD',
      'Ventura County AQMD',
      'Yolo-Solano AQMD'
    ];
    
    // Check if the district part is a known California air district
    for (const district of californiaAirDistricts) {
      if (districtPart === district) {
        return district.replace(/ /g, '_'); // Convert spaces to underscores for UI
      }
    }
  }
  
  // Also check the DocumentId path - many documents have the jurisdiction in the S3 path
  if (documentId.includes('s3://') && documentId.includes('/California/')) {
    const parts = documentId.split('/');
    const californiaIndex = parts.findIndex(part => part === 'California');
    
    if (californiaIndex >= 0 && californiaIndex + 1 < parts.length) {
      const districtPart = parts[californiaIndex + 1];
      // Check if this is an air district path
      if (districtPart.includes('APCD') || districtPart.includes('AQMD')) {
        // Convert the S3 path format to our internal format
        return districtPart.replace(/%20/g, '_');
      }
    }
  }
  
  // Check for specific California APCDs/AQMDs
  if (title.includes('Santa Barbara County APCD') || uri.includes('santabarbara') || uri.includes('sbcapcd')) {
    return 'Santa_Barbara_County_APCD';
  }
  if (title.includes('San Joaquin Valley APCD') || uri.includes('valleyair')) {
    return 'San_Joaquin_Valley_APCD';
  }
  if (title.includes('South Coast AQMD') || title.includes('SCAQMD') || uri.includes('aqmd.gov')) {
    return 'South_Coast_AQMD';
  }
  if (title.includes('Bay Area AQMD') || title.includes('BAAQMD') || uri.includes('baaqmd')) {
    return 'Bay_Area_AQMD';
  }
  if (title.includes('Tehama County APCD')) {
    return 'Tehama_County_APCD';
  }
  if (title.includes('Great Basin Unified APCD')) {
    return 'Great_Basin_Unified_APCD';
  }
  if (title.includes('Shasta County AQMD')) {
    return 'Shasta_County_AQMD';
  }
  if (title.includes('Colusa County APCD')) {
    return 'Colusa_County_APCD';
  }
  if (title.includes('Eastern Kern APCD')) {
    return 'Eastern_Kern_APCD';
  }

  // Check for state jurisdictions
  if (title.startsWith('Kentucky') || uri.includes('kentucky.gov') || uri.includes('/ky/')) {
    return 'Kentucky';
  }
  if (title.startsWith('Colorado') || uri.includes('colorado.gov') || uri.includes('/co/')) {
    return 'Colorado';
  }
  if (title.startsWith('Texas') || uri.includes('texas.gov') || uri.includes('/tx/')) {
    return 'Texas';
  }
  if (title.startsWith('New Mexico') || uri.includes('newmexico.gov') || uri.includes('/nm/')) {
    return 'New_Mexico';
  }
  if (title.startsWith('Washington') || uri.includes('washington.gov') || uri.includes('/wa/')) {
    return 'Washington';
  }

  // Check for state codes in the title
  if (title.includes(' - ')) {
    const stateCode = title.split(' - ')[0].trim();
    const stateMapping = {
      'KY': 'Kentucky',
      'CO': 'Colorado',
      'TX': 'Texas',
      'NM': 'New_Mexico',
      'WA': 'Washington'
    };
    if (stateMapping[stateCode]) {
      return stateMapping[stateCode];
    }
  }

  // If no clear jurisdiction is found, check the content
  const content = [title, uri, item.ExcerptText || ''].join(' ').toLowerCase();
  if (content.includes('kentucky')) return 'Kentucky';
  if (content.includes('colorado')) return 'Colorado';
  if (content.includes('texas')) return 'Texas';
  if (content.includes('new mexico')) return 'New_Mexico';
  if (content.includes('washington')) return 'Washington';

  // If still no match, return Unknown instead of defaulting to Colorado
  return 'Unknown';
} 