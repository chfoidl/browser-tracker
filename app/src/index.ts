import useragent from 'useragent';

import {startServer} from './server/index';
import {loadConfig, handleSignals} from './boot';
import {connectDatabase} from './db';

useragent(true);

const start = async () => {
    await loadConfig();
    await connectDatabase();

    handleSignals();

    startServer();
};

start();
