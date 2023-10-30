import {FC, useEffect, useState} from 'react'
import './OrbitPage.css'
import {getOrbitByName } from './modules/get-orbit-by-name'
import {Orbit} from './modules/ds'

const OrbitPage: FC = () => {

    const [orbit, setOrbit] = useState<Orbit>()

    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString)
        const orbitName = urlParams.get('orbit_name')
    
        const loadOrbit = async () => {
            const result = await getOrbitByName(String(orbitName))
            console.log(result)
            setOrbit(result)
        }
    
        loadOrbit()

    }, []);
    
    return (
        <div>
            <img src={"data:image/jpg;base64, " + orbit?.Image} className="card_image" />
            <p>{orbit?.Name}</p>
            <p className="orbit_line"><b>Статус: {orbit?.IsAvailable}</b></p>
            <p className="orbit_line"><b>Апогей: {orbit?.Apogee}</b></p>
            <p className="orbit_line"><b>Перигей: {orbit?.Perigee}</b></p>
            <p className="orbit_line"><b>Наклонение: {orbit?.Inclination}</b></p>
            <p className="orbit_line"><b>Описание: {orbit?.Description}</b></p>
            <a className="button page_button" href="..">Назад</a>
        </div>
    )
}

export default OrbitPage