import { FC } from 'react';
import { Button, Card } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import store from '../../store/store';
import "./TransfReqCard.styles.css";

interface transfReqProps {
    id: number,
    status: string,
    dateCreated?: string,
    dateProcessed?: string,
    dateFinished?: string,
}

const TransfReqCard: FC<transfReqProps> = ({ status, dateCreated, dateProcessed, dateFinished, id }) => {
    const { userRole, userName } = useSelector((state: ReturnType<typeof store.getState>) => state.auth);
    const navigate = useNavigate()

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) {
            return 'N/A';
        }

        const options: Intl.DateTimeFormatOptions = {
            timeZone: 'UTC',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        };

        const date = new Date(dateString);

        return new Intl.DateTimeFormat('ru-RU', options).format(date);
    };

    return (
        <Card className="card">
          <Card.Body className="card_body">
            <p>Статус: {status}</p>
            <p>Создана: {formatDate(dateCreated)}</p>
            {dateProcessed !== 'Н/Д' && dateProcessed && (
              <p>Отправлена: {formatDate(dateProcessed)}</p>
            )}
            {dateFinished !== 'Н/Д' && dateFinished && (
              <p>Завршена: {formatDate(dateFinished)}</p>
            )}
          </Card.Body>
          <Card.Footer className="card_footer">
            {userRole === '1' && (
              <Button
                onClick={() => (navigate(`/transfer_requests/${id}`))}
                className="button"
              >
                Просмотр
              </Button>
            )}
            {userRole === '2' && (
              <Button
                onClick={() => (navigate(`/transfer_requests/${id}`))}
                variant="primary"
                className="button button_primary"
              >
                Изменить
              </Button>
            )}
          </Card.Footer>
        </Card>
      );
      
      
}

export default TransfReqCard;