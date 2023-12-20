import { Orbit } from './ds';
import axios from 'axios';

export const editOrbit = async (userToken = '', orbit: Orbit): Promise<Orbit> => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + userToken,
    },
  };
  
  const { ID, Name, Apogee, Perigee, Inclination, Description, ImageURL } = orbit;

  try {
    const response = await axios.put(
      `/api/orbits/${encodeURIComponent(Name)}/edit`,
      {
        ID,
        Name,
        Apogee,
        Perigee,
        Inclination,
        Description,
        ImageURL
      },
      config
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};
