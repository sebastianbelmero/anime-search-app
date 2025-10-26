export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse border border-transparent dark:border-gray-700">
      {/* Image skeleton */}
      <div className="aspect-3/4 bg-gray-300 dark:bg-gray-700"></div>
      
      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Title skeleton */}
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
        
        {/* Score skeleton */}
        <div className="flex items-center gap-2 mt-2">
          <div className="h-4 w-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-12"></div>
        </div>
        
        {/* Episodes skeleton */}
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
        
        {/* Type badge skeleton */}
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-16 mt-2"></div>
      </div>
    </div>
  );
}
