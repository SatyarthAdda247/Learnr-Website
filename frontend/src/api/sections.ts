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
    const url = '/content-ws/app/sections?pageNo=0&pageSize=20&src=and';
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Auth-Token': 'fpoa43edty5',
        'x-oi': '2',
        'X-JWT-Token': 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZGRhLnYxLmQ1MjkyM2I2ZWYxNWYwZmI5NTVhNDA3MWYwMTYyZTU1IiwiYXVkIjoiNTA5MDg4NyIsImlhdCI6MTc3NTIwNzQ3MCwiaXNzIjoiYWRkYTI0Ny5jb20iLCJwaG9uZSI6Ijg2MDEwNjM1NjkiLCJ1c2VySWQiOiJhZGRhLnYxLmQ1MjkyM2I2ZWYxNWYwZmI5NTVhNDA3MWYwMTYyZTU1IiwibG9naW5BcGlWZXJzaW9uIjoyLCJlbmMiOnRydWV9.EYKqKg3w9nTtPJZQoWJTFnK3bn3Fk6jcPdvZFZo_XNmItUTZcrzd_R0jaM5-d9cShazF-ToleGUL_nFOcj9cSw',
        'jwt-token': 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZGRhLnYxLmQ1MjkyM2I2ZWYxNWYwZmI5NTVhNDA3MWYwMTYyZTU1IiwiYXVkIjoiNTA5MDg4NyIsImlhdCI6MTc3NTIwNzQ3MCwiaXNzIjoiYWRkYTI0Ny5jb20iLCJwaG9uZSI6Ijg2MDEwNjM1NjkiLCJ1c2VySWQiOiJhZGRhLnYxLmQ1MjkyM2I2ZWYxNWYwZmI5NTVhNDA3MWYwMTYyZTU1IiwibG9naW5BcGlWZXJzaW9uIjoyLCJlbmMiOnRydWV9.EYKqKg3w9nTtPJZQoWJTFnK3bn3Fk6jcPdvZFZo_XNmItUTZcrzd_R0jaM5-d9cShazF-ToleGUL_nFOcj9cSw',
        'AND_APP_VERSION': '30',
        'cp-origin': '1',
        'AND_APP_VERSION_NAME': '1.2.0',
        'sid': '6176c75ba4746167',
        'Api-Key': '5072ae3aab918de11a4e95c183999076c1936c107c6128bcd1970062fadf4ed9',
        'Content-Type': 'application/json',
        'Api-Username': '5090887',
        'business-name': 'AddaSocial',
        'service-name': 'AddaSocial',
        'client-name': 'androidapp',
        'User-Agent': 'androidapp',
        'dName': 'POCO M2007J20CI',
        'dID': '6176c75ba4746167'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data?.content || [];
  } catch (error) {
    console.error('Failed to fetch sections:', error);
    return [];
  }
};
