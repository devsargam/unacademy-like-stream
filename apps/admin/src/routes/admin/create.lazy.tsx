import React, { useEffect } from 'react'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useCreateRoomMutation } from '../../mutations/create-room'

export const Route = createLazyFileRoute('/admin/create')({
  component: CreateRoom,
})

function CreateRoom() {
  const { mutate: createRoom, data } = useCreateRoomMutation()

  const handleCreateRoom = () => {
    createRoom()
  }

  return <>
    <button onClick={handleCreateRoom}>Create Room</button>
    <div className='text-red-600'>{JSON.stringify(data, null, 2)}</div>
  </>
}
