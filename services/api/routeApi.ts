import { ApiResponse, Route } from '../../types';

const API_BASE_URL = 'https://api-v3.mbta.com';

export const routeApi = {
  async getRoutes(pageOffset: number = 0, limit: number = 20): Promise<ApiResponse<Route[]>> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/routes?page[offset]=${pageOffset}&page[limit]=${limit}&sort=long_name`,
        {
          headers: {
            'Accept': 'application/vnd.api+json',
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching routes:', error);
      throw error;
    }
  }
};