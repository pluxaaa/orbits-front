import axios, {AxiosError} from 'axios';
import { TransferRequest } from './ds';

export const getTransfReqs = async (userToken = '', status = '', dateStart = '', dateFin = ''): Promise<TransferRequest[]> => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + userToken,
        },
    };

    const queryParams = new URLSearchParams({
        status: status,
        date_start: dateStart,
        date_fin: dateFin,
    });

    return axios.get(`/api/transfer_requests?${queryParams.toString()}`, config)
        .then((response) => {
            const { data } = response;
            return data;
        });
};
