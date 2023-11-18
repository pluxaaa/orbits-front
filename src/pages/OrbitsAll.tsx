import React, { FC, useEffect, useState } from 'react';

import '../styles/style.css';

import { Orbit } from '../modules/ds';
import { getAllOrbits } from '../modules/get-all-orbits';

import OrbitCard from '../components/OrbitCard';
import SearchForm from '../components/SearchForm';

const OrbitsAll: FC = () => {
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
        setOrbits(result);
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
    setOrbits((orbits) => orbits.filter((orbit) => orbit.Name !== orbitName));
  };

  return (
    <div>
      <SearchForm
        searchText={searchText}
        onSearchTextChange={setSearchText}
        onSearchSubmit={(searchText) => {
            window.location.href = `/orbits?orbit_name=${searchText}`;
          }}
      />
      <div className="card_group">
        {orbits.map((orbit, index) => (
          <OrbitCard
            key={index}
            imageUrl={orbit.ImageURL}
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

export default OrbitsAll;
