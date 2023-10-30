import React, { FC, useEffect, useState } from 'react';
import './styles/style.css';
import { Orbit } from './modules/ds';
import { getOrbits } from './modules/get-all-orbits';
import OrbitCard from './components/OrbitCard';

const OrbitsPage: FC = () => {
    const [orbits, setOrbits] = useState<Orbit[]>([]);

    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        var orbitName = urlParams.get('orbit_name');
        if (orbitName == null) {
            orbitName = "";
        }

        const loadOrbits = async () => {
            try {
                const result = await getOrbits(String(orbitName));
                setOrbits(Object.values(result)[0] as unknown as Orbit[]);
            } catch (error) {
                console.error("Ошибка при загрузке объектов:", error);
            }
        }        

        loadOrbits();
    }, []);

    return (
        <div>
            <div className="header">
                <h1>Орбиты</h1>
            </div>
            <div className="search-form">
                <form method="GET" action="" name="search">
                    <label htmlFor="orbit_search">Введите название:</label>
                    <input type="text" id="orbit_search" name="orbit_name" />
                    <input type="submit" className="button" value="Поиск" />
                </form>
            </div>
            <div className="card_group"> {/* Добавьте контейнер card_group */}
                {orbits.map((orbit, index) => (
                    <OrbitCard
                        key={index}
                        imageUrl={orbit.Image}
                        orbitName={orbit.Name}
                        orbitStatus={orbit.IsAvailable}
                        pageUrl={`/orbits?orbit_name=${orbit.Name}`}
                    />
                ))}
            </div>
        </div>
    );
    
};

export default OrbitsPage;
