import express from "express";

import { db, connectToDB } from "./db.js";

const app = express();

app.use(express.json());

app.get("/api/articles/:name", async (req, res) => {

    const {name} = req.params;
    const article = await db.collection('articles').findOne({name});

    if(article) {
        res.json(article);
    } else {
        res.sendStatus(404);
    }
});

app.put("/api/articles/:name/upvote", async (req, res)=> {
    const {name} = req.params;
    await db.collection('articles').updateOne({name}, { $inc: {count: 1} });

    const article = await db.collection('articles').findOne({name});

    if(article){
        res.json(article);
    } else {
        res.sendStatus(404);
    }
});

app.post("/api/articles/:name/comments", async (req,res)=> {
        const {name} = req.params;
        const {postedBy, text} = req.body;
        await db.collection('articles').updateOne({name}, { $push: {comments : {postedBy, text}} });

        const article = await db.collection('articles').findOne({name});

        if(article){
            res.send(article);
        } else {
            res.sendStatus(404);
        }
});


connectToDB(() => {
    app.listen(5000, ()=>{
        console.log("App is listening at port 5000!");
    })
});
