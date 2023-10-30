import { Orbit } from './ds';

export const getOrbits = async (namePattern = ''): Promise<Orbit[]> => {
    return fetch('/api/orbits?orbit_name=' + String(namePattern))
        .then((response) => {
            console.log("namePattern: ", namePattern);
            return response.json()
                .then(data => data.orbits)
                .catch(() => ({ resultCount: 0, results: [] }));
        })
        .catch(() => ({ resultCount: 0, results: [] }));
}
