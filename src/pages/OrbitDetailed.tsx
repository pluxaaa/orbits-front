import React, { FC, useEffect, useState } from 'react';

import '../styles/style.css';

import { useParams } from 'react-router-dom';

import { getOrbitByName } from '../modules/get-orbit-by-name';
import { Orbit } from '../modules/ds';

const OrbitDetailed: FC = () => {
  const [orbit, setOrbit] = useState<Orbit>()

  const { orbit_name } = useParams();

  useEffect(() => {
    const loadOrbit = async () => {
      const result = await getOrbitByName(String(orbit_name))
      setOrbit(result)
    }

    loadOrbit()
  }, [orbit_name]);

  return (
    <div>
      <div className="card-sub">
        <img src={orbit?.ImageURL || '/DEFAULT.jpg'} className="card_image" />
        <div className="right-content-sub">
          <p>Статус: {orbit?.IsAvailable ? 'Доступна' : 'Недоступна'}</p>
          <p>Апогей: {orbit?.Apogee}</p>
          <p>Перигей: {orbit?.Perigee}</p>
          <p>Наклонение: {orbit?.Inclination}</p>
          <p>Описание: {orbit?.Description}</p>
        </div>
      </div>
      <a className="button page_button" href="../orbits">Назад</a>
    </div>
  );
}

export default OrbitDetailed;
