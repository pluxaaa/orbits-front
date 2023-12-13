import axios from "axios";

export const createRequest = async(orbits: string[], userToken: string): Promise<string> => {
    const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + userToken,
        },
      }
    return axios.put(
        '/api/transfer_requests/change_status',
        {

        },
        config

    )
    .then((response) => response.data);
}