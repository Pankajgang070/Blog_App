import axios from "axios";
import { useState } from "react";

import useUser from "../hooks/useUser"

const AddCommentForm = ({ articleName, onArticleUpdate }) => {
    const [text, setText] = useState("");

    const {user} = useUser();

    const addComment = async () => {

        const token = user && await user.getIdToken();
        const headers = token ? {authToken: token} : {};

        const response = await axios.post(`/api/articles/${articleName}/comments`, {
            text: text
        }, {headers});

        const updatedArticle = response.data;
        onArticleUpdate(updatedArticle);
    }

    return (<>
        <div id="add-comment-form">
            <h3>Add a Comment</h3>
            {user && <p> You are posting as {user.email} </p>}  
            <textarea rows="4" cols="50" value={text} onChange={e => setText(e.target.value)} />
            <button onClick={addComment}> Add Comment </button>
        </div>
    </>);
};

export default AddCommentForm;