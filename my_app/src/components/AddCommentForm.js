import axios from "axios";
import { useState } from "react";

const AddCommentForm = ({ articleName, onArticleUpdate }) => {
    const [name, setName] = useState("");
    const [text, setText] = useState("");

    const addComment = async () => {
        const response = await axios.post(`/api/articles/${articleName}/comments`, {
            postedBy: name,
            text: text
        });
        const updatedArticle = response.data;
        onArticleUpdate(updatedArticle);
    }

    return (<>
        <div id="add-comment-form">
            <h3>Add a Comment</h3>
            <label>
                Name:
                <input type="text" value={name} onChange={e => setName(e.target.value)} />
            </label>
            <label>
                Comment:
                <textarea rows="4" cols="50" value={text} onChange={e => setText(e.target.value)} />
            </label>
            <button onClick={addComment}> Add Comment </button>
        </div>
    </>);
};

export default AddCommentForm;