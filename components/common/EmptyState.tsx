import React from 'react';
import { Bus } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  title = "Data Tidak Ditemukan", 
  message = "Kami tidak dapat menemukan armada yang sesuai dengan kriteria filter Anda.",
  action 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-muted/20 border-dashed animate-in fade-in duration-500">
      <div className="p-4 bg-muted/5 rounded-full mb-4">
        <Bus className="w-10 h-10 text-muted/50" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-muted text-sm max-w-sm text-center mb-6">{message}</p>
      {action && (
        <button 
          onClick={action.onClick}
          className="text-primary font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-primary/20 rounded px-2"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};