import { FC, useEffect, useState } from 'react'
import './styles/style.css'
import { useParams } from 'react-router-dom';
import { getOrbitByName } from './modules/get-orbit-by-name'
import { Orbit } from './modules/ds'
import NavigationMain from './components/NavigationMain';
import Breadcrumbs from './components/Breadcrumbs';


const OrbitPage: FC = () => {
    const [orbit, setOrbit] = useState<Orbit>()

    const { orbit_name } = useParams();

    useEffect(() => {
        console.log("orbit_name: ", orbit_name)

        const loadOrbit = async () => {
            const result = await getOrbitByName(String(orbit_name))
            setOrbit(result)
        }

        loadOrbit()
    }, [orbit_name]);


    return (
        <div>
            <NavigationMain/>
            <Breadcrumbs/>
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
                <a className="button page_button" href="../orbits">Назад</a>
            </div>
        </div>
    )
}

export default OrbitPage
