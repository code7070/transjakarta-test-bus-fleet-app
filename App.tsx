import React, { useState, useMemo } from "react";
import { useVehicles } from "./hooks/useVehicles";
import { usePagination } from "./hooks/usePagination";
import { VehicleGrid } from "./components/vehicle/VehicleGrid";
import { Pagination } from "./components/pagination/Pagination";
import { ErrorMessage } from "./components/common/ErrorMessage";
import { EmptyState } from "./components/common/EmptyState";
import { RouteFilter } from "./components/filters/RouteFilter";
import { TripFilter } from "./components/filters/TripFilter";
import { Modal } from "./components/common/Modal/Modal";
// Using the new Sheet component
import { VehicleDetailSheet } from "./components/vehicle/VehicleDetailSheet";
import { Vehicle } from "./types";
import { getErrorMessage } from "./services/utils/errorHelpers";
import {
  LayoutDashboard,
  Bus,
  X,
  RotateCw,
  Waypoints,
  Signpost,
  Loader2,
} from "lucide-react";

const App: React.FC = () => {
  const { data, loading, error, refetch } = useVehicles();
  const [selectedRoutes, setSelectedRoutes] = useState<string[]>([]);
  const [selectedTrips, setSelectedTrips] = useState<string[]>([]); // Note: These are now Headsigns, not IDs
  const [isTripLoading, setIsTripLoading] = useState(false);

  // Modal State
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter logic with memoization
  const filteredVehicles = useMemo(() => {
    return data.filter((vehicle) => {
      const matchesRoute =
        selectedRoutes.length === 0 ||
        (vehicle.relationships?.route?.data?.id &&
          selectedRoutes.includes(vehicle.relationships.route.data.id));

      // Filter by Trip Headsign (Destination) instead of Trip ID
      const matchesTrip =
        selectedTrips.length === 0 ||
        (vehicle.attributes.trip_headsign &&
          selectedTrips.includes(vehicle.attributes.trip_headsign));

      return matchesRoute && matchesTrip;
    });
  }, [data, selectedRoutes, selectedTrips]);

  // Pagination logic
  const {
    currentPage,
    totalPages,
    itemsPerPage,
    startIndex,
    endIndex,
    goToPage,
    setItemsPerPage,
  } = usePagination({
    totalItems: filteredVehicles.length,
    initialItemsPerPage: 10, // Start with 10 items per page
  });

  const currentVehicles = filteredVehicles.slice(startIndex, endIndex);
  const hasActiveFilters =
    selectedRoutes.length > 0 || selectedTrips.length > 0;

  // Handlers
  const handleRouteChange = (ids: string[]) => {
    setSelectedRoutes(ids);
    // Don't clear selected trips - let users accumulate trip selections across routes
    goToPage(1);
  };

  const handleTripChange = (headsigns: string[]) => {
    setSelectedTrips(headsigns);
    goToPage(1);
  };

  const clearAllFilters = () => {
    setSelectedRoutes([]);
    setSelectedTrips([]);
    goToPage(1);
  };

  const handleCardClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedVehicle(null), 300); // Clear data after transition
  };

  // Render Content Logic
  const renderContent = () => {
    if (error) {
      return (
        <ErrorMessage message={getErrorMessage(error)} onRetry={refetch} />
      );
    }

    if (!loading && filteredVehicles.length === 0) {
      return (
        <EmptyState
          title="Data Tidak Ditemukan"
          message={
            hasActiveFilters
              ? "Tidak ada armada yang cocok dengan filter rute atau perjalanan yang Anda pilih."
              : "Saat ini tidak ada data armada yang tersedia dari server."
          }
          action={
            hasActiveFilters
              ? {
                  label: "Hapus filter",
                  onClick: clearAllFilters,
                }
              : {
                  label: "Muat ulang",
                  onClick: refetch,
                }
          }
        />
      );
    }

    return (
      <>
        <VehicleGrid
          vehicles={currentVehicles}
          loading={loading}
          onVehicleClick={handleCardClick}
        />

        {!loading && filteredVehicles.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
          />
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans text-foreground">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-primary shadow-lg border-b border-primary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm transition-transform hover:scale-105 duration-200 cursor-default">
                <Bus className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white leading-tight">
                  Transjakarta
                </h1>
                <p className="text-xs text-blue-100 font-medium tracking-wide opacity-90">
                  Fleet Management System
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full text-xs font-medium text-white border border-white/10 shadow-sm">
                <span
                  className={`w-2 h-2 rounded-full ${loading ? "bg-yellow-400" : "bg-green-400"} animate-pulse`}
                ></span>
                {loading ? "Updating..." : "System Online"}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div>
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <LayoutDashboard className="w-6 h-6 text-primary" />
              Live Monitoring
            </h2>
            <p className="text-muted mt-1 text-sm">
              Real-time locations and status of active fleet units.
            </p>
          </div>

          {!loading && !error && (
            <div className="bg-white px-4 py-2 rounded-lg border border-muted/20 shadow-sm flex items-center gap-2">
              <span className="text-sm font-medium text-muted">
                Total Active Units:
              </span>
              <span className="text-lg font-bold text-primary">
                {filteredVehicles.length}
              </span>
              {filteredVehicles.length !== data.length && (
                <span className="text-xs text-muted">
                  {" "}
                  (filtered from {data.length})
                </span>
              )}
            </div>
          )}
        </div>

        {/* Filters & Actions Bar */}
        <div className="mb-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500 delay-100">
          {/* Changed breakpoint from lg: to md: for tablet support */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Left Side: Filter Inputs */}
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              {/* Route Filter with Icon */}
              <div className="relative flex-1 sm:max-w-xs group">
                <div className="absolute left-3 top-3 z-10 text-primary pointer-events-none transition-transform group-hover:scale-110">
                  <Waypoints className="w-4 h-4" />
                </div>
                {/* CSS trick: target the button inside the child component to add left padding */}
                <div className="[&_button]:pl-10 [&_button]:h-[42px]">
                  <RouteFilter
                    selectedRoutes={selectedRoutes}
                    onChange={handleRouteChange}
                  />
                </div>
              </div>

              {/* Trip Filter with Icon */}
              <div className="relative flex-1 sm:max-w-xs group">
                <div className="absolute left-3 top-3 z-10 text-yellow-600 pointer-events-none transition-transform group-hover:scale-110">
                  {isTripLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Signpost className="w-4 h-4" />
                  )}
                </div>
                <div className="[&_button]:pl-10 [&_button]:h-[42px]">
                  <TripFilter
                    selectedTrips={selectedTrips}
                    selectedRoutes={selectedRoutes}
                    onChange={handleTripChange}
                    onLoadingChange={setIsTripLoading}
                  />
                </div>
              </div>

              {/* Clear Filter Button */}
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 rounded-lg transition-colors active:scale-95 whitespace-nowrap h-[42px]"
                  title="Clear all filters"
                >
                  <X className="w-4 h-4" />
                  <span className="hidden sm:inline">Clear</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-muted/30 shadow-sm h-[42px]">
                <span className="text-xs font-medium text-muted whitespace-nowrap">
                  Tampilkan:
                </span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="bg-transparent border-none text-sm font-bold text-primary focus:ring-0 cursor-pointer outline-none p-0"
                >
                  {[10, 20, 50, 100].map((val) => (
                    <option key={val} value={val}>
                      {val}
                    </option>
                  ))}
                </select>
              </div>

              {/* Right Side: Refresh Button - Added shrink-0 */}
              <button
                onClick={refetch}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-4 py-2 h-[42px] bg-white border border-muted/30 text-foreground font-medium rounded-lg hover:bg-gray-50 hover:border-primary/50 text-sm transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                <RotateCw
                  className={`w-4 h-4 ${loading ? "animate-spin text-primary" : "text-muted"}`}
                />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 pt-1 animate-in fade-in duration-300">
              {selectedRoutes.map((id) => (
                <span
                  key={`route-${id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 shadow-sm transition-all hover:bg-primary/20"
                >
                  <Waypoints className="w-3 h-3" />
                  Route: {id}
                  <button
                    onClick={() =>
                      handleRouteChange(selectedRoutes.filter((r) => r !== id))
                    }
                    className="rounded-full p-0.5 ml-1 hover:bg-primary/30 focus:outline-none focus:ring-1 focus:ring-primary"
                    aria-label={`Remove route filter ${id}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {selectedTrips.map((headsign) => (
                <span
                  key={`trip-${headsign}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-yellow-700 border border-accent/20 shadow-sm transition-all hover:bg-accent/20"
                >
                  <Signpost className="w-3 h-3" />
                  To: {headsign}
                  <button
                    onClick={() =>
                      handleTripChange(
                        selectedTrips.filter((t) => t !== headsign),
                      )
                    }
                    className="rounded-full p-0.5 ml-1 hover:bg-accent/30 focus:outline-none focus:ring-1 focus:ring-accent"
                    aria-label={`Remove trip filter ${headsign}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="min-h-[500px]">{renderContent()}</div>
      </main>

      {/* Vehicle Detail Modal with New Sheet Style */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        size="md"
        variant="bottom" // Added the bottom variant
      >
        {selectedVehicle && <VehicleDetailSheet vehicle={selectedVehicle} />}
      </Modal>

      {/* Footer */}
      <footer className="bg-white border-t border-muted/20 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} Transjakarta Fleet Management. All
            rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
