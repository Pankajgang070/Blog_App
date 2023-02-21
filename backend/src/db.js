import { MongoClient } from 'mongodb';

let db;

async function connectToDB(cb){
    const client = new MongoClient(`mongodb+srv://${process.env.MONGO_USER_NAME}:${process.env.MONGO_PASSWORD}@cluster0.owwqhvl.mongodb.net/?retryWrites=true&w=majority`);
    await client.connect();
    db = client.db('myFirstDatabase');
    cb();
};

export {
    db,
    connectToDB
};