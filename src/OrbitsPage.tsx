import React, { FC, useEffect, useState } from 'react';
import './OrbitsPage.css';
import { Orbit } from './modules/ds';
import { getOrbits } from './modules/get-all-orbits';
import OrbitCard from './components/OrbitCard';
import { Card, Col, Row } from 'react-bootstrap';

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
                setOrbits(result);
            } catch (error) {
                console.error("Ошибка при загрузке орбит:", error);
            }
        }
    
        loadOrbits();
    }, []);
    

    return (
        <div>
            <div>
                <form method="GET" action="" name="search">
                    <label htmlFor="orbit_search">Введите название:</label>
                    <input type="text" id="orbit_search" name="orbit_name" />
                    <input type="submit" className="button" value="Поиск"></input>
                </form>
            </div>
            <div className="orbit-card-container">
                {orbits.map((orbit, index) => (
                    <OrbitCard
                        key={index}
                        imageUrl={orbit.Image}
                        orbitName={orbit.Name}
                        pageUrl={`/orbits?orbit_name=${orbit.Name}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default OrbitsPage;
