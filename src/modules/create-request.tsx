import axios, { AxiosResponse } from "axios";

export const createRequest = async(orbits: string[], userToken: string): Promise<AxiosResponse> => {
    const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + userToken,
        },
      }
    return axios.post(
        '/api/transfer_requests/create',
        {
          'orbits': orbits,
        },
        config

    )
    .then((response) => response);
}