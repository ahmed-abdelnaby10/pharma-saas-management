export default function CardSkeleton() {
  return (
    <div className="bg-white rounded shadow-sm p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded bg-gray-200" />
      </div>
      <div className="text-right">
        <div className="h-3 w-24 bg-gray-200 rounded mb-2" />
        <div className="h-6 w-16 bg-gray-200 rounded" />
      </div>
    </div>
  );
}
