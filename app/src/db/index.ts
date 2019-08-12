import {getConfig} from '../boot';
import {MongoClient, Db, ObjectID} from 'mongodb';
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

    if (client._id) {
        const existingClient = clientCollection.findOne({ '_id': ObjectID(client._id) });

        if (existingClient) {
            return existingClient;
        } else {
            delete client._id;
        }
    }

    const result = await clientCollection.insertOne(client);

    if (result) {
        return result.ops[0] as Client;
    };

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
