import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-surface border border-muted/20 rounded-xl p-5 shadow-sm">
      <div className="flex justify-between items-start mb-4 pl-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-muted/10 rounded-lg animate-pulse" />
          <div className="space-y-2">
            <div className="w-24 h-5 bg-muted/10 rounded animate-pulse" />
            <div className="w-12 h-3 bg-muted/10 rounded animate-pulse" />
          </div>
        </div>
        <div className="w-20 h-6 bg-muted/10 rounded-full animate-pulse" />
      </div>

      <div className="grid grid-cols-2 gap-4 pl-3">
        <div className="col-span-2 flex gap-2">
          <div className="w-4 h-4 bg-muted/10 rounded animate-pulse" />
          <div className="space-y-1 flex-1">
            <div className="w-16 h-3 bg-muted/10 rounded animate-pulse" />
            <div className="w-32 h-4 bg-muted/10 rounded animate-pulse" />
          </div>
        </div>
        <div className="flex gap-2">
           <div className="w-4 h-4 bg-muted/10 rounded animate-pulse" />
           <div className="space-y-1 flex-1">
            <div className="w-16 h-3 bg-muted/10 rounded animate-pulse" />
            <div className="w-12 h-4 bg-muted/10 rounded animate-pulse" />
          </div>
        </div>
         <div className="col-span-2 pt-3 border-t border-muted/10 flex gap-2">
            <div className="w-4 h-4 bg-muted/10 rounded animate-pulse" />
            <div className="w-40 h-3 bg-muted/10 rounded animate-pulse" />
         </div>
      </div>
    </div>
  );
};