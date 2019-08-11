import * as fs from 'fs';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);

export const getEnvOrSecret = async (envName: string) => {
    const env = process.env[envName];

    if (!env) {
        return null;
    }

    if (envName.endsWith('_FILE')) {
        try {
            const content = await readFile(env);

            return content.toString();
        } catch (e) {
            console.error('Could not read secret at: ' + env);

            process.exit(1);
        }
    }

    return env;
};
