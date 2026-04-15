export interface ApiSection {
  id: string;
  sectionName: string;
  sectionType: string;
  sortOrder: number;
  items: ApiItem[];
}

export interface ApiItem {
  id: string;
  name: string;
  thumbnailUrl: string;
  iconUrl?: string;
  sortOrder: number;
  type: string;
  categoryId?: string;
  categoryName?: string;
  chapterId?: string;
  chapterName?: string;
  videoId?: string;
  videoName?: string;
  videoThumbnailUrl?: string;
  videoUrl?: string;
  videoDuration?: number;
  categoryThumbnailUrl?: string;
  userDuration?: number;
  completed?: boolean;
}

export const fetchSections = async (): Promise<ApiSection[]> => {
  try {
    // Load from static JSON file
    const response = await fetch('/data/sections.json');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error('Failed to fetch sections:', error);
    return [];
  }
};
