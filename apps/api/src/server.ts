import express, { type Express } from "express";
import morgan from "morgan";
import cors from "cors";
import { AccessToken, Room, RoomServiceClient } from 'livekit-server-sdk';
import "dotenv/config";
import { nanoid } from "nanoid";
import { NotionAPI } from 'notion-client'

interface CreateTokenOptions {
  roomName: string;
  participantName: string;
}


const notion = new NotionAPI()

const createToken = async ({
  roomName,
  participantName,
}: CreateTokenOptions) => {
  // If this room doesn't exist, it'll be automatically created when the first
  // participant joins
  // Identifier to be used for participant.
  // It's available as LocalParticipant.identity with livekit-client SDK

  const at = new AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET, {
    identity: participantName,
    // Token to expire after 10 minutes
    ttl: '24h',
  });
  at.addGrant({ roomJoin: true, room: roomName });
  at.addGrant({ canPublish: true });

  return await at.toJwt();
};

export const createServer = (): Express => {
  const app = express();
  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(express.urlencoded({ extended: true }))
    .use(express.json())
    .use(cors({ origin: '*' }))

  app.post('/getToken', async (req, res) => {
    // TODO: Validate the request body with zod
    const { roomName, participantName } = req.body;

    const token = await createToken({ roomName, participantName });
    return res.json({ token });
  });

  app.post('/createRoom', async (req, res) => {
    const livekitHost = 'http://localhost:7880';
    const roomService = new RoomServiceClient(livekitHost, process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET);

    const opts = {
      name: nanoid(),
      emptyTimeout: 10 * 60, // 10 minutes
      maxParticipants: 20,
    };

    roomService.createRoom(opts).then((room: Room) => {
      console.log('room created', room);
      return res.json({ room });
    });
  });

  app.get('/getPdf/:id', async (req, res) => {
    const recordMaps = await Promise.all([
      notion.getPage('14382f1740e4800ca6ddcc9d89c9e355'),
      notion.getPage('14382f1740e480fba245f8990fe7bf88'),
      notion.getPage('14382f1740e480f7974bd74c0a964d52')
    ])

    return res.json({ recordMaps })
  });

  return app;
};
