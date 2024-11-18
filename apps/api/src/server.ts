import express, { type Express } from "express";
import morgan from "morgan";
import cors from "cors";
import { AccessToken } from 'livekit-server-sdk';
import "dotenv/config";

const createToken = async () => {
  // If this room doesn't exist, it'll be automatically created when the first
  // participant joins
  const roomName = 'test_room';
  // Identifier to be used for participant.
  // It's available as LocalParticipant.identity with livekit-client SDK
  const participantName = 'sargam';

  const at = new AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET, {
    identity: participantName,
    // Token to expire after 10 minutes
    ttl: '24h',
  });
  at.addGrant({ roomJoin: true, room: roomName });

  return await at.toJwt();
};
let i = 0;

export const createServer = (): Express => {
  const app = express();
  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(express.urlencoded({ extended: true }))
    .use(express.json())
    .use(cors({ origin: '*' }))

  app.get('/getToken', async (req, res) => {
    const token = await createToken();
    return res.json({ token });
  });


  app.get("/turn", (req, res) => {
    i++;
    return res.json({ index: i });
  });

  return app;
};
