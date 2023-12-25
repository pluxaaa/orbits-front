import { FC } from 'react';
import { Button, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Orbit } from '../../modules/ds';
import './OrbitTable.styles.css';

interface OrbitTableProps {
  orbits: Orbit[];
  handleStatusChange: (orbitName: string, newStatus: boolean) => void;
  isStatusChanging: boolean;
}

const OrbitTable: FC<OrbitTableProps> = ({ orbits, handleStatusChange, isStatusChanging }) => {
  const navigate = useNavigate();

  return (
    <div className="orbit-center-table">
      <table className="orbit-table">
        <thead>
          <tr>
            <th>Название орбиты</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {orbits.map((orbit, index) => (
            <tr key={index}>
              <td>
                <div className="orbit-details">
                  {orbit.ImageURL && (
                    <img
                      src={orbit?.ImageURL}
                      onError={(e) => {
                        e.currentTarget.src = '/DEFAULT.jpg';
                      }}
                      style={{ width: '75px', height: '75px', right: '0' }}
                    />
                  )}
                  <span style={{ marginLeft: '10px' }}>{orbit.Name}</span>
                </div>
              </td>
              <td style={{ paddingLeft: '20px' }}>{orbit.IsAvailable ? 'Доступна' : 'Не доступна'}</td>
              <td>
                <Col>
                  <Button
                    className="orbit-table-button"
                    onClick={() => navigate(`/orbits/${encodeURIComponent(orbit.Name)}`)}
                  >
                    Подробнее
                  </Button>
                </Col>
                <Col>
                  <Button
                    className="orbit-table-button"
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
  );
};

export default OrbitTable;
