import axios from 'axios';
import { Orbit } from './ds';

export const getAllOrbits = async (orbitName = '', orbitIncl = '', orbitIsCircle = '', userToken = ''): Promise<{ allOrbits: Orbit[], reqID: number }> => {
  if (userToken === "") {
    userToken = "guest";
  }

  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + userToken,
      'Accept': 'application/json'
    },
  };

  try {
    const queryParams = new URLSearchParams({
      orbit_name: orbitName,
      orbit_incl: orbitIncl,
      is_circle: orbitIsCircle,
    });

    const response = await axios.get(`/api/orbits?${queryParams.toString()}`, config);
    
    const { allOrbits, reqID } = response.data;

    return { allOrbits, reqID };
  } catch (error) {
    console.error('Error fetching orbits:', error);
    return {
      allOrbits: [{
        "ID": 0,
        "Name": "No information",
        "IsAvailable": false,
        "Apogee": "No information",
        "Perigee": "No information",
        "Inclination": "No information",
        "Description": "No information",
        "ImageURL": "./DEFAULT.jpg"
      }],
      reqID: 0,
    };
  }
};
