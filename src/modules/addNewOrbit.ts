import { Orbit } from './ds'
import axios from 'axios';

export const addNewOrbit = async (userToken = '', orbit: Orbit): Promise<Orbit> => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + userToken,
    },
  }
  return axios.post(
    `/api/orbits/new_orbit`,
    {
        Name: orbit.Name,
        Apogee: orbit.Apogee,
        Perigee: orbit.Perigee,
        Inclination: orbit.Inclination,
        Description: orbit.Description,
        ImageURL: orbit.ImageURL
    },
    config

  )
    .then((response) => response.data);
}