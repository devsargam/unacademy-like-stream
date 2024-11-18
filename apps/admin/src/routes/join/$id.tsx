import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/join/$id')({
  loader: async ({ params }) => {
    return {
      id: params.id,
    }
  },
  component: JoinRoom,
})

function JoinRoom() {
  const { id } = Route.useParams()

  // Ask the person for the username
  const [username, setUsername] = React.useState('')
  // Get the token

  // Join the room
  return <div className='text-red-600'>Hello {id}</div>
}
