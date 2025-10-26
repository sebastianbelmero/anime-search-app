// TypeScript interfaces for Jikan API v4

export interface AnimeImages {
  jpg: {
    image_url: string | null;
    small_image_url: string | null;
    large_image_url: string | null;
  };
  webp: {
    image_url: string | null;
    small_image_url: string | null;
    large_image_url: string | null;
  };
}

export interface Anime {
  mal_id: number;
  url: string;
  images: AnimeImages;
  trailer: {
    youtube_id: string | null;
    url: string | null;
    embed_url: string | null;
  };
  approved: boolean;
  titles: Array<{
    type: string;
    title: string;
  }>;
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  type: 'TV' | 'OVA' | 'Movie' | 'Special' | 'ONA' | 'Music' | null;
  source: string | null;
  episodes: number | null;
  status: 'Finished Airing' | 'Currently Airing' | 'Not yet aired' | null;
  airing: boolean;
  duration: string | null;
  rating: string | null;
  score: number | null;
  scored_by: number | null;
  rank: number | null;
  popularity: number | null;
  members: number | null;
  favorites: number | null;
  synopsis: string | null;
  background: string | null;
  season: 'summer' | 'winter' | 'spring' | 'fall' | null;
  year: number | null;
  genres: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
  themes: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
  demographics: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
}

export interface Pagination {
  last_visible_page: number;
  has_next_page: boolean;
  current_page: number;
  items: {
    count: number;
    total: number;
    per_page: number;
  };
}

export interface AnimeSearchResponse {
  data: Anime[];
  pagination: Pagination;
}

// AnimeFull extends Anime with additional properties
export interface AnimeFull extends Anime {
  relations: Array<{
    relation: string;
    entry: Array<{
      mal_id: number;
      type: string;
      name: string;
      url: string;
    }>;
  }>;
  theme: {
    openings: string[];
    endings: string[];
  };
  external: Array<{
    name: string;
    url: string;
  }>;
  streaming: Array<{
    name: string;
    url: string;
  }>;
  producers: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
  licensors: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
  studios: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
}

export interface AnimeFullResponse {
  data: AnimeFull;
}
