import * as React from 'react'
import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { nanoid } from 'nanoid'
import { useGetAccessToken } from '../../fetchers/get-access-token'
import {
  ControlBar,
  GridLayout,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  useChat,
  useTracks,
} from '@livekit/components-react';
import '@livekit/components-styles';
import { Track } from 'livekit-client';
import axios from 'axios';
import { NotionRenderer } from 'react-notion-x'
import 'react-notion-x/src/styles.css'
import { TldrawComp } from '../../components/tldraw-comp';
import './style.css'
import BottomBar from '../../components/bottom-bar';


const serverUrl = 'ws://127.0.0.1:7880';

export const Route = createFileRoute('/join/$id')({
  loader: async ({ params }) => {
    return await axios.get(`http://localhost:5001/getPdf/${params.id}`).then(res => res.data);
  },
  component: JoinRoom,
})

const username = nanoid()
function JoinRoom() {
  const { id } = Route.useParams()
  const { recordMaps } = Route.useLoaderData()
  const [currentTab, setCurrentTab] = React.useState<'slides' | 'whiteboard' | 'zoom'>('slides')

  // Ask the person for the username
  // const [username, setUsername] = React.useState('')
  // Use nanoid for now
  // Get the token
  const { data: tokenData, isLoading: isLoadingToken, isError: isErrorToken } = useGetAccessToken(id, username)

  if (isLoadingToken) {
    return <div>Loading...</div>
  }

  if (isErrorToken) {
    return <div>Error</div>
  }
  return (
    <div className='flex flex-col h-full'>
      <BottomBar currentTab={currentTab} setCurrentTab={setCurrentTab} />
      <LiveKitRoom
        video={true}
        audio={true}
        token={tokenData.token}
        serverUrl={serverUrl}
        data-lk-theme="default"
        style={{ height: 'calc(100vh - 48px)', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
      >
        {currentTab === 'slides' && <ChangeSlide recordMaps={recordMaps} />}
        {currentTab === 'whiteboard' && <TldrawComp roomId={id} />}
        {currentTab === 'zoom' && <div className='relative'>
          {/* Your custom component with basic video conferencing functionality. */}
          <MyVideoConference />
          {/* The RoomAudioRenderer takes care of room-wide audio for you. */}
          <RoomAudioRenderer />
          {/* Controls for the user to start/stop audio, video, and screen
           share tracks and to leave the room. */}
          <div className='absolute bottom-0 left-0 right-0'>
            <ControlBar />
          </div>
        </div>
        }
        <ChatComponent />
      </LiveKitRoom>
    </div>
  );
}
function MyVideoConference() {
  // `useTracks` returns all camera and screen share tracks. If a user
  // joins without a published camera track, a placeholder track is returned.
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );
  return (
    <>
      <GridLayout tracks={tracks} style={{ height: 'calc(100vh - 48px)' }}>
        {/* The GridLayout accepts zero or one child. The child is used
      as a template to render all passed in tracks. */}
        <ParticipantTile />
      </GridLayout>
    </>
  );
}

function ChatComponent() {
  const { chatMessages, isSending, send, update } = useChat()
  const [message, setMessage] = React.useState('')

  const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    send(message)
    setMessage('')
  }

  return <div className='flex flex-col justify-between'>
    <div className='flex flex-col gap-y-2'>
      <h1 className='text-2xl font-bold text-white'>Chat</h1>
      <div className='flex flex-col gap-x-2'>
        {chatMessages.map((message) => (
          <div key={message.id} className='text-white'><span className='font-bold'>{message.from?.name}</span>: {message.message}</div>
        ))}
      </div>
    </div>
    <form onSubmit={handleSend} className='flex gap-y-0.5 flex-col'>
      <input type="text" className='border border-white' value={message} autoFocus onChange={(e) => setMessage(e.target.value)} />
      <button type='submit' className='bg-blue-500 hover:bg-blue-700 text-white font-boldk px-4 rounded'>Send</button>
    </form>
  </div >
}

function ChangeSlide({ recordMaps }: { recordMaps: any[] }) {
  const [index, setIndex] = React.useState(0)
  const socket = React.useRef<WebSocket | null>(null)
  const socketId = React.useRef<string | null>(null)
  const roomId = React.useRef<string | null>(null)

  React.useEffect(() => {
    if (!socket.current) {
      socket.current = new WebSocket('ws://127.0.0.1:5858')
    }

    if (!socket.current) return;

    socket.current.onopen = () => {
      socket.current?.send(JSON.stringify({ type: 'join', roomId: 1 }))
    }

    socket.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case 'socket_id': {
          roomId.current = data.roomId
          socketId.current = data.socketId
          break;
        }

        case 'change_slide': {
          console.log('change slide from server', data.slideIndex)
          setIndex(data.slideIndex)
          break;
        }
      }
    }
  }, [])

  const changeSlide = async (i: number) => {
    if (!socket.current) return;
    console.log('change slide from client', i)
    socket.current.send(JSON.stringify({ type: 'change_slide', roomId: roomId.current, slideIndex: i }))
  }


  return <div>
    <div className='flex flex-row justify-between'>
      <button onClick={() => {
        setIndex((prev) => {
          const res = Math.max(prev - 1, 0)
          changeSlide(res)
          return res
        })
      }
      }>{index > 0 && "Prev"}</button>
      <button onClick={() => {
        setIndex((prev) => {
          const res = Math.min(prev + 1, recordMaps.length - 1)
          changeSlide(res)
          return res
        })
      }}>{index < recordMaps.length - 1 && "Next"}</button>
    </div>
    <NotionRenderer recordMap={recordMaps[index]} header={false} darkMode={true} />
  </div >
}