import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getToken = async (roomName: string, participantName: string): Promise<{ token: string }> => {
  const response = await axios.post<{
    token: string;
  }>('http://localhost:5001/getToken', {
    roomName,
    participantName,
  });
  return response.data;
};

export const useGetAccessToken = (roomName: string, participantName: string) => {
  return useQuery({
    queryKey: ['getAccessToken', roomName, participantName],
    queryFn: () => getToken(roomName, participantName),
  });
};
