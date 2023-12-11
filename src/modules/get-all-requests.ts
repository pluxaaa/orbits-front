import axios from 'axios'

import {TransferRequest} from './ds'

export const getTransfReqs = async (userToken = '', status = ''): Promise<TransferRequest[]> => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + userToken,
        },
    }
    return axios.get(
        `/api/transfer_requests` + status,
        config,
    )
    .then((response) => {
        const { data } = response
        console.log(data)
        return data;
    }) 

}