import React from "react";

interface TableSkeletonProps {
  columns?: number; // number of columns
  rows?: number; // number of rows
  /** Mirror column order for RTL (e.g. Arabic) to match real tables. */
  dir?: "ltr" | "rtl";
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({
  columns = 8,
  rows = 5,
  dir,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full animate-pulse" dir={dir}>
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            {Array.from({ length: columns }).map((_, i) => (
              <th
                key={i}
                className="py-4 px-6 text-start text-sm font-semibold text-gray-500"
              >
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <tr
              key={rowIdx}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              {Array.from({ length: columns }).map((_, colIdx) => (
                <td key={colIdx} className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    {colIdx === 0 && (
                      <div className="w-12 h-12 bg-gray-200 rounded-lg shrink-0" />
                    )}
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      {colIdx === 0 && (
                        <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                      )}
                    </div>
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableSkeleton;
