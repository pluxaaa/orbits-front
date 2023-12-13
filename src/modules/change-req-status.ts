import { TransferRequest } from './ds'
import axios from 'axios';

export const changeReqStatus = async (userToken = '', request: TransferRequest): Promise<string> => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + userToken,
    },
  }
  return axios.put(
    '/api/transfer_requests/change_status',
    {
      reqID: request.ID,
      status: request.Status,
    },
    config

  )
    .then((response) => response.data);
}