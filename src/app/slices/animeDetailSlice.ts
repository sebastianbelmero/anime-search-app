import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getAnimeById } from '../../services/api';
import { AnimeFull } from '../../types/jikan';

// Define the state interface
interface AnimeDetailState {
  data: AnimeFull | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Initial state
const initialState: AnimeDetailState = {
  data: null,
  status: 'idle',
  error: null,
};

// Async thunk for fetching anime details by ID
export const fetchAnimeById = createAsyncThunk(
  'animeDetail/fetchAnimeById',
  async (
    { id, signal }: { id: string | number; signal: AbortSignal },
    { rejectWithValue }
  ) => {
    try {
      const response = await getAnimeById(id, signal);
      return response.data;
    } catch (error: any) {
      // Don't treat cancelled requests as errors
      if (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') {
        throw error;
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch anime details');
    }
  }
);

// Create the slice
const animeDetailSlice = createSlice({
  name: 'animeDetail',
  initialState,
  reducers: {
    clearDetail: (state) => {
      state.data = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnimeById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAnimeById.fulfilled, (state, action: PayloadAction<AnimeFull>) => {
        state.status = 'succeeded';
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchAnimeById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { clearDetail } = animeDetailSlice.actions;
export default animeDetailSlice.reducer;
