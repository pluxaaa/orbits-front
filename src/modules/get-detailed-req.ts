import axios from 'axios';
import { TransferRequest } from './ds';

export const getDetailedReq = async (userToken = '', req_id = ''): Promise<TransferRequest> => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + userToken,
            'Accept': 'application/json'
        },
    };

    try {
        const response = await axios.get(`/api/transfer_requests/${encodeURIComponent(req_id)}`, config);
        const { data } = response;
        console.log(data);
        return data;
    } catch (error) {
        console.error("Ошибка при выполени запроса:", error);
        throw error;
    }
};
