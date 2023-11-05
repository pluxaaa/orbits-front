import { FC } from 'react';
import { Button, Card } from 'react-bootstrap';
import { changeOrbitStatus } from '../modules/change-orbit-status';

interface Props {
    imageUrl: string;
    orbitName: string;
    orbitStatus: boolean;
    orbitDetailed: string;
    changeStatus: string;
}

const OrbitCard: FC<Props> = ({ imageUrl, orbitName, orbitStatus, orbitDetailed,  changeStatus}) => (
    
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
            <Button className='button' href={changeStatus}> Изменить статус </Button>
        </Card.Body>
    </Card>
);


export default OrbitCard;
