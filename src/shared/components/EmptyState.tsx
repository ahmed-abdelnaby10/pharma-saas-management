import React from "react";

interface EmptyStateProps {
  icon: React.ElementType;
  heading: string;
  subline?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  heading,
  subline,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-16 px-8 text-center ${className}`}
    >
      <Icon className="w-12 h-12 text-gray-300 mb-4" />
      <h3 className="text-base font-semibold text-gray-700">{heading}</h3>
      {subline && (
        <p className="mt-1 text-sm text-gray-400 max-w-xs">{subline}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 px-4 py-2 text-sm font-medium text-white bg-[#0F5C47] rounded-lg hover:bg-[#0d4a39] transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
