import axios, { AxiosResponse } from "axios";

export const createTransferReq = async(userToken: string): Promise<AxiosResponse> => {
    const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + userToken,
        },
      }
    return axios.post(
        `/api/transfer_requests/create`,
        config

    )
    .then((response) => response);
}