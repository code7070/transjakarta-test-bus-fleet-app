import React from 'react';
import { Vehicle } from '../../types';
import { VehicleCard } from './VehicleCard';
import { SkeletonCard } from '../common/SkeletonCard';

interface VehicleGridProps {
  vehicles: Vehicle[];
  loading?: boolean;
  onVehicleClick?: (vehicle: Vehicle) => void;
}

export const VehicleGrid: React.FC<VehicleGridProps> = ({ vehicles, loading, onVehicleClick }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-300">
        {Array.from({ length: 8 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-500">
      {vehicles.map((vehicle) => (
        <VehicleCard 
          key={vehicle.id} 
          vehicle={vehicle} 
          onClick={() => onVehicleClick?.(vehicle)}
        />
      ))}
    </div>
  );
};