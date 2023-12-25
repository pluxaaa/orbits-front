import { AxiosError } from 'axios';
import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { Orbit } from '../../modules/ds';
import { getOrbitByName } from '../../modules/getOrbitByName';
import './OrbitsDetailed.styles.css';
import store from '../../store/store';
import { useSelector } from 'react-redux';

const OrbitDetailed: FC = () => {
  const [orbit, setOrbit] = useState<Orbit | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { userRole } = useSelector((state: ReturnType<typeof store.getState>) => state.auth);
  const navigate = useNavigate()

  const { orbit_name } = useParams();

  useEffect(() => {
    const loadOrbit = async () => {
      try {
        const result = await getOrbitByName(String(orbit_name));
        setOrbit(result);
        setError(null);
      } catch (error) {
        console.error('Ошибка при получении орбит:', error);
        if ((error as AxiosError).message === '404') {
          setError("404 Орбита не найдена");
        } else {
          setError('Произошла ошибка при загрузке орбиты');
        }
      }
    };

    loadOrbit();
  }, [orbit_name]);

  if (error) {
    return (
      <div style={{ textAlign: 'center', fontSize: '2em', margin: 'auto' }}>
        {error}
      </div>
    );
  }

  if (!orbit) {
    return <div>Загрузка...</div>;
  }

  return (
    <div>
      <div className="card-sub">
        <img
          src={orbit?.ImageURL}
          className="card_image"
          onError={(e) => { e.currentTarget.src = '/DEFAULT.jpg' }}
        />
        <div className="right-content-sub">
          <p>Статус: {orbit?.IsAvailable ? 'Доступна' : 'Недоступна'}</p>
          <p>Апогей: {orbit?.Apogee}</p>
          <p>Перигей: {orbit?.Perigee}</p>
          <p>Наклонение: {orbit?.Inclination}</p>
          <p>Описание: {orbit?.Description}</p>
        </div>
      </div>
      <Row>
        <Col>
          <button className="button-det" onClick={() => (navigate(`/orbits/`))}>Назад</button>
        </Col>
        {userRole == '2' && (<>
          <Col>
            <button onClick={() => navigate(`/orbits/${orbit?.Name}/edit`)}
              className="button-det">
              Изменить
            </button>
          </Col>
        </>)}
      </Row>
    </div>
  );
};

export default OrbitDetailed;
