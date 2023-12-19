import { OrbitOrder } from "./ds";

import axios from "axios";

export const getOrbitOrder = async (reqID: number, userToken = ''): Promise<OrbitOrder[]> => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + userToken,
        },
    };
    return axios.post('/api/transfer_to_orbit/get_order', reqID, config)
        .then((response) => {
            const { data } = response;
            return data;
        })
        .catch((error) => {
            throw error;
        });
};
