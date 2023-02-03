import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AboutPage from "./pages/AboutPage";
import ArticleListPage from "./pages/ArticleListPage";
import ArticlePage from "./pages/ArticlePage";
import HomePage from "./pages/HomePage";
import NavBar from "./NavBar";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavBar />
        <div id="page-body">
          <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route exact path="/about" element={<AboutPage />} />
            <Route exact path="/articles" element={<ArticleListPage />} />
            <Route path="*" element={<NotFoundPage />} />
            <Route
              exact
              path="/articles/:articleId"
              element={<ArticlePage />}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
