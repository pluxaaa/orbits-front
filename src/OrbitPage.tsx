import { FC, useEffect, useState } from 'react'
import './styles/style.css'
import { getOrbitByName } from './modules/get-orbit-by-name'
import { Orbit } from './modules/ds'

const OrbitPage: FC = () => {
    const [orbit, setOrbit] = useState<Orbit>()

    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString)
        const orbitName = urlParams.get('orbit_name')

        const loadOrbit = async () => {
            const result = await getOrbitByName(String(orbitName))
            setOrbit(result)
        }

        loadOrbit()
    }, []);

    return (
        <div>
            <div className="header">
                <h1>{orbit?.Name}</h1>
            </div>
            <div className="card-sub">
                <div className="card-content-sub">
                    <img src={`data:image/png;base64, ${orbit?.Image}`} className="card_image" alt="картинка" />
                    <div className="right-content-sub">
                        <p>Статус: {orbit?.IsAvailable ? 'Доступна' : 'Недоступна'}</p>
                        <p>Апогей: {orbit?.Apogee}</p>
                        <p>Перигей: {orbit?.Perigee}</p>
                        <p>Наклонение: {orbit?.Inclination}</p>
                        <p>Описание: {orbit?.Description}</p>
                    </div>
                </div>
                <a className="button page_button" href="..">Назад</a>
            </div>
        </div>
    )
}

export default OrbitPage
