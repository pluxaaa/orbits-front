import axios from "axios";

interface OrbitOrder {
    orbit_name: string;
    transfer_order: number;
}

export const getOrbitOrder = async (reqID: number, userToken = ''): Promise<OrbitOrder[]> => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + userToken,
        },
    };
    return axios.get(`/api/transfer_to_orbit/get_order/${reqID}`, config)
        .then((response) => {
            const { data } = response;
            return data;
        })
        .catch((error) => {
            throw error;
        });
};
