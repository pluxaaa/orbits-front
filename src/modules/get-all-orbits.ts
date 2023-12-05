import { Orbit } from './ds';

export const getAllOrbits = async (orbitName = ''): Promise<Orbit[]> => {
    return fetch('/api/orbits?orbit_name=' + String(orbitName))
      .then((response) => response.json())
      .catch (() => ([{
        "ID": 1,
        "Name": "Нет информации",
        "IsAvailable": false,
        "Apogee": "Нет информации",
        "Perigee": "Нет информации",
        "Inclination": "Нет информации",
        "Description": "Нет информации",
        "ImageURL": "./DEFAULT.jpg"
    }]
    ))
}