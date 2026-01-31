import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  variant?: "center" | "bottom";
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  size = "md",
  variant = "center",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  // Handle render and animation timing
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Small delay to allow DOM render before triggering CSS transition
      requestAnimationFrame(() => setIsVisible(true));
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => setShouldRender(false), 300); // Match transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!shouldRender) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
    full: "max-w-full",
  };

  // Layout configuration based on variant
  const isBottom = variant === "bottom";

  const containerClasses = isBottom
    ? "items-end" // Always bottom, even on desktop
    : "items-center justify-center p-4";

  // Animation classes
  const backdropOpacity = isVisible ? "opacity-100" : "opacity-0";

  const contentTransform = isBottom
    ? isVisible
      ? "translate-y-0"
      : "translate-y-full"
    : isVisible
      ? "scale-100 opacity-100"
      : "scale-95 opacity-0";

  const contentRounded = isBottom
    ? "rounded-t-2xl sm:rounded-2xl" // Top rounded on mobile, fully rounded on desktop
    : "rounded-2xl";

  // Specific sizing for bottom sheet
  const contentWidth = isBottom
    ? "w-full sm:max-w-2xl" // Full width mobile, constrained on desktop
    : `w-full ${sizeClasses[size]}`;

  const contentMargin = isBottom
    ? "mb-0 sm:mb-6" // Flush on mobile, floating on desktop
    : "";

  return createPortal(
    <div
      className={`fixed inset-0 z-[100] flex justify-center ${containerClasses} transition-all duration-300`}
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-out ${backdropOpacity}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div
        className={`
          relative bg-surface shadow-2xl 
          ${contentWidth} ${contentRounded} ${contentMargin}
          flex flex-col max-h-[90vh] sm:max-h-[85vh] overflow-hidden
          transform transition-all duration-300 ease-out ${contentTransform}
        `}
      >
        {/* Grab Handle for Mobile */}
        {isBottom && (
          <div
            className="w-full flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing bg-surface"
            onClick={onClose}
          >
            <div className="w-12 h-1.5 bg-muted/20 rounded-full" />
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-muted hover:text-foreground hover:bg-muted/10 rounded-full transition-colors z-[60]"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto h-full scroll-smooth no-scrollbar">
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
};
