export interface Client {
    _id?: string;
    userAgent: string;
    browser: string;
    browserVersion: string;
    os: string;
    osVersion: string;
    device: string;
    deviceVersion: string;
    jsEnabled: boolean;
    screenWidth?: number;
    screenHeight?: number;
};

export interface Request {
    _id?: string;
    clientId: string;
    time: Date;
};
