import { ApiResponse, Vehicle } from "../../types";

const API_BASE_URL = "https://api-v3.mbta.com";

export const vehicleApi = {
  async getVehicles(): Promise<ApiResponse<Vehicle[]>> {
    try {
      // Include route and trip data in the response
      const response = await fetch(
        `${API_BASE_URL}/vehicles?page[limit]=100&include=route,trip`,
        {
          headers: {
            Accept: "application/vnd.api+json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();

      // Create lookup maps for included data (Trips and Routes)
      const included = json.included || [];
      const tripsMap = new Map<string, any>();
      const routesMap = new Map<string, any>();

      included.forEach((item: any) => {
        if (item.type === "trip") {
          tripsMap.set(item.id, item);
        }
        if (item.type === "route") {
          routesMap.set(item.id, item);
        }
      });

      // Enrich vehicle data by matching IDs with the lookup maps
      const enrichedData = json.data.map((vehicle: Vehicle) => {
        const tripId = vehicle.relationships?.trip?.data?.id;
        const routeId = vehicle.relationships?.route?.data?.id;

        const trip = tripId ? tripsMap.get(tripId) : null;
        const route = routeId ? routesMap.get(routeId) : null;

        return {
          ...vehicle,
          attributes: {
            ...vehicle.attributes,
            // Inject the mapped names directly into attributes for easier UI consumption
            trip_headsign: trip?.attributes?.headsign || null,
            route_name:
              route?.attributes?.long_name ||
              route?.attributes?.short_name ||
              null,
            // Map colors (default to standard branding if missing)
            route_color: route?.attributes?.color || "0066b2",
            route_text_color: route?.attributes?.text_color || "FFFFFF",
          },
        };
      });

      return { ...json, data: enrichedData };
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      throw error;
    }
  },
};
