import axios, { AxiosResponse } from "axios";

export const deleteOrbitTransfer = async(orbit: string, req: string | null, userToken: string): Promise<AxiosResponse> => {
    const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + userToken,
        },
    };

    return axios.delete(
        `/api/transfer_to_orbit/delete_single`,
        {
            headers: config.headers,
            data: {
                orbit: orbit,
                req: req
            },
        }
    )
    .then((response) => response);
}
