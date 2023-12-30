import axios from 'axios';

const updateTransfersOrder = async (
    userToken = '', 
    transferID: number, 
    transfersOrder:{ [orbit: string]: number }) => {
        
    const updateTransfersOrderBody = {
        req_id: transferID,
        transfer_order: transfersOrder,
    };

    try {
        const response = await axios.put('/api/transfer_to_orbit/update_order', updateTransfersOrderBody, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + userToken,
            },
        });

        if (!response.data) {
            throw new Error('Ошибка обновления порядка перелетов');
        }

        return response.data;
    } catch (error) {
        console.error('Ошибка обновления порядка перелетов:', error);
        throw error;
    }
};

export { updateTransfersOrder };
