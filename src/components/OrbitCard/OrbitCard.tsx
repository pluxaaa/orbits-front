import { FC, useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import "./OrbitCard.styles.css"

import { changeOrbitStatus } from '../../modules/change-orbit-status';
import store from '../../store/store'

interface Props {
    imageUrl: string;
    orbitName: string;
    orbitStatus: boolean;
    orbitDetailed: string;
    changeStatus: string;
    onStatusChange: (orbitName: string, newStatus: boolean) => void;
}

const OrbitCard: FC<Props> = ({ imageUrl, orbitName, orbitStatus, orbitDetailed, onStatusChange }) => {
    const [isStatusChanging, setIsStatusChanging] = useState(false);
    const navigate = useNavigate();

    const { userRole } = useSelector((state: ReturnType<typeof store.getState>) => state.auth);

    const handleStatusChange = async () => {
        setIsStatusChanging(true);

        try {
            await changeOrbitStatus(orbitName);
            onStatusChange(orbitName, !orbitStatus);
        } catch (error) {
            console.error('Ошибка при изменении статуса орбиты:', error);
        } finally {
            setIsStatusChanging(false);
            navigate('/orbits');
        }
    };

    return (
        <Card className='card'>
            <div className="image-container">
                <Card.Img
                    className="card_image"
                    src={imageUrl}
                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                        (e.target as HTMLImageElement).src = '/DEFAULT.jpg';
                    }}
                    alt={`/DEFAULT.jpg`}
                />
            </div>
            <Card.Body>
                <div className='card_title'>
                    <Card.Title> {orbitName} </Card.Title>
                    <Card.Title> Статус: {orbitStatus ? "Доступна" : "Недоступна"} </Card.Title>
                </div>
                <Button className='button' href={orbitDetailed}> Подробнее </Button>
                <div></div>
                {userRole =='2' && (
                <Button
                    className='button'
                    onClick={handleStatusChange}
                    disabled={isStatusChanging}
                >
                    {isStatusChanging ? 'Удаление...' : 'Удалить'}
                </Button>
            )}
            </Card.Body>
        </Card>
    );
};

export default OrbitCard;

