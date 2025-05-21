
import { Skeleton } from '@/components/ui/skeleton';

interface SearchResultsLoadingProps {
  count?: number;
}

const SearchResultsLoading = ({ count = 8 }: SearchResultsLoadingProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array(count).fill(0).map((_, index) => (
        <div key={`skeleton-${index}`} className="relative rounded-lg overflow-hidden bg-white/5 shadow-md">
          <Skeleton className="h-48 w-full bg-white/10" />
          <div className="p-3">
            <Skeleton className="h-4 w-full bg-white/10 mb-2" />
            <Skeleton className="h-3 w-3/4 bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchResultsLoading;
