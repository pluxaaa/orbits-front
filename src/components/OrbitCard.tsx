import { FC, useState } from 'react';
import { Button, Card } from 'react-bootstrap';
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

    const handleStatusChange = () => {
        setIsStatusChanging(true); //рендер 1 => return (...)
        changeOrbitStatus(orbitName)
            .then(() => {
                setIsStatusChanging(false); //рендер 2 (если успех) => return (...)
                onStatusChange(orbitName, !orbitStatus);
            })
            .catch((error) => {
                console.error('Ошибка при изменении статуса орбиты:', error);
                setIsStatusChanging(false); //рендер 2 (если не успех) => return (...)
            });
    };

    return (
        <Card className='card'>
            <div className="image-container">
                <Card.Img className="card_image" src={`data:image/png;base64, ${imageUrl}`} />
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
                    {isStatusChanging ? 'Изменение...' : 'Изменить статус'}
                </Button>
            </Card.Body>
        </Card>
    );
};

export default OrbitCard;
