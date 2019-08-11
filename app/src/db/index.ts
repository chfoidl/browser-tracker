import {getConfig} from '../boot';
import {MongoClient, Db, MongoError} from 'mongodb';
import {Client, Request} from './models';

let client: MongoClient = null;
let db: Db = null;

export const connectDatabase = async () => {
    const config = getConfig();
    const url = `mongodb://${config.dbUser}:${config.dbPass}@${config.dbHost}:${config.dbPort}`;

    client = new MongoClient(url, {
        useNewUrlParser: true
    });

    await client.connect();

    db = client.db(config.dbName);
};

export const closeDatabase = () => new Promise(resolve => {
    if (client === null) {
        resolve();
    }

    client.close(resolve);
});

export const saveClient = async (client: Client) => {
    const clientCollection = db.collection('clients');

    try {
        const result = await clientCollection.insertOne(client);

        if (result) {
            return result.ops[0] as Client;
        };
    } catch (e) {
        // Catch duplicate key error
        if (e.name === 'MongoError' && e.code === 11000) {
            return client;
        }

        console.error(e);
    }

    return null;
};

export const saveRequest = async (request: Request) => {
    const requestCollection = db.collection('requests');

    await requestCollection.insertOne(request);
};

export const getClientCursor = () => {
    const clientCollection = db.collection('clients');

    return clientCollection.find();
};
