import express from "express";
import fs from "fs";
import path from "path";
import 'dotenv/config';
import admim from "firebase-admin";
import { fileURLToPath } from "url";

import { db, connectToDB } from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, '../build')));

const credentials = JSON.parse(fs.readFileSync("./credentials.json"));
admim.initializeApp({credential: admim.credential.cert(credentials)});

app.get(/^(?!\/api).+/, (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
});

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
                $inc: {counts: 1}, 
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

const PORT = process.env.PORT || 5000;


connectToDB(() => {
    app.listen(PORT, ()=>{
        console.log("App is listening at port " + PORT);
    })
});
