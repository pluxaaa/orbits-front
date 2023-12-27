import { FC } from 'react';
import { Button, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Orbit } from '../../modules/ds';
import './OrbitTable.styles.css';
import Pagination from '../Pagination/Pagination';
import usePagination from '../Pagination/usePagination';

interface OrbitTableProps {
  orbits: Orbit[];
  handleStatusChange: (orbitName: string, newStatus: boolean) => void;
  isStatusChanging: boolean;
}

const OrbitTable: FC<OrbitTableProps> = ({ orbits, handleStatusChange, isStatusChanging }) => {
  const navigate = useNavigate();

  const {
    currentPage,
    currentItems,
    pageCount,
    paginate,
    goToNextPage,
    goToPrevPage,
  } = usePagination(orbits, 3);

  return (
    <>
      <div className="orbit-center-table">
        <table className="orbit-table">
          <thead>
            <tr>
              <th>Изображение</th>
              <th>Название орбиты</th>
              <th>Статус</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((orbit, index) => (
              <tr key={index}>
                <td>
                  <div className="orbit-details">
                    {orbit.ImageURL && (
                      <img
                        src={orbit?.ImageURL}
                        onError={(e) => {
                          e.currentTarget.src = '/DEFAULT.jpg';
                        }}
                        style={{ width: '150px', height: '150px' }}
                      />
                    )}
                  </div>
                </td>
                <td><span style={{ fontSize: '19px', fontWeight: 'bold' }}>{orbit.Name}</span></td>
                <td style={{ fontSize: '19px', paddingLeft: '10px', paddingRight: '10px' }}>
                  {orbit.IsAvailable ? 'Доступна' : 'Не доступна'}
                </td>
                <td>
                  <Col>
                    <Button
                      className="orbit-table-button"
                      style={{ backgroundColor: '#0E3E8DFF', marginRight: "60px" }}
                      onClick={() => navigate(`/orbits/${encodeURIComponent(orbit.Name)}`)}
                    >
                      Подробнее
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      className="orbit-table-button"
                      style={{ marginRight: '60px' }}
                      variant='success'
                      onClick={() => navigate(`/orbits/${encodeURIComponent(orbit.Name)}/edit`)}
                    >
                      Изменить
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      className="orbit-table-button"
                      style={{ marginRight: '60px' }}
                      variant='danger'
                      onClick={() => handleStatusChange(orbit.Name, !orbit.IsAvailable)}
                      disabled={isStatusChanging}
                    >
                      {isStatusChanging ? 'Удаление...' : 'Удалить'}
                    </Button>
                  </Col>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pageCount > 1 && <Pagination
        currentPage={currentPage}
        pageCount={pageCount}
        goToNextPage={goToNextPage}
        goToPrevPage={goToPrevPage}
        paginate={paginate}
      />}
    </>
  );
};

export default OrbitTable;
