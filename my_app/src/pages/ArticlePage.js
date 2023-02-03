import { useParams } from "react-router-dom";

import articleContent from "./article-content";
import NotFoundPage from "./NotFoundPage";

const ArticlePage = () => {
  const { articleId } = useParams();
  const article = articleContent.find((article) => article.name === articleId);
  if (!article) {
    return <NotFoundPage />;
  }
  return (
    <>
      <h1>{article.name}</h1>
      {article.content.map((para, i) => (
        <p key={i}>{para}</p>
      ))}
    </>
  );
};

export default ArticlePage;
