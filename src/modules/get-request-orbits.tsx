import { Orbit } from "./ds"

import axios from "axios"

export const getRequestOrbits = async(request_id = 0, userToken = ''): Promise<Orbit[]> => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + userToken,
        },
    }
    return axios.get(
        '/api/transfer_to_orbit/' +  String(request_id),
        config)
        .then((response) => {
            const {data} = response

            return data;
        })
}