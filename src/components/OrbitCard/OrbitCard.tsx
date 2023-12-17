import { FC, useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { changeOrbitStatus } from '../../modules/change-orbit-status';
import cartSlice from '../../store/cartSlice';
import store, { useAppDispatch } from '../../store/store';
import "./OrbitCard.styles.css";

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
    const dispatch = useAppDispatch();

    const { userRole, userToken } = useSelector((state: ReturnType<typeof store.getState>) => state.auth);

    // Проверка есть ли орбита в локалстораж
    const isOrbitInCart = useSelector((state: ReturnType<typeof store.getState>) =>
        state.cart.orbits?.includes(orbitName)
    );

    const handleAddOrbitToCart = () => {
        if (isOrbitInCart) {
            dispatch(cartSlice.actions.removeOrbit(orbitName));
        } else {
            dispatch(cartSlice.actions.addOrbit(orbitName));
        }
    };

    const handleStatusChange = async () => {
        setIsStatusChanging(true);

        try {
            await changeOrbitStatus(userToken?.toString(), orbitName);
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
                {userRole === '2' && (
                    <Button
                        className='button-card'
                        onClick={handleStatusChange}
                        disabled={isStatusChanging}
                    >
                        {isStatusChanging ? 'Удаление...' : 'Удалить'}
                    </Button>
                )}
                {userRole === '1' && (
                    <Button
                        className="button-add"
                        onClick={handleAddOrbitToCart}
                        disabled={isStatusChanging}
                        variant={isOrbitInCart ? 'danger' : 'success'}
                    >
                        {isOrbitInCart ? 'Удалить' : 'Добавить'}
                    </Button>
                )}
            </Card.Body>
        </Card>
    );
};

export default OrbitCard;
