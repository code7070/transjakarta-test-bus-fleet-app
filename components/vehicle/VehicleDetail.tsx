import React, { Suspense, lazy } from "react";
import { Vehicle } from "../../types";
import {
  formatRelativeTime,
  formatCoordinate,
  formatStatus,
} from "../../services/utils/formatters";
import { StatusBadge } from "./StatusBadge";
import { useReverseGeocoding } from "../../hooks/useReverseGeocoding";
import {
  Bus,
  MapPin,
  Clock,
  Navigation,
  GitFork,
  Gauge,
  Users,
  ExternalLink,
  Loader2,
  ArrowRight,
} from "lucide-react";

// Lazy load the map component
const VehicleMap = lazy(() => import("./VehicleMap"));

interface VehicleDetailProps {
  vehicle: Vehicle;
}

export const VehicleDetail: React.FC<VehicleDetailProps> = ({ vehicle }) => {
  const { attributes, relationships } = vehicle;
  const { address, loading: addrLoading } = useReverseGeocoding(
    attributes.latitude,
    attributes.longitude,
  );

  return (
    <div className="flex flex-col h-full bg-gray-50/50">
      {/* Sticky Header Section - Clean & Minimal */}
      <div className="sticky top-0 z-50 bg-surface/95 backdrop-blur-md px-6 py-4 border-b border-muted/20 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-primary rounded-xl text-white shadow-lg shadow-primary/20">
            <Bus className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-foreground tracking-tight leading-none">
                {attributes.label}
              </h2>
              <span className="font-mono font-bold text-foreground bg-gray-100 border border-muted/20 px-2 py-0.5 rounded text-sm shadow-sm">
                {vehicle.id}
              </span>
            </div>
            {/* <p className="text-xs text-muted font-medium mt-1">
              Transjakarta Fleet Unit
            </p> */}
            <div className="text-[11px] flex items-center gap-0.5 text-muted mt-1">
              <Clock className="w-3 h-3" />
              {formatRelativeTime(attributes.updated_at)}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6 overflow-y-auto">
        {/* Map Section */}
        <div className="bg-surface rounded-2xl border border-muted/20 overflow-hidden shadow-sm ring-1 ring-black/5">
          <div className="h-64 w-full relative">
            <Suspense
              fallback={
                <div className="h-full w-full flex flex-col items-center justify-center bg-gray-50 text-muted">
                  <Loader2 className="w-8 h-8 animate-spin mb-2 text-primary" />
                  <span className="text-sm font-medium">Memuat Peta...</span>
                </div>
              }
            >
              <VehicleMap
                latitude={attributes.latitude}
                longitude={attributes.longitude}
                label={attributes.label}
                bearing={attributes.bearing}
              />
            </Suspense>
          </div>

          <div className="px-4 py-3 bg-white flex justify-between items-center border-t border-muted/10 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-muted font-medium">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="line-clamp-1 max-w-[250px] sm:max-w-md text-gray-900 font-medium">
                  {addrLoading ? (
                    <span className="animate-pulse text-muted">
                      Loading location...
                    </span>
                  ) : (
                    address ||
                    `${formatCoordinate(attributes.latitude)}, ${formatCoordinate(attributes.longitude)}`
                  )}
                </span>
              </div>
              {address && (
                <span className="hidden sm:inline font-mono text-[10px] opacity-70">
                  ({formatCoordinate(attributes.latitude)},{" "}
                  {formatCoordinate(attributes.longitude)})
                </span>
              )}
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${attributes.latitude},${attributes.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 font-semibold text-primary hover:underline shrink-0"
            >
              Open Maps <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Minimalist Journey Section - Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Destination Card with Status Integrated */}
          <div className="bg-white rounded-xl p-5 border border-muted/20 shadow-sm relative overflow-hidden group hover:border-primary/30 transition-all">
            {/* Subtle Ambient Background */}
            <div className="absolute top-0 right-0 -mt-2 -mr-2 w-16 h-16 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-all" />

            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-gray-100 rounded-md text-muted group-hover:text-primary transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-muted uppercase tracking-wider">
                  Destination
                </span>
              </div>
              <StatusBadge status={attributes.current_status} />
            </div>

            <div className="relative z-10">
              <h3 className="text-xl font-bold text-foreground leading-snug">
                {attributes.trip_headsign || "Unknown Destination"}
              </h3>
            </div>
          </div>

          {/* Route Card */}
          <div className="bg-white rounded-xl p-5 border border-muted/20 shadow-sm relative overflow-hidden group hover:border-accent/50 transition-all">
            <div className="absolute top-0 right-0 -mt-2 -mr-2 w-16 h-16 bg-accent/5 rounded-full blur-xl group-hover:bg-accent/10 transition-all" />

            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-gray-100 rounded-md text-muted group-hover:text-accent transition-colors">
                  <GitFork className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-muted uppercase tracking-wider">
                  Active Route
                </span>
              </div>
              {relationships?.route?.data?.id && (
                <span className="text-[10px] font-mono font-bold text-muted bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
                  {relationships.route.data.id}
                </span>
              )}
            </div>

            <div className="relative z-10">
              <h3 className="text-xl font-bold text-foreground leading-snug">
                {attributes.route_name || "N/A"}
              </h3>
            </div>
          </div>
        </div>

        {/* Technical Details Grid - Simplified */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Passenger Info */}
          <div className="bg-white rounded-xl p-5 border border-muted/20 shadow-sm flex flex-col h-full">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-muted/10">
              <Users className="w-4 h-4 text-muted" />
              <h3 className="text-xs font-bold text-muted uppercase tracking-wider">
                Passenger Load
              </h3>
            </div>

            <div className="flex-1 flex flex-col justify-center gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  Occupancy Status
                </span>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                    !attributes.occupancy_status
                      ? "bg-gray-100 text-muted border-gray-200"
                      : attributes.occupancy_status.includes("MANY")
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                        : attributes.occupancy_status.includes("FEW")
                          ? "bg-amber-50 text-amber-600 border-amber-100"
                          : "bg-red-50 text-red-600 border-red-100"
                  }`}
                >
                  {attributes.occupancy_status
                    ? formatStatus(attributes.occupancy_status)
                    : "Unknown"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  Trip ID
                </span>
                <span className="text-xs font-mono text-muted">
                  {relationships?.trip?.data?.id || "-"}
                </span>
              </div>
            </div>
          </div>

          {/* Telemetry */}
          <div className="bg-white rounded-xl p-5 border border-muted/20 shadow-sm flex flex-col h-full">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-muted/10">
              <Gauge className="w-4 h-4 text-muted" />
              <h3 className="text-xs font-bold text-muted uppercase tracking-wider">
                Telemetry
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-2 rounded-lg bg-gray-50 border border-muted/10">
                <div className="flex justify-center mb-1">
                  <Navigation
                    className="w-5 h-5 text-primary"
                    style={{ transform: `rotate(${attributes.bearing}deg)` }}
                  />
                </div>
                <div className="text-lg font-bold text-foreground">
                  {attributes.bearing}°
                </div>
                <div className="text-[10px] text-muted uppercase font-bold">
                  Bearing
                </div>
              </div>

              <div className="text-center p-2 rounded-lg bg-gray-50 border border-muted/10">
                <div className="flex justify-center mb-1">
                  <Gauge className="w-5 h-5 text-accent" />
                </div>
                <div className="text-lg font-bold text-foreground">
                  {attributes.speed !== null ? attributes.speed : "-"}
                </div>
                <div className="text-[10px] text-muted uppercase font-bold">
                  km/h
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-[10px] font-medium text-muted">
            <Clock className="w-3 h-3" />
            Updated {formatRelativeTime(attributes.updated_at)}
          </span>
        </div>
      </div>
    </div>
  );
};
