import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SearchPage } from "./pages/SearchPage";
import { DetailPage } from "./pages/DetailPage";

export const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<SearchPage />} />
      <Route path="/anime/:id" element={<DetailPage />} />
    </Routes>
    <footer className="w-full mt-8">
      <div className="container mx-auto px-4 py-4 text-center text-sm text-gray-600 dark:text-gray-400">
        created by{' '}
        <a
          href="http://sebastianbelmero.my.id"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-blue-600 dark:hover:text-blue-400"
        >
          sebastian
        </a>
      </div>
    </footer>
  </Router>
);

