import axios from 'axios';

const updateVisitNumbers = async (userToken = '', transferID: number, visitNumbers:{ [orbit: string]: number }) => {
    const updateVisitNumbersBody = {
        req_id: transferID,
        visit_order: visitNumbers,
    };

    try {
        const response = await axios.put('/api/transfer_to_orbit/update_order', updateVisitNumbersBody, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + userToken,
            },
        });

        if (!response.data) {
            throw new Error('Failed to update visit numbers');
        }
        console.log('Visit numbers updated successfully');

        return response.data;
    } catch (error) {
        console.error('Error updating visit numbers:', error);
        throw error;
    }
};

export { updateVisitNumbers };
