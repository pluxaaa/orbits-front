import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux'
import { Modal } from 'react-bootstrap'
import '../styles/OrbitsAll.styles.css';
import { Orbit, TransferRequest } from '../modules/ds';
import { getAllOrbits } from '../modules/get-all-orbits';
import store, { useAppDispatch } from '../store/store';
import cartSlice from '../store/cartSlice';
import OrbitCard from '../components/OrbitCard/OrbitCard';
import SearchForm from '../components/SearchForm/SearchForm';
import { getTransfReqs } from '../modules/get-all-requests';
import { getRequestOrbits } from '../modules/get-request-orbits';

const OrbitsAll: FC = () => {
  const [orbits, setOrbits] = useState<Orbit[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const dispatch = useAppDispatch()
  const { userToken, userRole, userName } = useSelector((state: ReturnType<typeof store.getState>) => state.auth)

  const { added } = useSelector((state: ReturnType<typeof store.getState>) => state.cart)

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    var orbitName = urlParams.get('orbit_name') || '';
    setSearchText(orbitName);

    const loadTransfReqs = async () => {
      if (userToken !== undefined) {
        const result = (await getTransfReqs(userToken?.toString(), 'Черновик')).filter((item) => {
          if (userRole === '1') {
            return item.Client?.Name === userName;
          } else {
            return [];
          }
        });
        console.log(result)
        const orbits = await getRequestOrbits(result[0].ID, userToken?.toString());
        var orbitNames: string[] = [];
        if (orbits) {
            for (let orbit of orbits) {
                orbitNames.push(orbit.Name);
            }
            localStorage.setItem("orbits", orbitNames.join(","));
        }
      }
    }
    loadTransfReqs()

    const loadOrbits = async () => {
      try {
        const result = await getAllOrbits(orbitName);
        console.log(result)
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

  const handleModalClose = () => {
    dispatch(cartSlice.actions.disableAdded())
  }

  return (
    <div>
      <Modal show={added} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Орбита добавлена в заявку</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <button onClick={() => { dispatch(cartSlice.actions.disableAdded()) }}>
            Закрыть
          </button>
        </Modal.Footer>
      </Modal>
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
