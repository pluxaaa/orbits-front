import axios from "axios"

export const getDistinctClients = async(userToken = ''): Promise<string[]> => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + userToken,
        },
    }
    return axios.get(
        '/api/transfer_requests/distinct_clients',
        config)
        .then((response) => {
            const {data} = response
            return data;
        })
}