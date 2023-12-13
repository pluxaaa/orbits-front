import axios from "axios";

export const setRequestOrbits = async(request_id = 0, orbit_names: string[], userToken='') : Promise<string> => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + userToken,
        },
    }
    return axios.put(
        '/api/transfer_requests/set_orbits',
        {
            requestID: request_id,
            orbits: orbit_names
        },
        config
    )
    .then((response) => response.data)
}