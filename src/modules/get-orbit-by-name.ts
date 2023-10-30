import {Orbit} from './ds'

export const getOrbitByName = async  (orbitName = ''): Promise<Orbit> => {
    return fetch('/api/orbit/' + String(orbitName),{
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then((response) => response.json());
}
