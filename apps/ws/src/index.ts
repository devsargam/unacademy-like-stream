import cors from '@fastify/cors'
import websocketPlugin from '@fastify/websocket'
import fastify from 'fastify'
import { makeOrLoadRoom } from './rooms'
import { unfurl } from './unfurl'
import { loadAsset, storeAsset } from './assets'
import { nanoid } from 'nanoid'

const PORT = 5858;

// For this example we use a simple fastify server with the official websocket plugin
// To keep things simple we're skipping normal production concerns like rate limiting and input validation.
const app = fastify()
app.register(websocketPlugin)
app.register(cors, { origin: '*' })

const socketMap = new Map<string, WebSocket>()
const roomMap = new Map<string, string[]>()

enum MessageType {
  JOIN = 'join',
  CHANGE_SLIDE = 'change_slide',
  LEAVE = 'leave',
}

app.register(async (app) => {
  // This is the main entrypoint for the multiplayer sync
  app.get('/connect/:roomId', { websocket: true }, async (socket, req) => {
    // The roomId comes from the URL pathname
    const roomId = (req.params as any).roomId as string
    // The sessionId is passed from the client as a query param,
    // you need to extract it and pass it to the room.
    const sessionId = (req.query as any)?.['sessionId'] as string

    // Here we make or get an existing instance of TLSocketRoom for the given roomId
    const room = await makeOrLoadRoom(roomId)
    // and finally connect the socket to the room
    room.handleSocketConnect({ sessionId, socket })
  })

  app.get('/', { websocket: true }, async (socket, req) => {
    socket.on('message', (message) => {
      const data = JSON.parse(message.toString())
      switch (data.type) {
        case MessageType.JOIN: {
          const socketId = nanoid()
          socketMap.set(socketId, socket)
          const roomId = data.roomId as string
          if (!roomMap.has(roomId)) {
            roomMap.set(roomId, [])
          }

          roomMap.get(roomId)?.push(socketId);
          socket.send(JSON.stringify({ type: 'socket_id', socketId, roomId: roomId }))
          break;
        }
        case MessageType.CHANGE_SLIDE: {
          const { roomId, slideIndex } = data as { socketId: string; roomId: string; slideIndex: number }
          const sockets = roomMap.get(roomId)
          if (sockets) {
            sockets.forEach((socketId) => {
              console.log('broadcasting to', socketId);
              const socket = socketMap.get(socketId)
              if (socket) {
                socket.send(JSON.stringify({ type: 'change_slide', socketId, slideIndex }))
              }
            })
          }
          break;
        }
      }
    })
  })

  // To enable blob storage for assets, we add a simple endpoint supporting PUT and GET requests
  // But first we need to allow all content types with no parsing, so we can handle raw data
  app.addContentTypeParser('*', (_, __, done) => done(null))
  app.put('/uploads/:id', {}, async (req, res) => {
    const id = (req.params as any).id as string
    await storeAsset(id, req.raw)
    res.send({ ok: true })
  })
  app.get('/uploads/:id', async (req, res) => {
    const id = (req.params as any).id as string
    const data = await loadAsset(id)
    res.send(data)
  })

  // To enable unfurling of bookmarks, we add a simple endpoint that takes a URL query param
  app.get('/unfurl', async (req, res) => {
    const url = (req.query as any).url as string
    res.send(await unfurl(url))
  })
})

app.listen({ port: PORT }, (err) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }

  console.log(`Server started on port ${PORT}`)
})