import {Orbit} from './ds'

export const getOrbitByName = async  (orbitName = ''): Promise<Orbit> => {
    return fetch('/api/orbits/' + String(orbitName),{
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then((response) => response.json())
        .catch(() => ({
            "ID": 1,
            "Name": "Нет информации",
            "IsAvailable": false,
            "Apogee": "Нет информации",
            "Perigee": "Нет информации",
            "Inclination": "Нет информации",
            "Description": "Нет информации",
            "ImageURL": "./DEFAULT.jpg"
        }));
}
