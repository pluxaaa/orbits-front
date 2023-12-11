import axios from 'axios';

export const changeOrbitStatus = async (userToken = '', orbit_name: string): Promise<void> => {
    try {
        const response = await axios.delete(`api/orbits/change_status/${orbit_name}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + userToken,
            },
        });

        if (response.status === 200) {
        } else {
            throw new Error('Ошибка при изменении статуса орбиты');
        }
    } catch (error) {
        throw new Error('Ошибка при изменении статуса орбиты');
    }
};
