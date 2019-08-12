import {Request, Response} from 'express';
import useragent from 'useragent';
import {ObjectID} from 'mongodb';
import {getTinyImageSource} from './response';
import { Client, Request as IRequest } from '../db/models';
import {saveClient, saveRequest} from '../db';

const COOKIE_NAME = 'bt-id';

export const handleRequest = async (req: Request, res: Response) => {
    try {
        const js = Boolean(req.query.js);
        const screenWidth = Number(req.query.screenWidth) || null;
        const screenHeight = Number(req.query.screenHeight) || null;
        const userAgentString = req.header('User-Agent');

        const parts = useragent.lookup(userAgentString);

        const client: Client = {
            userAgent: userAgentString,
            browser: parts.family,
            browserVersion: parts.toVersion(),
            os: parts.os.family,
            osVersion: parts.os.toVersion(),
            device: parts.device.family,
            deviceVersion: parts.device.toVersion(),
            jsEnabled: js
        };

        if (screenWidth) {
            client.screenWidth = screenWidth;
        }

        if (screenHeight) {
            client.screenHeight = screenHeight;
        }

        const btId = req.cookies[COOKIE_NAME] as string;
        if (btId && btId.length === 24) {
            client._id = ObjectID(btId);
        }

        const persistedClient = await saveClient(client);

        if (persistedClient) {
            res.cookie(COOKIE_NAME, persistedClient._id.toString(), {
                expires: new Date(Date.now() + 3155692600000),
                httpOnly: true
            })

            const request: IRequest = {
                clientId: persistedClient._id,
                time: new Date()
            };

            await saveRequest(request);
        };
    } catch (e) {
        console.error('Error: ' + e);
    }

    const img = getTinyImageSource();

    res.writeHead(200, {
        'Content-Type': 'image/gif',
        'Content-Length': img.length
    });
    res.end(img);
};
