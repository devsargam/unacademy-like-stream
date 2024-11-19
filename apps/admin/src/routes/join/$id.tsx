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
    <div className='flex flex-row h-full'>
      <LiveKitRoom
        video={true}
        audio={true}
        token={tokenData.token}
        serverUrl={serverUrl}
        data-lk-theme="default"
        style={{ height: '100vh', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
      >
        <ChangeSlide recordMaps={recordMaps} />
        {/* <TldrawComp roomId={id} /> */}
        <div>
          {/* Your custom component with basic video conferencing functionality. */}
          {/* <MyVideoConference /> */}
          {/* The RoomAudioRenderer takes care of room-wide audio for you. */}
          {/* <RoomAudioRenderer /> */}
          {/* Controls for the user to start/stop audio, video, and screen
           share tracks and to leave the room. */}
          {/* <ControlBar /> */}
        </div>
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
      <GridLayout tracks={tracks} style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}>
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
    <div className='flex flex-col gap-x-2'>
      {chatMessages.map((message) => (
        <div key={message.id} className='text-white'><span className='font-bold'>{message.from?.name}</span>: {message.message}</div>
      ))}
    </div>
    <form onSubmit={handleSend} className='flex gap-y-0.5 flex-col'>
      <input type="text" value={message} autoFocus onChange={(e) => setMessage(e.target.value)} />
      <button type='submit' className='bg-blue-500 hover:bg-blue-700 text-white font-boldk px-4 rounded'>Send</button>
    </form>
  </div >
}

function ChangeSlide({ recordMaps }: { recordMaps: any[] }) {
  const [slideIndex, setSlideIndex] = React.useState(0)

  return <div>
    <div className='flex flex-row justify-between'>
      <button onClick={() => setSlideIndex((prev) => Math.max(prev - 1, 0))}>{slideIndex > 0 && "Prev"}</button>
      <button onClick={() => setSlideIndex((prev) => Math.min(prev + 1, recordMaps.length - 1))}>{slideIndex < recordMaps.length - 1 && "Next"}</button>
    </div>
    <NotionRenderer recordMap={recordMaps[slideIndex]} header={false} darkMode={true} />
  </div>
}