import { TransferRequest } from './ds'
import axios from 'axios';

export const changeReqStatusModer = async (userToken = '', request: TransferRequest): Promise<string> => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + userToken,
    },
  }
  return axios.put(
    `/api/transfer_requests/${encodeURIComponent(request.ID)}/change_status_moder`,
    {
      status: request.Status,
    },
    config

  )
    .then((response) => response.data);
}