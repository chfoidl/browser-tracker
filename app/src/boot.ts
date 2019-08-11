import {getEnvOrSecret} from './util';
import {stopServer} from './server';
import {closeDatabase} from './db';

export interface Config {
    dbHost: string;
    dbPort: number;
    dbName: string;
    dbUser: string;
    dbPass: string;
}

let config: Config = null;

const validateConfig = () => {
    if (!config.dbName) {
        console.error('db name not set!');

        process.exit(1);
    }

    if (!config.dbUser) {
        console.error('db username not set!');

        process.exit(1);
    }

    if (!config.dbPass) {
        console.error('db password not set!');

        process.exit(1);
    }
};

export const loadConfig = async () => {
    config = {
        dbHost: await getEnvOrSecret('DB_HOST') || 'mongo',
        dbPort: Number(await getEnvOrSecret('DB_PORT')) || 27017,
        dbName: await getEnvOrSecret('DB_NAME'),
        dbUser: await getEnvOrSecret('DB_USER'),
        dbPass: await getEnvOrSecret('DB_PASS')
    };

    validateConfig();
};

export const getConfig = () => {
    if (config === null) {
        console.error('Config not loaded!');

        return null;
    }

    return config;
};

export const handleSignals = () => {
    const handle = async () => {
        await stopServer();
        await closeDatabase();
    };

    process.on('SIGINT', handle);
    process.on('SIGHUP', handle);
    process.on('SIGTERM', handle);
};
