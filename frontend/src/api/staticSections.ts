// Static sections data - generated from API response
// This allows the site to work without API calls
export const staticSectionsData = null; // Will be populated by build script

export async function getStaticSections() {
  // Try to load from static JSON file first
  try {
    const response = await fetch('/data/sections.json');
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (e) {
    console.log('Static data not available, using fallback');
  }
  
  // Fallback to empty array
  return [];
}
