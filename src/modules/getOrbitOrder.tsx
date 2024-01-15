import axios from "axios";
import { Orbit } from "./ds";

interface OrbitOrder {
    orbit: Orbit;
    transfer_order: number;
}

export const getOrbitOrder = async (reqID: number, userToken = ''): Promise<OrbitOrder[]> => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + userToken,
        },
    };
    return axios.get(`/api/transfer_requests/get_order/${reqID}`, config)
        .then((response) => {
            const { data } = response;
            return data;
        })
        .catch((error) => {
            throw error;
        });
};
