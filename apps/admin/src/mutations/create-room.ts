import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface Room {
  sid: string;
  name: string;
  emptyTimeout: number;
  maxParticipants: number;
  creationTime: string;
  turnPassword: string;
  enabledCodecs: Codec[];
  metadata: string;
  numParticipants: number;
  activeRecording: boolean;
  numPublishers: number;
  departureTimeout: number;
}

interface Codec {
  mime: string;
  fmtpLine: string;
}

interface RoomResponse {
  room: Room;
}


const createRoom = async (): Promise<RoomResponse> => {
  const response = await axios.post('http://localhost:5001/createRoom', {});
  return response.data as RoomResponse;
};

export const useCreateRoomMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRoom,
    onSuccess: () => {
      // Invalidate or refetch relevant queries here, if necessary
      // queryClient.invalidateQueries(['rooms']); // Adjust 'rooms' key to match your query key
    },
    onError: (error: any) => {
      console.error('Failed to create room:', error);
    },
  });
};