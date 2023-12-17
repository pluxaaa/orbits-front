import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import OrbitCard from '../../components/OrbitCard/OrbitCard';
import OrbitFilter from '../../components/OrbitFilter/OrbitFilter';
import { Orbit } from '../../modules/ds';
import { getAllOrbits } from '../../modules/get-all-orbits';
import filtersSlice from "../../store/filtersSlice";
import store, { useAppDispatch } from '../../store/store';
import './OrbitsAll.styles.css';
import loadTransfReq from '../../modules/load-reqs';
import cartSlice from '../../store/cartSlice';

const OrbitsAll: FC = () => {
  const [orbits, setOrbits] = useState<Orbit[]>([]);
  const dispatch = useAppDispatch()
  const navigate = useNavigate();
  const { userToken, userRole, userName } = useSelector((state: ReturnType<typeof store.getState>) => state.auth)
  const { added } = useSelector((state: ReturnType<typeof store.getState>) => state.cart)

  const { orbitIncl } = useSelector((state: ReturnType<typeof store.getState>) => state.filters);
  const [incl, setIncl] = useState(orbitIncl);

  const { orbitName } = useSelector((state: ReturnType<typeof store.getState>) => state.filters);
  const [name, setName] = useState(orbitName);

  const { orbitIsCircle } = useSelector((state: ReturnType<typeof store.getState>) => state.filters);
  const [isCircle, setIsCircle] = useState(orbitIsCircle);


  useEffect(() => {
    //попытка получить заявку черновик для текущего клиента
    const fetchData = async () => {
      const orbitsData = await loadTransfReq(userToken?.toString(), userRole?.toString(), userName?.toString());
      var orbitNames: string[] = [];
      if (orbitsData) {
        for (let orbit of orbitsData) {
          orbitNames.push(orbit.Name);
        }
        dispatch(cartSlice.actions.setOrbits(orbitNames));
      }
    };

    fetchData();

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
