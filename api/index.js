import app from '../server/server.js';

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true
  }
};

export default function handler(req, res) {
  return app(req, res);
}
