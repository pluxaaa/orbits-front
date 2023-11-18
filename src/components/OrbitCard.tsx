import { FC, useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { changeOrbitStatus } from '../modules/change-orbit-status';

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

    const handleStatusChange = async () => {
        setIsStatusChanging(true);

        try {
            await changeOrbitStatus(orbitName);
            onStatusChange(orbitName, !orbitStatus);
        } catch (error) {
            console.error('Error changing orbit status:', error);
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
                        (e.target as HTMLImageElement).src = '/public/DEFAULT.jpg';
                    }}
                    alt={`DEFAULT.jpg`}
                />
            </div>
            <Card.Body>
                <div className='card_title'>
                    <Card.Title> {orbitName} </Card.Title>
                    <Card.Title> Статус: {orbitStatus ? "Доступна" : "Недоступна"} </Card.Title>
                </div>
                <Button className='button' href={orbitDetailed}> Подробнее </Button>
                <div></div>
                <Button
                    className='button'
                    onClick={handleStatusChange}
                    disabled={isStatusChanging}
                >
                    {isStatusChanging ? 'Удаление...' : 'Удалить'}
                </Button>
            </Card.Body>
        </Card>
    );
};

export default OrbitCard;

