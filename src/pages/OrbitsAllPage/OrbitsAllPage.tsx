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
import { Orbit } from '../../modules/ds';
import { getAllOrbits } from '../../modules/getAllOrbits';
import { getOrbitOrder } from '../../modules/getOrbitOrder';
import getRequestByStatus from '../../modules/getRequestByStatus';
import cartSlice from '../../store/cartSlice';
import filtersSlice from "../../store/filtersSlice";
import store, { useAppDispatch } from '../../store/store';
import './OrbitsAll.styles.css';

const OrbitsAll: FC = () => {
  const [orbits, setOrbits] = useState<Orbit[]>([]);
  const dispatch = useAppDispatch()
  const navigate = useNavigate();
  const { userToken, userRole, userName } = useSelector((state: ReturnType<typeof store.getState>) => state.auth)

  const { orbitIncl } = useSelector((state: ReturnType<typeof store.getState>) => state.filters);
  const [incl, setIncl] = useState(orbitIncl);

  const { orbitName } = useSelector((state: ReturnType<typeof store.getState>) => state.filters);
  const [name, setName] = useState(orbitName);

  const { orbitIsCircle } = useSelector((state: ReturnType<typeof store.getState>) => state.filters);
  const [isCircle, setIsCircle] = useState(orbitIsCircle);

  const [isStatusChanging, setIsStatusChanging] = useState(false);

  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const ToggleIcon = viewMode === 'table' ? BsGrid : BsTable;

  const toggleViewMode = () => {
    setViewMode((prevMode) => (prevMode === 'table' ? 'cards' : 'table'));
  };


  useEffect(() => {
    const loadDraftRequest = async () => {
      const result = (await getRequestByStatus(userToken?.toString(),
        userRole, userName, 'Черновик', '', '', /*''*/))
      if (!result) {
        return
      }
      if (result[0]?.ID) {
        localStorage.setItem("reqID", result[0].ID.toString());

        const reqIDString: string | null = localStorage.getItem("reqID");
        const reqID: number = reqIDString ? parseInt(reqIDString, 10) : 0;

        const orbitOrder = await getOrbitOrder(reqID, userToken?.toString());

        dispatch(cartSlice.actions.setOrbits(orbitOrder.map(orbit => orbit.orbit_name)));

        const newTransfersOrder: { [orbit: string]: number } = {};
        orbitOrder.forEach((orbit, index) => {
          newTransfersOrder[orbit.orbit_name] = index + 1;
        });
        dispatch(cartSlice.actions.setTransfersOrder(newTransfersOrder));
      };
    }
    loadDraftRequest()


    const loadOrbits = async () => {
      try {
        const result = await getAllOrbits(name?.toString(), incl?.toString(), isCircle?.toString());
        setOrbits(result);
      } catch (error) {
        console.error("Ошибка при загрузке объектов:", error);
      }
    }

    loadOrbits();
  }, []);

  const applyFilters = async () => {
    try {
      const data = await getAllOrbits(name?.toString(), incl?.toString(), isCircle?.toString());
      dispatch(filtersSlice.actions.setOrbitName(name));
      dispatch(filtersSlice.actions.setOrbitIncl(incl));
      dispatch(filtersSlice.actions.setOrbitIsCircle(isCircle));

      setOrbits(data);

      navigate('/orbits', { state: { data } });
    } catch (error) {
      console.error("Ошибка при получении орбит:", error);
    }
  };

  const clearFilters = async () => {
    setName('');
    setIncl('');
    setIsCircle('');

    dispatch(filtersSlice.actions.setOrbitName(''));
    dispatch(filtersSlice.actions.setOrbitIncl(''));
    dispatch(filtersSlice.actions.setOrbitIsCircle(''));

    try {
      const data = await getAllOrbits();
      setOrbits(data);
    } catch (error) {
      console.error("Error loading all orbits:", error);
    }

  };

  const handleStatusChange = async (orbitName: string, newStatus: boolean) => {
    setIsStatusChanging(true);

    try {
      await changeOrbitStatus(userToken?.toString(), orbitName);

      setOrbits((orbits) =>
        orbits.map((orbit) =>
          orbit.Name === orbitName ? { ...orbit, IsAvailable: newStatus } : orbit
        )
      );

      setOrbits((orbits) => orbits.filter((orbit) => orbit.Name !== orbitName));

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
        name={name}
        incl={incl}
        isCircle={isCircle}
        setName={setName}
        setIncl={setIncl}
        setIsCircle={setIsCircle}
        applyFilters={applyFilters}
        clearFilters={clearFilters}
      />
      {userRole === '2' ? (
        viewMode === 'table' ? (
          <OrbitTable
            orbits={orbits}
            handleStatusChange={handleStatusChange}
            isStatusChanging={isStatusChanging}
          />
        ) : (
          <div className="card_group">
            {orbits.map((orbit, index) => (
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
          {orbits.map((orbit, index) => (
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
