import { FC, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { BsGrid, BsTable } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import CartButton from '../../components/CartButton/CartButton';
import OrbitCard from '../../components/OrbitCard/OrbitCard';
import OrbitFilter from '../../components/OrbitFilter/OrbitFilter';
import OrbitTable from '../../components/OrbitTable/OrbitTable';
import { changeOrbitStatus } from '../../modules/changeOrbitStatus';
import { getAllOrbits } from '../../modules/getAllOrbits';
import loadOrbitOrder from '../../modules/loadOrbitOrder';
import {
  setOrbApo,
  setOrbCircle,
  setOrbIncl,
  setOrbName,
  setOrbPeri,
  setOrbit,
  useOrbApo,
  useOrbCircle,
  useOrbIncl,
  useOrbName,
  useOrbPeri,
  useOrbit,
} from '../../store/newFilter';
import store, { useAppDispatch } from '../../store/store';
import './OrbitsAll.styles.css';

const OrbitsAll: FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate();
  const { userToken, userRole } = useSelector((state: ReturnType<typeof store.getState>) => state.auth)

  const orbit = useOrbit();
  const orbName = useOrbName();
  const orbApo = useOrbApo();
  const orbPeri = useOrbPeri();
  const orbIncl = useOrbIncl();
  const orbCircle = useOrbCircle();

  const [isStatusChanging, setIsStatusChanging] = useState(false);

  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const ToggleIcon = viewMode === 'table' ? BsGrid : BsTable;

  const toggleViewMode = () => {
    setViewMode((prevMode) => (prevMode === 'table' ? 'cards' : 'table'));
  };


  useEffect(() => {
    const loadOrbits = async () => {
      try {
        const result = await getAllOrbits(orbName, orbIncl, orbCircle, userToken?.toString());

        if (result.reqID !== 0){
          localStorage.setItem("reqID", result.reqID.toString());

          loadOrbitOrder(userToken, dispatch);
        }

        dispatch(setOrbit(result.allOrbits));
      } catch (error) {
        console.error("Ошибка при загрузке орбит:", error);
      }
    }

    loadOrbits();
  }, []);

  const applyFilters = async () => {
    try {
      const data = await getAllOrbits(orbName, orbIncl, orbCircle, userToken?.toString());

      dispatch(setOrbit(data.allOrbits));
      dispatch(setOrbName(orbName?.toString() || ""));
      dispatch(setOrbApo(orbApo?.toString() || ''));
      dispatch(setOrbPeri(orbPeri?.toString() || ''));
      dispatch(setOrbIncl(orbIncl?.toString() || ''));
      dispatch(setOrbCircle(orbCircle?.toString() || ''));

      navigate('/orbits', { state: { data } });
    } catch (error) {
      console.error("Ошибка при получении орбит:", error);
    }
  };

  const clearFilters = async () => {

    dispatch(setOrbit([]));
    dispatch(setOrbName(''));
    dispatch(setOrbApo(''));
    dispatch(setOrbPeri(''));
    dispatch(setOrbIncl(''));
    dispatch(setOrbCircle(''));

    try {
      const data = await getAllOrbits('','','',userToken?.toString());
      dispatch(setOrbit(data.allOrbits));
    } catch (error) {
      console.error("Ошибка загрузки орбит:", error);
    }

  };

  const handleStatusChange = async (orbitName: string, newStatus: boolean) => {
    setIsStatusChanging(true);
  
    try {
      await changeOrbitStatus(userToken?.toString(), orbitName);
  
      dispatch(
        setOrbit(
          orbit.map((orbit) =>
            orbit.Name === orbitName ? { ...orbit, IsAvailable: newStatus } : orbit
          )
        )
      );
  
      dispatch(setOrbit(orbit.filter((orbit) => orbit.Name !== orbitName)));
  
    } catch (error) {
      console.error('Ошибка:', error);
    } finally {
      setIsStatusChanging(false);
      navigate('/orbits');
    }
  };

  return (
    <div>
      {userToken && userRole === '1' && <CartButton />}
      {userToken && userRole === '2' && (
        <>
          <Button onClick={() => navigate(`/orbits/add`)} className='cart-button'>
            Новая орбита
          </Button>
          <div className='toggle-view-icon' onClick={toggleViewMode}>
            <ToggleIcon style={{ position: 'absolute', left: '20px', marginTop: '100px' }} size={40} />
          </div>
        </>
      )}
      <OrbitFilter
        name={orbName}
        incl={orbIncl}
        isCircle={orbCircle}
        setName={setOrbName}
        setIncl={setOrbIncl}
        setIsCircle={setOrbCircle}
        applyFilters={applyFilters}
        clearFilters={clearFilters}
      />
      {userRole === '2' ? (
        viewMode === 'table' ? (
          <OrbitTable
            orbits={orbit}
            handleStatusChange={handleStatusChange}
            isStatusChanging={isStatusChanging}
          />
        ) : (
          <div className="card_group">
            {orbit.map((orbit, index) => (
              <div key={index} className="orbit-card">
                <OrbitCard
                  imageUrl={orbit.ImageURL}
                  orbitName={orbit.Name}
                  orbitStatus={orbit.IsAvailable}
                  changeStatus={`/orbits/change_status/${orbit.Name}`}
                  onStatusChange={handleStatusChange}
                />
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="card_group">
          {orbit.map((orbit, index) => (
            <div key={index} className="orbit-card">
              <OrbitCard
                imageUrl={orbit.ImageURL}
                orbitName={orbit.Name}
                orbitStatus={orbit.IsAvailable}
                changeStatus={`/orbits/change_status/${orbit.Name}`}
                onStatusChange={handleStatusChange}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrbitsAll;
