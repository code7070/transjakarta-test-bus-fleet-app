import React, { memo } from "react";
import { Vehicle } from "../../types";
import {
  formatRelativeTime,
  formatCoordinate,
} from "../../services/utils/formatters";
import { MapPin, Clock, Navigation, Bus, Loader2, GitFork } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { useReverseGeocoding } from "../../hooks/useReverseGeocoding";

interface VehicleCardProps {
  vehicle: Vehicle;
  onClick?: () => void;
}

const VehicleCardComponent: React.FC<VehicleCardProps> = ({
  vehicle,
  onClick,
}) => {
  const { attributes } = vehicle;
  const {
    address,
    loading: addrLoading,
    failureCount,
  } = useReverseGeocoding(attributes.latitude, attributes.longitude);

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative w-full text-left bg-surface border border-muted/20 rounded-xl p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary/50"
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-colors duration-300" />

      {/* Header */}
      <div className="flex justify-between items-start mb-5 pl-3">
        <div className="flex flex-col">
          <h3 className="text-3xl font-bold text-foreground tracking-tight leading-none group-hover:text-primary transition-colors">
            {attributes.label}
          </h3>
          <div className="mt-2">
            <StatusBadge status={attributes.current_status} />
          </div>
        </div>
        <div className="p-3 bg-primary/5 rounded-2xl text-primary/80 group-hover:bg-primary/10 transition-colors">
          <Bus className="w-8 h-8" />
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-2 gap-4 pl-3">
        {/* Trip Info (Headsign) */}
        {attributes.trip_headsign && (
          <div className="col-span-2 pb-3 border-b border-muted/10 mb-1">
            <div className="flex items-center gap-2 text-muted mb-1">
              <GitFork className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Destination
              </span>
            </div>
            <span className="text-sm font-semibold text-foreground block truncate">
              {attributes.trip_headsign}
            </span>
          </div>
        )}

        {/* Location (Reverse Geo) */}
        <div className="col-span-2">
          <div className="flex items-start gap-2.5">
            <div className="mt-1 p-1 bg-gray-100 rounded-md">
              {failureCount > 0 && !address ? (
                <Loader2 className="w-3.5 h-3.5 text-primary shrink-0 animate-spin" />
              ) : (
                <MapPin className="w-3.5 h-3.5 text-muted shrink-0" />
              )}
            </div>
            <div className="flex flex-col min-h-[2.5rem] justify-center">
              <span className="text-[10px] font-bold uppercase text-muted tracking-wider">
                Current Location
              </span>
              <span className="text-sm font-medium text-foreground line-clamp-2 leading-snug">
                {addrLoading && failureCount === 0 ? (
                  <span className="flex items-center gap-1 text-muted">
                    <Loader2 className="w-3 h-3 animate-spin" /> Fetching
                    address...
                  </span>
                ) : (
                  address ||
                  `${formatCoordinate(attributes.latitude)}, ${formatCoordinate(attributes.longitude)}`
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Bearing */}
        <div className="col-span-2 border-t border-muted/10 pt-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted">
            <Navigation className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">
              {attributes.bearing}° Heading
            </span>
          </div>

          <div className="flex items-center gap-2 text-muted">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs font-medium text-primary">
              {formatRelativeTime(attributes.updated_at)}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
};

export const VehicleCard = memo(VehicleCardComponent, (prev, next) => {
  return (
    prev.vehicle.id === next.vehicle.id &&
    prev.vehicle.attributes.updated_at === next.vehicle.attributes.updated_at &&
    prev.vehicle.attributes.current_status ===
      next.vehicle.attributes.current_status &&
    prev.vehicle.attributes.latitude === next.vehicle.attributes.latitude &&
    prev.vehicle.attributes.longitude === next.vehicle.attributes.longitude &&
    prev.vehicle.attributes.trip_headsign ===
      next.vehicle.attributes.trip_headsign
  );
});
