import { AxiosError } from 'axios';
import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Col, Row, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { Orbit } from '../../modules/ds';
import { getOrbitByName } from '../../modules/getOrbitByName';
import './OrbitsDetailed.styles.css';
import { useAppDispatch } from '../../store/store';
import store from '../../store/store';
import { deleteOrbitTransfer } from '../../modules/deleteTransferToOrbit';
import cartSlice from '../../store/cartSlice';
import { changeReqStatus } from '../../modules/changeRequestStatus';
import { createOrbitTransferReq } from '../../modules/createOrbitTransferRequest';
import { getAllOrbits } from '../../modules/getAllOrbits';
import { changeReqStatusClient } from '../../modules/changeRequestStatusClient';


const OrbitDetailed: FC = () => {
  const [orbit, setOrbit] = useState<Orbit | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate()

  const { orbit_name } = useParams();

  const dispatch = useAppDispatch();

  const { userRole, userToken } = useSelector((state: ReturnType<typeof store.getState>) => state.auth);
  const orbits = useSelector((state: ReturnType<typeof store.getState>) => state.cart.orbits);

  const isOrbitInCart = useSelector((state: ReturnType<typeof store.getState>) =>
    state.cart.orbits?.includes(orbit_name || "")
  );

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

  const handleCreateRequest = async () => {
    try {
      if (!userToken) {
        return
      }
      if (isOrbitInCart) {
        await deleteOrbitTransfer(orbit_name || "", localStorage.getItem("reqID"), userToken);
        dispatch(cartSlice.actions.removeOrbit(orbit_name || ""));
        if (orbits.length === 1) {
          const reqIDString: string | null = localStorage.getItem("reqID");
          const reqID: number = reqIDString ? parseInt(reqIDString, 10) : 0;
          // await changeReqStatus(userToken, {
          //   ID: reqID,
          //   Status: "На рассмотрении",
          // });
          await changeReqStatusClient(userToken, reqID)
          localStorage.setItem("reqID", "")
        }
      } else {
        await createOrbitTransferReq(orbit_name || "", userToken);
        const data = await getAllOrbits('', '', '', userToken?.toString())
        localStorage.setItem("reqID", data.reqID.toString())
        dispatch(cartSlice.actions.addOrbit(orbit_name || ""));
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  return (
    <div>
      <div className="card-sub">
        <img
          src={orbit?.ImageURL}
          className="card_image"
          onError={(e) => { e.currentTarget.src = '/DEFAULT.jpg' }}
        />
        <div className="right-content-sub">
          <p style={{fontWeight:"bold", fontSize:"30px"}}>{orbit?.Name}</p>
          <p>Апогей: {orbit?.Apogee} км</p>
          <p>Перигей: {orbit?.Perigee} км</p>
          <p>Наклонение: {orbit?.Inclination}°</p>
          <p>Описание: {orbit?.Description}</p>
        </div>
      </div>
      <Row>
        <Col>
          <button className="button-det" onClick={() => (navigate(`/orbits/`))}>Назад</button>
        </Col>
        <Col>
          {userRole === '1' && (
            <>
              <div style={{ width: '1px', height: '1px' }}></div>
              <Button
                className='button-add'
                onClick={handleCreateRequest}
                variant={isOrbitInCart ? 'danger' : 'success'}
              >
                {isOrbitInCart ? 'Удалить' : 'Добавить'}
              </Button>
            </>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default OrbitDetailed;
