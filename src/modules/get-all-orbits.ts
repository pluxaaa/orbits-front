import axios from 'axios';
import { Orbit } from './ds';

export const getAllOrbits = async (orbitName = ''): Promise<Orbit[]> => {
  try {
    const response = await axios.get(`/api/orbits?orbit_name=${encodeURIComponent(orbitName)}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching orbits:', error);
    return [{
      "ID": 1,
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
