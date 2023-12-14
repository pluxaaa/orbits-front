import axios, { AxiosError } from 'axios';
import { Orbit } from './ds';

export const getOrbitByName = async (orbitName = ''): Promise<Orbit> => {
    try {
        const response = await axios.get(`/api/orbits/${encodeURIComponent(orbitName)}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Ошибка при получении орбит:', error);
        if ((error as AxiosError).response && (error as AxiosError).response?.status === 404) {
            throw new Error('404');
        } else {
            console.error('Ошибка при получении орбит:', error);
            return {
                "ID": 0,
                "Name": "Нет информации",
                "IsAvailable": false,
                "Apogee": "Нет информации",
                "Perigee": "Нет информации",
                "Inclination": "Нет информации",
                "Description": "Нет информации",
                "ImageURL": "./DEFAULT.jpg"
            };
        }
    }
};
