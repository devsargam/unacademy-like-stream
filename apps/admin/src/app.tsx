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
import React, { useState } from 'react';


const serverUrl = 'ws://127.0.0.1:7880';
const tokens = [
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzIwNDU3MzUsImlzcyI6ImRldmtleSIsIm5hbWUiOiJ0ZXN0X3VzZXIiLCJuYmYiOjE3MzE5NTkzMzUsInN1YiI6InRlc3RfdXNlciIsInZpZGVvIjp7InJvb20iOiJ0ZXN0X3Jvb20iLCJyb29tSm9pbiI6dHJ1ZX19.6H9hmHLGTLYmp1SquFGHa93O-I4rPhpo__lxd8ujZHw',
  'eyJhbGciOiJIUzI1NiJ9.eyJ2aWRlbyI6eyJyb29tSm9pbiI6dHJ1ZSwicm9vbSI6InF1aWNrc3RhcnQtcm9vbSJ9LCJpc3MiOiJkZXZrZXkiLCJleHAiOjE3MzE5NjI3MTIsIm5iZiI6MCwic3ViIjoic2FyZ2FtIn0.ovD9ZNYW-KwV-zcORcYi4i-zw72XZ0jX8Plso1uM9a4'
];

export default function App(): JSX.Element {
  const [token, setToken] = useState(tokens[0]);
  const [submit, setSubmit] = useState(false);

  if (!submit) {
    return (<div >
      <input type="text" value={token} onChange={(e) => setToken(e.target.value)} className='w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow' />
      <button
        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
        onClick={() => setSubmit(true)}>Submit</button>
    </div>
    );
  }

  return (
    <div>
      <LiveKitRoom
        video={true}
        audio={true}
        token={token}
        serverUrl={serverUrl}
        // Use the default LiveKit theme for nice styles.
        data-lk-theme="default"
        style={{ height: '100vh', display: 'flex', flexDirection: 'row' }}
      >
        <div>

          {/* Your custom component with basic video conferencing functionality. */}
          <MyVideoConference />
          {/* The RoomAudioRenderer takes care of room-wide audio for you. */}
          <RoomAudioRenderer />
          {/* Controls for the user to start/stop audio, video, and screen
        share tracks and to leave the room. */}
          <ControlBar />
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
  const [message, setMessage] = useState('')

  const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    send(message)
    setMessage('')
  }

  return <div className='flex flex-col justify-between'>
    <div className='flex flex-col gap-x-2'>
      {chatMessages.map((message) => (
        <div key={message.id}><span className='font-bold'>{message.from?.name}</span>: {message.message}</div>
      ))}
    </div>
    <form onSubmit={handleSend} className='flex gap-y-0.5 flex-col'>
      <input type="text" value={message} autoFocus onChange={(e) => setMessage(e.target.value)} />
      <button type='submit' className='bg-blue-500 hover:bg-blue-700 text-white font-boldk px-4 rounded'>Send</button>
    </form>
  </div >
}
