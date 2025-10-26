import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { searchAnime } from '../../services/api';
import { Anime, Pagination } from '../../types/jikan';

// Define the state interface
interface AnimeSearchState {
  results: Anime[];
  pagination: Pagination | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  query: string;
  page: number;
}

// Initial state
const initialState: AnimeSearchState = {
  results: [],
  pagination: null,
  status: 'idle',
  error: null,
  query: '',
  page: 1,
};

// Async thunk for fetching anime search results
export const fetchAnimeSearch = createAsyncThunk(
  'animeSearch/fetchAnimeSearch',
  async (
    { query, page, signal }: { query: string; page: number; signal: AbortSignal },
    { rejectWithValue }
  ) => {
    try {
      const response = await searchAnime(query, page, signal);
      return response;
    } catch (error: any) {
      // Don't treat cancelled requests as errors
      if (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') {
        throw error;
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch anime');
    }
  }
);

// Create the slice
const animeSearchSlice = createSlice({
  name: 'animeSearch',
  initialState,
  reducers: {
    clearResults: (state) => {
      state.results = [];
      state.pagination = null;
      state.status = 'idle';
      state.error = null;
    },
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnimeSearch.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAnimeSearch.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = 'succeeded';
        state.results = action.payload.data;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchAnimeSearch.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { clearResults, setQuery, setPage } = animeSearchSlice.actions;
export default animeSearchSlice.reducer;
