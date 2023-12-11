import axios from 'axios';
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
        return {
            "ID": 1,
            "Name": "Нет информации",
            "IsAvailable": false,
            "Apogee": "Нет информации",
            "Perigee": "Нет информации",
            "Inclination": "Нет информации",
            "Description": "Нет информации",
            "ImageURL": "./DEFAULT.jpg"
        };
    }
};
