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
      allOrbits: orbitsData,
      reqID: 0,
    };
  }
};

export const orbitsData = [
  {
      ID: 1,
      Name: 'Геостационарная орбита',
      IsAvailable: true,
      Apogee: '35786',
      Perigee: '35786',
      Inclination: '0',
      Description: '',
      ImageURL: '../GEO.png'
  },
  {
      ID: 2,
      Name: 'Низкая околоземная орбита',
      IsAvailable: true,
      Apogee: '1000',
      Perigee: '1000',
      Inclination: '0',
      Description: '',
      ImageURL: '../LEO.png'
  },
  {
    ID: 6,
    Name: 'Молния',
    IsAvailable: true,
    Apogee: '12',
    Perigee: '21',
    Inclination: '63.4',
    Description: '',
    ImageURL: '../Molniya.png'
  }]
