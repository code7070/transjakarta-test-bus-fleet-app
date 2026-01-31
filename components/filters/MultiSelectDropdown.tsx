import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, Check, X, Loader2 } from "lucide-react";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";

export interface Option {
  id: string;
  label: React.ReactNode;
  subtitle?: string;
}

interface MultiSelectDropdownProps {
  label: string;
  options: Option[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loading?: boolean;
  searchable?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  label,
  options,
  selectedIds,
  onSelectionChange,
  onLoadMore,
  hasMore,
  loading,
  searchable = true,
  placeholder = "Search...",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Infinite scroll trigger (only when onLoadMore is provided)
  const observerRef = useInfiniteScroll(() => {
    if (onLoadMore && hasMore) onLoadMore();
  });

  // Filter options based on search locally
  const filteredOptions = options.filter(
    (opt) =>
      (typeof opt.label === "string" &&
        opt.label.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (opt.subtitle &&
        opt.subtitle.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const handleToggle = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectionChange([]);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          flex items-center justify-between w-full min-w-[200px] px-4 py-3 rounded-lg border transition-all duration-200
          ${
            disabled
              ? "border-muted/20 bg-gray-50 opacity-60 cursor-not-allowed"
              : isOpen
                ? "border-primary ring-2 ring-primary/10 bg-surface"
                : "border-muted/30 bg-surface hover:border-primary/50"
          }
        `}
      >
        <div className="flex items-center gap-2 truncate flex-1">
          <span className="text-xs font-bold text-muted uppercase tracking-wider shrink-0">
            {label}:
          </span>
          <span className="text-sm font-semibold text-primary truncate">
            {selectedIds.length === 0
              ? disabled
                ? "Unavailable"
                : "All"
              : `${selectedIds.length} Selected`}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {!disabled && selectedIds.length > 0 && (
            <div
              role="button"
              onClick={clearSelection}
              className="p-1 hover:bg-muted/20 rounded-full transition-colors"
            >
              <X className="w-3.5 h-3.5 text-muted" />
            </div>
          )}
          <ChevronDown
            className={`w-4 h-4 text-muted transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-2 bg-surface border border-muted/20 rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {searchable && (
            <div className="p-2 border-b border-muted/10 sticky top-0 bg-surface">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={placeholder}
                  className="w-full pl-9 pr-3 py-2 bg-muted/5 border border-muted/20 rounded-md text-sm focus:outline-none focus:border-primary/50 transition-colors"
                  autoFocus
                />
              </div>
            </div>
          )}

          <div className="max-h-[240px] overflow-y-auto">
            {filteredOptions.length === 0 && !loading ? (
              <div className="p-4 text-center text-sm text-muted">
                No results found
              </div>
            ) : (
              <div className="p-1">
                {filteredOptions.map((option) => {
                  const isSelected = selectedIds.includes(option.id);
                  const showChecked = isSelected || selectedIds.length === 0;
                  return (
                    <button
                      type="button"
                      key={option.id}
                      onClick={() => handleToggle(option.id)}
                      className={`
                        flex items-start gap-3 !px-3 py-3 !h-auto rounded-md cursor-pointer transition-colors w-full text-left
                        ${isSelected ? "bg-primary/5" : "hover:bg-muted/15"}
                      `}
                    >
                      <div
                        className={`
                        flex items-center justify-center w-5 h-5 rounded border mt-0.5 transition-colors shrink-0
                        ${showChecked ? "bg-primary border-primary" : "border-muted/40 bg-surface"}
                      `}
                      >
                        {showChecked && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span
                          className={`text-sm leading-snug ${isSelected ? "font-semibold text-primary" : "text-foreground"}`}
                        >
                          {option.label}
                        </span>
                        {option.subtitle && (
                          <span className="text-xs text-muted mt-0.5 leading-tight">
                            {option.subtitle}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}

                {/* Loader / Infinite Scroll Sentinel */}
                {onLoadMore && hasMore && (
                  <div
                    ref={observerRef}
                    className="h-4 w-full flex items-center justify-center py-2"
                  >
                    {loading && (
                      <Loader2 className="w-4 h-4 text-primary animate-spin" />
                    )}
                  </div>
                )}
                {loading && (!onLoadMore || !hasMore) && (
                  <div className="h-4 w-full flex items-center justify-center py-2">
                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="p-2 border-t border-muted/10 bg-muted/5 flex justify-between items-center text-xs">
            <span className="text-muted">{selectedIds.length} selected</span>
            <button
              onClick={() => onSelectionChange([])}
              className="text-primary hover:underline font-medium disabled:opacity-50 !h-auto p-1.5"
              disabled={selectedIds.length === 0}
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
