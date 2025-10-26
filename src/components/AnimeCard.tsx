import { Link } from 'react-router-dom';
import { Anime } from '../types/jikan';

interface AnimeCardProps {
  anime: Anime;
}

export function AnimeCard({ anime }: AnimeCardProps) {
  return (
    <Link
      to={`/anime/${anime.mal_id}`}
      className="group block bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-transparent dark:border-gray-700"
    >
      <div className="aspect-3/4 overflow-hidden bg-gray-200 dark:bg-gray-700">
        <img
          src={anime.images.jpg.large_image_url || anime.images.jpg.image_url || ''}
          alt={anime.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg line-clamp-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {anime.title}
        </h3>
        {anime.score && (
          <div className="mt-2 flex items-center gap-2">
            <span className="text-yellow-500 dark:text-yellow-400">⭐</span>
            <span className="font-medium text-gray-700 dark:text-gray-300">{anime.score.toFixed(2)}</span>
          </div>
        )}
        {anime.episodes && (
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Episodes: {anime.episodes}
          </p>
        )}
        {anime.type && (
          <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 rounded">
            {anime.type}
          </span>
        )}
      </div>
    </Link>
  );
}
