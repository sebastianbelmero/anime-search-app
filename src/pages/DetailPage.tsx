import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchAnimeById, clearDetail } from '../app/slices/animeDetailSlice';

export function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { data, status, error } = useAppSelector((state) => state.animeDetail);

  useEffect(() => {
    if (!id) return;

    // Create AbortController for request cancellation
    const controller = new AbortController();

    // Fetch anime details
    dispatch(
      fetchAnimeById({
        id,
        signal: controller.signal,
      })
    );

    // Cleanup: abort request and clear detail on unmount
    return () => {
      controller.abort();
      dispatch(clearDetail());
    };
  }, [id, dispatch]);

  // Loading State
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-48 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="aspect-3/4 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
              <div className="lg:col-span-2 space-y-4">
                <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (status === 'failed' || !data) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-4"
          >
            ← Back to Search
          </Link>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
            <p className="font-medium">Error</p>
            <p>{error || 'Failed to load anime details'}</p>
          </div>
        </div>
      </div>
    );
  }

  // Success State
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-6 font-medium"
        >
          ← Back to Search
        </Link>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image */}
          <div className="lg:col-span-1">
            <img
              src={
                data.images.jpg.large_image_url || data.images.jpg.image_url || ''
              }
              alt={data.title}
              className="w-full rounded-lg shadow-lg"
            />
          </div>

          {/* Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {data.title}
              </h1>
              {data.title_english && data.title_english !== data.title && (
                <p className="text-xl text-gray-600 dark:text-gray-300">{data.title_english}</p>
              )}
              {data.title_japanese && (
                <p className="text-lg text-gray-500 dark:text-gray-400">{data.title_japanese}</p>
              )}
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-4">
              {data.score && (
                <div className="flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/30 px-4 py-2 rounded-lg">
                  <span className="text-yellow-500 dark:text-yellow-400 text-xl">⭐</span>
                  <span className="font-bold text-lg text-gray-900 dark:text-white">{data.score.toFixed(2)}</span>
                </div>
              )}
              {data.rank && (
                <div className="bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-lg">
                  <span className="text-blue-700 dark:text-blue-300 font-medium">
                    Rank #{data.rank}
                  </span>
                </div>
              )}
              {data.popularity && (
                <div className="bg-purple-50 dark:bg-purple-900/30 px-4 py-2 rounded-lg">
                  <span className="text-purple-700 dark:text-purple-300 font-medium">
                    Popularity #{data.popularity}
                  </span>
                </div>
              )}
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-transparent dark:border-gray-700">
              {data.type && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Type</p>
                  <p className="font-medium text-gray-900 dark:text-white">{data.type}</p>
                </div>
              )}
              {data.episodes && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Episodes</p>
                  <p className="font-medium text-gray-900 dark:text-white">{data.episodes}</p>
                </div>
              )}
              {data.status && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                  <p className="font-medium text-gray-900 dark:text-white">{data.status}</p>
                </div>
              )}
              {data.duration && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
                  <p className="font-medium text-gray-900 dark:text-white">{data.duration}</p>
                </div>
              )}
              {data.season && data.year && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Season</p>
                  <p className="font-medium text-gray-900 dark:text-white capitalize">
                    {data.season} {data.year}
                  </p>
                </div>
              )}
              {data.source && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Source</p>
                  <p className="font-medium text-gray-900 dark:text-white">{data.source}</p>
                </div>
              )}
            </div>

            {/* Synopsis */}
            {data.synopsis && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-transparent dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Synopsis
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{data.synopsis}</p>
              </div>
            )}

            {/* Background */}
            {data.background && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-transparent dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Background
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{data.background}</p>
              </div>
            )}

            {/* Genres */}
            {data.genres && data.genres.length > 0 && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-transparent dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Genres</h2>
                <div className="flex flex-wrap gap-2">
                  {data.genres.map((genre) => (
                    <span
                      key={genre.mal_id}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Themes */}
            {data.themes && data.themes.length > 0 && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-transparent dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Themes</h2>
                <div className="flex flex-wrap gap-2">
                  {data.themes.map((theme) => (
                    <span
                      key={theme.mal_id}
                      className="px-3 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 rounded-full text-sm font-medium"
                    >
                      {theme.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Studios */}
            {data.studios && data.studios.length > 0 && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-transparent dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Studios</h2>
                <div className="flex flex-wrap gap-2">
                  {data.studios.map((studio) => (
                    <span
                      key={studio.mal_id}
                      className="px-3 py-1 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 rounded-full text-sm font-medium"
                    >
                      {studio.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Producers */}
            {data.producers && data.producers.length > 0 && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-transparent dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Producers
                </h2>
                <div className="flex flex-wrap gap-2">
                  {data.producers.map((producer) => (
                    <span
                      key={producer.mal_id}
                      className="px-3 py-1 bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-300 rounded-full text-sm font-medium"
                    >
                      {producer.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
