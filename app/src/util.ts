import * as fs from 'fs';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);

export const getEnvOrSecret = async (envName: string) => {
    const env = process.env[envName];

    if (env) {
        return env;
    }

    const secret = process.env[envName + '_FILE'];
    if (secret) {
        try {
            const content = await readFile(secret);

            return content.toString().trim();
        } catch (e) {
            console.error('Could not read secret at: ' + secret);

            process.exit(1);
        }
    }

    return null;
};
