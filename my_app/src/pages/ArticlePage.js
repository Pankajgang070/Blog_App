import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import NotFoundPage from "./NotFoundPage";
import articles from "./article-content";
import CommentList from "../components/CommentList";
import AddCommentForm from "../components/AddCommentForm";

const ArticlePage = () => {
  const { articleId } = useParams();
  const [articleInfo, setArticleInfo] = useState({count:0, comments:[]});

  useEffect( ()=>{
    const loadArticleInfo = async () => {
      const response = await axios.get(`/api/articles/${articleId}`);
      const newArticleInfo = response.data;
      setArticleInfo(newArticleInfo);
    };
    loadArticleInfo(); // eslint-disable-next-line
  },[]);  

  const article = articles.find(article => article.name === articleId);

  const addupVotes = async () => {
    const response = await axios.put(`/api/articles/${articleId}/upvote`);
    const updatedArticle = response.data;
    setArticleInfo(updatedArticle);
  }

  if (!article) {
    return <NotFoundPage />;
  }
  return (
    <>
      <h1>{article.name}</h1>
      <div id="upvotes-section">
        <button onClick={addupVotes}>upVote</button>
        <p>This article has {articleInfo.count} upVote(s)!</p>
      </div>
      {article.content.map((para, i) => (
        <p key={i}>{para}</p>
      ))}
      <AddCommentForm articleName={articleId} onArticleUpdate={updatedArticle => setArticleInfo(updatedArticle)} />
      <CommentList comments={articleInfo.comments} />
    </>
  );
};

export default ArticlePage;
