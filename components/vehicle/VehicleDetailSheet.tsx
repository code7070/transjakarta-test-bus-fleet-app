import React, { Suspense, lazy } from "react";
import { Vehicle } from "../../types";
import {
  formatRelativeTime,
  formatCoordinate,
  formatStatus,
} from "../../services/utils/formatters";
import { useReverseGeocoding } from "../../hooks/useReverseGeocoding";
import {
  Bus,
  MapPin,
  Clock,
  Navigation,
  ExternalLink,
  Loader2,
  Signpost,
  Users,
  Activity,
  GitFork,
} from "lucide-react";

const VehicleMap = lazy(() => import("./VehicleMap"));

interface VehicleDetailSheetProps {
  vehicle: Vehicle;
}

export const VehicleDetailSheet: React.FC<VehicleDetailSheetProps> = ({
  vehicle,
}) => {
  const { attributes, relationships } = vehicle;
  const { address, loading: addrLoading } = useReverseGeocoding(
    attributes.latitude,
    attributes.longitude,
  );

  const isMoving = attributes.current_status === "IN_TRANSIT_TO";
  const statusColor = isMoving
    ? "text-green-600 bg-green-50 border-green-200"
    : "text-amber-600 bg-amber-50 border-amber-200";

  // Helper for Occupancy Styling and Text
  const getOccupancyInfo = (status: string | null) => {
    if (!status)
      return {
        text: "Seats: Unknown",
        className: "bg-gray-100 text-gray-500 border-gray-200",
      };

    const upperStatus = status.toUpperCase();
    if (upperStatus.includes("MANY")) {
      return {
        text: "Seats: Available",
        className: "bg-blue-100 text-blue-700 border-blue-200",
      };
    }
    if (upperStatus.includes("FEW")) {
      return {
        text: "Seats: Limited",
        className: "bg-amber-100 text-amber-700 border-amber-200",
      };
    }
    if (upperStatus.includes("FULL")) {
      return {
        text: "Seats: Full",
        className: "bg-red-100 text-red-700 border-red-200",
      };
    }

    return {
      text: `Seats: ${formatStatus(status)}`,
      className: "bg-gray-100 text-gray-600 border-gray-200",
    };
  };

  const occupancyInfo = getOccupancyInfo(attributes.occupancy_status);

  return (
    <div className="flex flex-col bg-white h-full">
      {/* 1. Sticky Header Section */}
      <div className="flex-none px-6 py-4 border-b border-gray-100 bg-white z-20 shadow-[0_4px_20px_-12px_rgba(0,0,0,0.1)]">
        {/* Status Line */}
        <div className="flex items-center gap-2 mb-2">
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${statusColor}`}
          >
            {formatStatus(attributes.current_status)}
          </span>
        </div>

        {/* Title Line: Bus Label + Unit ID */}
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight leading-none">
            {attributes.label}
          </h2>

          {/* Unit ID Badge */}
          <div className="flex flex-col px-2.5 py-1 rounded-lg border border-gray-200 bg-gray-50/50">
            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-0.5">
              Unit ID
            </span>
            <span className="font-mono font-bold text-gray-900 text-xs leading-none">
              {vehicle.id}
            </span>
          </div>
        </div>

        {/* Timestamp Line */}
        <div className="flex items-center gap-1.5 text-muted">
          <Clock className="w-3.5 h-3.5" />
          <p className="text-xs font-medium">
            {formatRelativeTime(attributes.updated_at)}
          </p>
        </div>
      </div>

      {/* 2. Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
        {/* Destination Card (Primary Focus) */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-white/10 transition-colors duration-500" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/20 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-gray-400">
                <Signpost className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">
                  Destination
                </span>
              </div>

              {/* Occupancy Status Badge (Swapped Position: Top Right) */}
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${occupancyInfo.className}`}
              >
                <Users className="w-3.5 h-3.5" />
                <span className="text-xs font-bold whitespace-nowrap">
                  {occupancyInfo.text}
                </span>
              </div>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold leading-tight mb-5 line-clamp-2">
              {attributes.trip_headsign || "Tidak Ada Tujuan"}
            </h3>

            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
              {/* Unified Route Badge: ROUTE | ID | NAME */}
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border shadow-sm transition-all max-w-full"
                style={{
                  backgroundColor: attributes.route_color
                    ? `#${attributes.route_color}`
                    : "#ffffff",
                  borderColor: attributes.route_color
                    ? `#${attributes.route_color}`
                    : "#e5e7eb",
                  color: attributes.route_text_color
                    ? `#${attributes.route_text_color}`
                    : "#000000",
                }}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-70 border-r border-current pr-2">
                  ROUTE
                </span>
                <span className="text-xs font-bold font-mono border-r border-current pr-2">
                  {relationships?.route?.data?.id || "N/A"}
                </span>
                <span className="text-xs font-bold leading-none break-words">
                  {attributes.route_name || "Unknown Route"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Map Visualization */}
        <div className="space-y-3">
          <div className="h-56 w-full rounded-2xl overflow-hidden border border-gray-200 shadow-sm relative z-0 ring-1 ring-gray-100">
            <Suspense
              fallback={
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-muted gap-2">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                  <span className="text-xs font-medium">Memuat Peta...</span>
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

          {/* Current Location Text */}
          <div className="flex items-start gap-3 px-1">
            <div className="mt-1 p-1.5 bg-blue-50 rounded-lg text-primary">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-0.5">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                  Posisi Saat Ini
                </p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${attributes.latitude},${attributes.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  Google Maps <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-sm font-medium text-gray-800 leading-snug line-clamp-2">
                {addrLoading ? (
                  <span className="animate-pulse bg-gray-200 rounded text-transparent">
                    Loading address...
                  </span>
                ) : (
                  address ||
                  `${formatCoordinate(attributes.latitude)}, ${formatCoordinate(attributes.longitude)}`
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Speed */}
          <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">
                Kecepatan
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-gray-900">
                  {attributes.speed !== null ? attributes.speed : "-"}
                </span>
                <span className="text-xs font-medium text-muted">km/h</span>
              </div>
            </div>
            <div className="p-2 bg-amber-50 rounded-lg">
              <Activity className="w-5 h-5 text-amber-500" />
            </div>
          </div>

          {/* Bearing */}
          <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">
                Arah
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-gray-900">
                  {attributes.bearing}°
                </span>
              </div>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Navigation
                className="w-5 h-5 text-primary transition-transform duration-500"
                style={{ transform: `rotate(${attributes.bearing}deg)` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
