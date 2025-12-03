import app from '../server/server.js';

export const config = {
    api: {
        bodyParser: false,
        externalResolver: true
    }
};

export default function handler(req, res) {
    // Handle OPTIONS preflight
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        return res.status(200).end();
    }

    return app(req, res);
}
