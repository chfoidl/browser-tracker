let tinyImageSource: Buffer = null;

export const getTinyImageSource = () => {
    if (tinyImageSource === null) {
        const b64Data = 'R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';

        tinyImageSource = Buffer.from(b64Data, 'base64');
    }

    return tinyImageSource;
};
