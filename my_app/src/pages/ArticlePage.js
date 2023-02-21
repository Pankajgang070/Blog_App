import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import NotFoundPage from "./NotFoundPage";
import articles from "./article-content";
import CommentList from "../components/CommentList";
import AddCommentForm from "../components/AddCommentForm";
import useUser from "../hooks/useUser";

const ArticlePage = () => {
  const { articleId } = useParams();
  const [articleInfo, setArticleInfo] = useState({count:0, comments:[], canUpvote: false});

  const {user, isLoading} = useUser();

  useEffect( ()=>{
    const loadArticleInfo = async () => {

      const token = user && await user.getIdToken();
      const headers = token ? {authToken: token} : {};

      const response = await axios.get(`/api/articles/${articleId}`, {headers});
      const newArticleInfo = response.data;
      setArticleInfo(newArticleInfo);
    };
    if(!isLoading) {
      loadArticleInfo();
    } 
  },[isLoading, user, articleId]);  

  const article = articles.find(article => article.name === articleId);

  const addupVotes = async () => {

    const token = user && await user.getIdToken();
    const headers = token ? {authToken: token} : {};

    const response = await axios.put(`/api/articles/${articleId}/upvote`, null, {headers});
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
        {user ? 
        <button onClick={addupVotes}>{!article.canUpvote ? "UpVote" : "Already Upvoted"}</button> :
        <button> Login to UpVote</button> }
        <p>This article has {articleInfo.count} upVote(s)!</p>
      </div>
      {article.content.map((para, i) => (
        <p key={i}>{para}</p>
      ))}
      {user ? 
      <AddCommentForm articleName={articleId} onArticleUpdate={updatedArticle => setArticleInfo(updatedArticle)} /> :
      <button> Login to Comment </button> }
      <CommentList comments={articleInfo.comments} />
    </>
  );
};

export default ArticlePage;
