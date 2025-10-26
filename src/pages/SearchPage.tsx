import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDebounce } from '../hooks/useDebounce';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  fetchAnimeSearch,
  clearResults,
  setQuery,
  setPage,
} from '../app/slices/animeSearchSlice';
import { AnimeCard } from '../components/AnimeCard';
import { SkeletonCard } from '../components/SkeletonCard';
import { ModeToggle } from '../components/mode-toggle';

export function SearchPage() {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const { results, pagination, status, error, query: searchTerm, page: currentPage } =
    useAppSelector((state) => state.animeSearch);

  const debouncedSearchTerm = useDebounce(searchTerm, 250);

  // Initialize from URL params on mount
  useEffect(() => {
    const urlQuery = searchParams.get('q') || '';
    const urlPage = parseInt(searchParams.get('page') || '1', 10);
    
    if (urlQuery !== searchTerm) {
      dispatch(setQuery(urlQuery));
    }
    if (urlPage !== currentPage) {
      dispatch(setPage(urlPage));
    }
  }, []); // Only run on mount

  // Update URL when query or page changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) {
      params.set('q', searchTerm);
    }
    if (currentPage > 1) {
      params.set('page', currentPage.toString());
    }
    
    // Only update if different from current URL
    const newSearch = params.toString();
    const currentSearch = searchParams.toString();
    if (newSearch !== currentSearch) {
      setSearchParams(params, { replace: true });
    }
  }, [searchTerm, currentPage]);

  // Reset page to 1 when search term changes (debounced)
  useEffect(() => {
    if (debouncedSearchTerm) {
      dispatch(setPage(1));
    }
  }, [debouncedSearchTerm, dispatch]);

  useEffect(() => {
    // Create AbortController for request cancellation
    const controller = new AbortController();

    if (debouncedSearchTerm.trim()) {
      // Fetch anime search results using values from Redux
      dispatch(
        fetchAnimeSearch({
          query: debouncedSearchTerm,
          page: currentPage,
          signal: controller.signal,
        })
      );
    } else {
      // Clear results if search term is empty
      dispatch(clearResults());
    }

    // Cleanup: abort request on unmount or when dependencies change
    return () => {
      controller.abort();
    };
  }, [debouncedSearchTerm, currentPage, dispatch]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      dispatch(setPage(currentPage - 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextPage = () => {
    if (pagination?.has_next_page) {
      dispatch(setPage(currentPage + 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Anime Search
            </h1>
            <ModeToggle />
          </div>
          
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => dispatch(setQuery(e.target.value))}
              placeholder="Search for anime..."
              className="w-full px-4 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => {
                  dispatch(setQuery(''));
                  dispatch(setPage(1));
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {status === 'loading' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 10 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        )}

        {/* Error State */}
        {status === 'failed' && error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* Empty State */}
        {status === 'succeeded' && results.length === 0 && debouncedSearchTerm && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 dark:text-gray-400">
              No results found for "{debouncedSearchTerm}"
            </p>
            <p className="text-gray-500 dark:text-gray-500 mt-2">
              Try searching with different keywords
            </p>
          </div>
        )}

        {/* No Search Term */}
        {!debouncedSearchTerm && status === 'idle' && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Start typing to search for anime
            </p>
          </div>
        )}

        {/* Results Grid */}
        {status === 'succeeded' && results.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {results.map((anime) => (
                <AnimeCard key={anime.mal_id} anime={anime} />
              ))}
            </div>

            {/* Pagination */}
            {pagination && (
              <div className="mt-8 flex items-center justify-center gap-4">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                >
                  Previous
                </button>

                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  Page {currentPage} of {pagination.last_visible_page}
                </span>

                <button
                  onClick={handleNextPage}
                  disabled={!pagination.has_next_page}
                  className="px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
