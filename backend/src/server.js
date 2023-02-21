import express from "express";
import fs from "fs";
import admim from "firebase-admin";

import { db, connectToDB } from "./db.js";

const app = express();

app.use(express.json());

const credentials = JSON.parse(fs.readFileSync("./credentials.json"));
admim.initializeApp({credential: admim.credential.cert(credentials)});

app.use(async(req, res, next) => {
    const {authtoken} = req.headers;
    if(authtoken) {
        try {
            req.user = await admim.auth().verifyIdToken(authtoken);
        } catch(e) {
            return res.sendStatus(400);
        }
    }
    req.user = req.user || {};
    next();
});

app.get("/api/articles/:name", async (req, res) => {
    const {uid} = req.user;
    const {name} = req.params;

    const article = await db.collection('articles').findOne({name});

    if(article) {
        const upVoteIds = article.upVoteIds || [];
        if(uid){
            if(upVoteIds.includes(uid)){
                article.canUpvote = false;
            } else {
                article.canUpvote = true;
            }
        }
        // article.canUpvote = uid && !upVoteIds.includes(uid);
        res.json(article);
    } else {
        res.sendStatus(404);
    }
});

app.use((req, res, next) => {
    if(req.user){
        next();
    } else {
        res.sendStatus(401);
    }
});

app.put("/api/articles/:name/upvote", async (req, res)=> {
    const {name} = req.params;
    const {uid} = req.user;

    const article = await db.collection('articles').findOne({name});

    if(article){
        const upVoteIds = article.upVoteIds || [];
        const canUpvote = uid && !upVoteIds.includes(uid);
        
        if(canUpvote){
            await db.collection('articles').updateOne({name}, { 
                $inc: {count: 1}, 
                $push: {upVoteIds: uid} 
            });
        }
        const updatedArticle = await db.collection('articles').findOne({name});
        res.json(updatedArticle);
    } else {
        res.sendStatus(404);
    }
});

app.post("/api/articles/:name/comments", async (req,res)=> {
        const {name} = req.params;
        const {text} = req.body;
        const {email} = req.user;

        await db.collection('articles').updateOne({name}, { $push: {comments : {postedBy: email, text}} });

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
