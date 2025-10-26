import axios, { AxiosInstance } from 'axios';
import { AnimeSearchResponse, AnimeFullResponse } from '../types/jikan';

// Create axios instance with base URL
const apiClient: AxiosInstance = axios.create({
  baseURL: 'https://api.jikan.moe/v4',
});

/**
 * Search for anime with pagination support
 * @param query - Search query string
 * @param page - Page number (default: 1)
 * @param signal - AbortSignal for request cancellation
 * @returns Promise with anime search results
 */
export const searchAnime = async (
  query: string,
  page: number = 1,
  signal?: AbortSignal
): Promise<AnimeSearchResponse> => {
  const response = await apiClient.get<AnimeSearchResponse>('/anime', {
    params: {
      q: query,
      page: page,
      sfw: true, // Safe for work filter
    },
    signal,
  });
  return response.data;
};

/**
 * Get full anime details by ID
 * @param id - Anime MAL ID
 * @param signal - AbortSignal for request cancellation
 * @returns Promise with full anime details
 */
export const getAnimeById = async (
  id: string | number,
  signal?: AbortSignal
): Promise<AnimeFullResponse> => {
  const response = await apiClient.get<AnimeFullResponse>(`/anime/${id}/full`, {
    signal,
  });
  return response.data;
};
