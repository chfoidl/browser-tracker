import express from 'express';
import {handleRequest} from './handler';
import {getConfig} from '../boot';
import {Server} from 'http';
import cookieParser from 'cookie-parser';
import {handleStatsOverview} from '../stats/handler';

let server: Server = null;

const port = 80;
const app = express();

const handleServerStart = () => {
    console.log(`Browser-Tracker listening on port ${port}.`);
};

export const startServer = () => {
    app.use(cookieParser());

    app.get('/', handleRequest);
    app.get('/stats', handleStatsOverview);

    server = app.listen(port, handleServerStart);
};

export const stopServer = () => new Promise(resolve => {
    if (server === null) {
        resolve();
    }

    server.close(resolve);
});
