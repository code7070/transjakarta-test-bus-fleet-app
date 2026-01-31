import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

const fetchGeocode = async (
  lat: number,
  lon: number,
): Promise<string | null> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
      {
        headers: {
          "User-Agent": "TransjakartaFleetApp/1.0",
          "Accept-Language": "id",
        },
      },
    );

    if (response.ok) {
      const data = await response.json();
      const addr = data.address;
      const road =
        addr.road || addr.pedestrian || addr.suburb || addr.village || "";
      const city = addr.city || addr.town || addr.county || "";

      return road ? `${road}, ${city}` : data.display_name.split(",")[0];
    }
    throw new Error(
      `Reverse geocoding failed: ${response.status} ${response.statusText}`,
    );
  } catch (error) {
    console.warn("Reverse geocoding failed", error);
    throw error;
  }
};

export const useReverseGeocoding = (lat: number, lon: number) => {
  const [debouncedCoords, setDebouncedCoords] = useState({ lat, lon });

  // Debounce coordinates to avoid rate limiting
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedCoords({ lat, lon });
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [lat, lon]);

  const key = `${debouncedCoords.lat.toFixed(4)},${debouncedCoords.lon.toFixed(4)}`;

  const {
    data: address,
    isLoading: loading,
    failureCount,
  } = useQuery({
    queryKey: ["geocode", key],
    queryFn: () => fetchGeocode(debouncedCoords.lat, debouncedCoords.lon),
    enabled: !!(debouncedCoords.lat && debouncedCoords.lon),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours - geocoding rarely changes
    gcTime: 24 * 60 * 60 * 1000,
    retry: 7,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff
  });

  return { address: address || null, loading, failureCount };
};
