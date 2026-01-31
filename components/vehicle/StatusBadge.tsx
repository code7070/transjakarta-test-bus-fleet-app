import React from 'react';
import { formatStatus } from '../../services/utils/formatters';
import { CircleDot, PlayCircle, PauseCircle, AlertCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'IN_TRANSIT_TO':
        return {
          color: 'text-green-600',
          bg: 'bg-green-100',
          icon: PlayCircle
        };
      case 'STOPPED_AT':
        return {
          color: 'text-amber-600',
          bg: 'bg-amber-100',
          icon: PauseCircle
        };
      case 'INCOMING_AT':
        return {
          color: 'text-blue-600',
          bg: 'bg-blue-100',
          icon: CircleDot
        };
      default:
        return {
          color: 'text-gray-500',
          bg: 'bg-gray-100',
          icon: AlertCircle
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <Icon className={`w-4 h-4 ${config.color}`} />
      <span className={`text-xs font-bold uppercase tracking-wide ${config.color}`}>
        {formatStatus(status)}
      </span>
    </div>
  );
};