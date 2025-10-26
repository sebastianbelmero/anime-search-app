Tentu, ini adalah versi `PROMPTS.md` yang diperbarui, dengan asumsi Anda telah menyelesaikan penyiapan dasar untuk Vite, React, TypeScript, Redux, and React Router DOM.

Prompt ini sekarang fokus pada *penerapan* logika aplikasi, bukan *penyiapan* alat.

-----

# PROMPTS.md

This document records all prompts used with AI assistance (GitHub Copilot / Copilot Chat) during the development of the YoPrint React Coding Project: Anime Search App.

*(Initial project setup for Vite, React, TS, Redux, and React Router is complete.)*

## 1\. Folder Structure & Initial Config

**Context:** Creating a logical and scalable folder structure to separate concerns (pages, components, state management, services) in line with the "Code Organization" evaluation criteria.

**Prompts:**

```
Suggest a good folder structure for my existing React + TypeScript + Redux app. I need folders for:
- pages
- components (for reusable UI components)
- features (to hold Redux slices and related components)
- services (for API calls)
- hooks (for custom hooks)
- types (for TypeScript definitions)
```

```
Create a 'src/types/jikan.ts' file to store data types from the Jikan API.
```

## 2\. TypeScript Interfaces (Type Definitions)

**Context:** Analyzing the Jikan API spec (specifically `getAnimeSearch` and `getAnimeById`) to create strong TypeScript interfaces. This is crucial for meeting the "TypeScript Usage" criteria and avoiding `any`.

**Prompts:**

```
Based on the Jikan v4 API spec, create TypeScript interfaces for me in 'src/types/jikan.ts'.

1.  Create an 'Anime' interface for a single anime item from the '/anime' search results. I need: mal_id (number), url (string), images (object with jpg.image_url), title (string), synopsis (string), score (number), and episodes (number).
2.  Create a 'Pagination' interface for the pagination metadata from the Jikan API, containing: last_visible_page (number), has_next_page (boolean), current_page (number), and items (object with count, total, per_page).
3.  Create an 'AnimeSearchResponse' interface that has 'data' (an array of 'Anime') and 'pagination' ('Pagination').
4.  Create an 'AnimeFull' interface for the result from '/anime/{id}/full'. It should be similar to 'Anime' but with additional properties like 'background', 'relations', 'themes', 'producers', and 'studios'.
5.  Create an 'AnimeFullResponse' interface that has 'data' (a single 'AnimeFull' object).
```

## 3\. API Service

**Context:** Creating a dedicated service layer to handle all communication with the Jikan API. Using `axios` to facilitate request cancellation, which is a requirement for the instant search.

**Prompts:**

```
Create an API service file at 'src/services/api.ts' using axios.

1.  Create an axios instance with the 'baseURL' set to 'https://api.jikan.moe/v4'.
2.  Create a 'searchAnime' function that accepts 'query' (string), 'page' (number), and 'signal' (AbortSignal). This function should call GET '/anime' with 'q', 'page', and 'sfw=true' parameters, and pass the 'signal' to axios. It should return a 'Promise<AnimeSearchResponse>'.
3.  Create a 'getAnimeById' function that accepts 'id' (string | number) and 'signal' (AbortSignal). This function should call GET '/anime/{id}/full' and pass the 'signal'. It should return a 'Promise<AnimeFullResponse>'.
```

## 4\. Redux Slice & Thunk Setup

**Context:** Implementing the specific Redux slices and async thunks required to manage the application's state.

**Prompts:**

```
Create a Redux slice in 'src/app/slices/animeSearchSlice.ts'.
1.  Define the initial state with properties: 'results' (Anime[]), 'pagination' (Pagination | null), 'status' ('idle' | 'loading' | 'succeeded' | 'failed'), and 'error' (string | null).
2.  Create a 'createAsyncThunk' named 'fetchAnimeSearch'. This thunk should accept an object '{ query: string, page: number, signal: AbortSignal }' and call the 'searchAnime' function from the API service.
3.  Handle the 'pending', 'fulfilled', and 'rejected' states from the thunk. On 'fulfilled', update the 'results' and 'pagination' state.
4.  Add a 'clearResults' reducer to empty 'results' and 'pagination' when a new search starts.
```

```
Create a second Redux slice in 'src/app/slices/animeDetailSlice.ts'.
1.  Define the initial state with 'data' (AnimeFull | null), 'status', and 'error'.
2.  Create a 'createAsyncThunk' named 'fetchAnimeById'. This thunk should accept '{ id: string | number, signal: AbortSignal }' and call 'getAnimeById'.
3.  Handle 'pending', 'fulfilled', and 'rejected'.
```

```
Help me add the new 'animeSearchReducer' and 'animeDetailReducer' to the 'reducer' object in my main 'src/app/store.ts' file.
```

## 5\. Search Page & Debouncing

**Context:** Building the UI for the search page and implementing the instant search logic with 250ms debouncing and request cancellation.

**Prompts:**

```
Create a custom hook 'useDebounce' in 'src/hooks/useDebounce.ts'. This hook should accept a 'value' and a 'delay' (default 250ms) and return the debounced value.
```

```
Create a 'SearchPage' component in 'src/pages/SearchPage.tsx'.
1.  Create an 'input' text field. Use 'useState' to store its value ('searchTerm').
2.  Use the 'useDebounce' hook on 'searchTerm' with a 250ms delay to get 'debouncedSearchTerm'.
3.  Use another 'useState' to track the 'currentPage', defaulting to 1.
```

```
In 'SearchPage.tsx', write a 'useEffect' that depends on 'debouncedSearchTerm' and 'currentPage'.
1.  Inside the effect, create an 'AbortController'.
2.  Dispatch the 'fetchAnimeSearch' thunk, sending the 'debouncedSearchTerm', 'currentPage', and 'controller.signal'.
3.  Ensure it only fetches if 'debouncedSearchTerm' is not empty.
4.  If 'debouncedSearchTerm' changes, reset 'currentPage' to 1 and dispatch 'clearResults' from 'animeSearchSlice'.
5.  Return a cleanup function from 'useEffect' that calls 'controller.abort()'.
```

## 6\. Displaying Results & Pagination

**Context:** Rendering the search results from the Redux store, handling loading/empty states, and implementing pagination controls.

**Prompts:**

```
In 'SearchPage.tsx', use 'useAppSelector' (from my 'src/app/hooks.ts') to get 'results', 'pagination', 'status', and 'error' from 'animeSearchSlice'.
```

```
Create an 'AnimeCard' component in 'src/components/AnimeCard.tsx'.
1.  This component should accept an 'anime' prop with the type 'Anime'.
2.  Render the image ('anime.images.jpg.image_url') and title ('anime.title').
3.  Wrap the entire card with a 'Link' component from 'react-router-dom' pointing to '/anime/{anime.mal_id}'.
```

```
Back in 'SearchPage.tsx'.
1.  Render an 'AnimeCard' for each item in 'results'.
2.  Show a loading message (or 'SkeletonLoader') when 'status' is 'loading'.
3.  Show a "No results found." message if 'status' is 'succeeded' and 'results.length' is 0.
4.  Show an error message if 'status' is 'failed'.
```

```
In 'SearchPage.tsx', create a simple pagination component.
1.  Render "Previous" and "Next" buttons.
2.  The "Previous" button should be disabled if 'currentPage' === 1.
3.  The "Next" button should be disabled if 'pagination.has_next_page' is false.
4.  Update the 'currentPage' state when the buttons are clicked.
```

## 7\. Detail Page

**Context:** Creating the second page that fetches and displays the full data for a single anime based on the ID from the URL.

**Prompts:**

```
Create a 'DetailPage' component in 'src/pages/DetailPage.tsx'.
1.  Use the 'useParams' hook from 'react-router-dom' to get the 'id' from the URL.
2.  Use 'useAppDispatch' and 'useAppSelector' to interact with 'animeDetailSlice'.
3.  Write a 'useEffect' that runs on component mount (and if 'id' changes).
4.  Inside the effect, ensure 'id' exists, then create an 'AbortController' and dispatch 'fetchAnimeById' with the 'id' and 'controller.signal'.
5.  Return a cleanup function that calls 'controller.abort()'.
```

```
In 'DetailPage.tsx', render the data from 'animeDetailSlice'.
1.  Use 'useAppSelector' to get 'data' (AnimeFull), 'status', and 'error'.
2.  Show a loader if 'status' is 'loading'.
3.  Show an error if 'status' is 'failed'.
4.  If 'status' is 'succeeded' and 'data' exists, render 'data.title', 'data.images.jpg.large_image_url', 'data.synopsis', 'data.score', and 'data.episodes'.
```

## 8\. Styling & Bonus Points

**Context:** Implementing a UI Library of choice and adding UX features like skeleton loaders and responsiveness to earn bonus points.

**Prompts:**

```
I want to use shadcn/ui for styling. Show me how to install it and set up its Provider in 'src/main.tsx'.
```

```
add a 'SkeletonCard' component from shadcn/ui. It should mimic the layout of 'AnimeCard'.
```

```
In 'SearchPage.tsx', when 'status' is 'loading', render a grid of 10 'SkeletonCard's.
```

```
How do I make the grid layout in 'SearchPage.tsx' responsive using shadcn/ui? I want to show 4 columns on desktop, 2 on tablet, and 1 on mobile.
```

```
Refactor 'DetailPage.tsx' using shadcn/ui layout components (like Box, Grid, Flex, Stack) to display the image on one side and the details (title, synopsis, score) on the other, responsively.
```