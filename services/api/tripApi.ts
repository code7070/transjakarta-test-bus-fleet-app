import { ApiResponse, Trip } from "../../types";

const API_BASE_URL = "https://api-v3.mbta.com";

export const tripApi = {
  async getTrips(
    offset: number = 0,
    limit: number = 20,
    routeIds: string[] = [],
    signal?: AbortSignal,
  ): Promise<ApiResponse<Trip[]>> {
    try {
      // Build query parameters
      const params = new URLSearchParams();

      // Filter by routes - required to avoid fetching all trips
      if (routeIds.length > 0) {
        params.append("filter[route]", routeIds.join(","));
      }

      // Add pagination
      params.append("page[offset]", offset.toString());
      params.append("page[limit]", limit.toString());

      const url = `${API_BASE_URL}/trips?${params.toString()}`;

      const response = await fetch(url, {
        signal,
        headers: {
          Accept: "application/vnd.api+json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw error;
      }
      console.error("Error fetching trips:", error);
      throw error;
    }
  },
};
