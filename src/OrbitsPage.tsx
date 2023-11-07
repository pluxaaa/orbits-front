import React, { FC, useEffect, useState } from 'react';
import './styles/style.css';
import { Orbit } from './modules/ds';
import { getAllOrbits } from './modules/get-all-orbits';
import OrbitCard from './components/OrbitCard';
import NavigationMain from './components/NavigationMain';
import Breadcrumbs from './components/Breadcrumbs';


const OrbitsPage: FC = () => {
    const [orbits, setOrbits] = useState<Orbit[]>([]);
    const [searchText, setSearchText] = useState<string>('');

    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        var orbitName = urlParams.get('orbit_name') || '';
        setSearchText(orbitName);

        const loadOrbits = async () => {
            try {
                const result = await getAllOrbits(orbitName);
                let temp = orbitName === '' ? Object.values(result)[0] : Object.values(result)[1];
                setOrbits(temp as unknown as Orbit[]);
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

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        window.location.href = `/orbits?orbit_name=${searchText}`;
    };

    return (
        <div>
            <NavigationMain/>
            <Breadcrumbs/>
            <div className="search-form">
                <form onSubmit={handleSearchSubmit}>
                    <input
                        type="text"
                        id="orbit_search"
                        name="orbit_name"
                        placeholder="Введите название"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
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
