import React, { FC, useEffect, useState } from 'react';
import './styles/style.css';
import { Orbit } from './modules/ds';
import { getAllOrbits } from './modules/get-all-orbits';
import OrbitCard from './components/OrbitCard';
import Header from './components/Header';

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
                const result = await getAllOrbits(String(orbitName));
                let temp;
                orbitName == ""
                    ? (temp = Object.values(result)[0] as unknown as Orbit[])
                    : (temp = Object.values(result)[1] as unknown as Orbit[]);
                setOrbits(temp);
            } catch (error) {
                console.error("Ошибка при загрузке объектов:", error);
            }
        }

        loadOrbits();
    }, []);

    const handleStatusChange = (orbitName: string, newStatus: boolean) => {
        setOrbits((orbits) =>
            orbits.map((orbit) =>
                orbit.Name === orbitName ? { ...orbit, IsAvailable: newStatus } : orbit
            )
        );
    };

    return (
        <div>
            <Header/>
            <div className="search-form">
                <form method="GET" action="" name="search">
                    <input type="text" id="orbit_search" name="orbit_name" placeholder="Введите название"/>
                    <input type="submit" className="button" value="Поиск"/>
                </form>
            </div>
            <div className="card_group">
                {orbits.map((orbit, index) => (
                    <OrbitCard
                        key={index}
                        imageUrl={orbit.Image}
                        orbitName={orbit.Name}
                        orbitStatus={orbit.IsAvailable}
                        orbitDetailed={`/orbits/${orbit.Name}`}
                        changeStatus={`/orbits/change_status/${orbit.Name}`}
                        onStatusChange={handleStatusChange}
                    />
                ))}
            </div>
        </div>
    );
};

export default OrbitsPage;
