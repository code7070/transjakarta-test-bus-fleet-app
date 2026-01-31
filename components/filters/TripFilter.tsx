import React, { useMemo } from "react";
import { MultiSelectDropdown, Option } from "./MultiSelectDropdown";
import { useTrips } from "../../hooks/useTrips";

interface TripFilterProps {
  selectedTrips: string[];
  selectedRoutes?: string[]; // Add route filtering capability
  onChange: (ids: string[]) => void;
}

export const TripFilter: React.FC<TripFilterProps> = ({
  selectedTrips,
  selectedRoutes,
  onChange,
}) => {
  // Pass selectedRoutes to useTrips to fetch relevant trips from API
  const { trips, loading, hasMore, loadMore } = useTrips(selectedRoutes);

  // Group trips by Headsign to avoid duplicates in the UI
  // Instead of using Trip ID, we use Headsign as the filter value
  const uniqueOptions = useMemo(() => {
    const seen = new Set();
    return trips.reduce<Option[]>((acc, trip) => {
      const headsign = trip.attributes.headsign;
      // Skip if no headsign or if we've already added this headsign
      if (!headsign || seen.has(headsign)) return acc;

      seen.add(headsign);
      acc.push({
        id: headsign, // We use the Headsign string as the ID for filtering
        label: headsign,
        subtitle: trip.attributes.direction_id === 0 ? "Outbound" : "Inbound",
      });
      return acc;
    }, []);
  }, [trips]);

  const isDisabled = !selectedRoutes || selectedRoutes.length === 0;

  return (
    <MultiSelectDropdown
      label="Destination" // Changed label from Trips to Destination as it's more accurate now
      placeholder={isDisabled ? "Select Route First" : "Search destinations..."}
      options={uniqueOptions}
      selectedIds={selectedTrips}
      onSelectionChange={onChange}
      onLoadMore={() => {}}
      hasMore={hasMore}
      loading={loading}
      disabled={isDisabled}
    />
  );
};
