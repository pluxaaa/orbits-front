import axios from 'axios';
import { Orbit } from './ds';

export const getAllOrbits = async (orbitName = '', orbitIncl = '', orbitIsCircle = ''): Promise<Orbit[]> => {
  try {
    const queryParams = new URLSearchParams({
      orbit_name: orbitName,
      orbit_incl: orbitIncl,
      is_circle: orbitIsCircle,
    });

    const response = await axios.get(`/api/orbits?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении орбит:', error);
    return [{
      "ID": 0,
      "Name": "Нет информации",
      "IsAvailable": false,
      "Apogee": "Нет информации",
      "Perigee": "Нет информации",
      "Inclination": "Нет информации",
      "Description": "Нет информации",
      "ImageURL": "./DEFAULT.jpg"
    }];
  }
};
