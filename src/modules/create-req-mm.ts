import axios, { AxiosResponse } from "axios";

export const createOrbitTransferReq = async(orbit: string, userToken: string): Promise<AxiosResponse> => {
    const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + userToken,
        },
      }
    return axios.post(
        `/api/orbits/${encodeURIComponent(orbit)}/add`,
        {
            orbit: orbit
        },
        config

    )
    .then((response) => response);
}