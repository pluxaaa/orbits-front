import axios from 'axios';

export const deleteTransferRequest = async (userToken = '', reqID: number): Promise<string> => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + userToken,
    },
  };

  return axios.delete(`/api/transfer_requests/${encodeURIComponent(reqID)}/delete`, config)
    .then((response) => response.data);
};
