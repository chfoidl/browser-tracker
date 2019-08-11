import {getClientCursor} from '../db';
import { Client } from '../db/models';
import {Request, Response} from 'express';
import {table} from 'table';

interface BrowserOverview {
    name: string;
    count: number;
    percentage: number;
}

export const handleStatsOverview = async (_: Request, res: Response) => {
    const clientCursor = getClientCursor();

    let total = 0;
    const browsers: { [key: string]: BrowserOverview } = {};

    await clientCursor.forEach((client: Client) => {
        const key = client.browser.toLowerCase();

        if (!browsers[key]) {
            browsers[key] = {
                name: client.browser,
                count: 1,
                percentage: 0
            };
        } else {
            browsers[key].count = browsers[key].count + 1;
        }

        total++;
    });

    const data = [
        ['Browser', 'Count', 'Percentage']
    ];

    Object.keys(browsers)
        .sort((a, b) => {
            return browsers[b].count - browsers[a].count;
        })
        .forEach(key => {
            const b = browsers[key];
            const p = b.count * 100 / total;

            data.push(
                [b.name, b.count.toString(), p.toFixed(2) + '%']
            );
        });

    res.send(table(data));
};
