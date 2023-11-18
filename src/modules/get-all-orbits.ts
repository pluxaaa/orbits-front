import { Orbit } from './ds';

export const getAllOrbits = async (orbitName = '') : Promise<Orbit[]> => {
    return fetch('/api/orbits?orbit_name=' + String(orbitName))
        .then((response) => {
            return response.json()
            .catch(() => ({ resultCount: 0, results:[]}));
        })
}