import { FC, useState } from 'react';
import { Button, Card, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { changeOrbitStatus } from '../../modules/changeOrbitStatus';
import { changeReqStatus } from '../../modules/changeRequestStatus';
import { createOrbitTransferReq } from '../../modules/createOrbitTransferRequest';
import { deleteOrbitTransfer } from '../../modules/deleteTransferToOrbit';
import cartSlice from '../../store/cartSlice';
import store, { useAppDispatch } from '../../store/store';
import "./OrbitCard.styles.css";

interface Props {
    imageUrl: string;
    orbitName: string;
    orbitStatus: boolean;
    changeStatus: string;
    onStatusChange: (orbitName: string, newStatus: boolean) => void;
}

const OrbitCard: FC<Props> = ({ imageUrl, orbitName, orbitStatus, onStatusChange }) => {
    const [isStatusChanging, setIsStatusChanging] = useState(false);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { userRole, userToken } = useSelector((state: ReturnType<typeof store.getState>) => state.auth);
    const orbits = useSelector((state: ReturnType<typeof store.getState>) => state.cart.orbits);

    const isOrbitInCart = useSelector((state: ReturnType<typeof store.getState>) =>
        state.cart.orbits?.includes(orbitName)
    );

    const handleStatusChange = async () => {
        setIsStatusChanging(true);

        try {
            await changeOrbitStatus(userToken?.toString(), orbitName);
            onStatusChange(orbitName, !orbitStatus);
        } catch (error) {
            console.error('Ошибка при удалении орбиты:', error);
        } finally {
            setIsStatusChanging(false);
            navigate('/orbits');
        }
    };

    const handleCreateRequest = async () => {
        try {
            if (!userToken) {
                return
            }
            if (isOrbitInCart) {
                await deleteOrbitTransfer(orbitName, localStorage.getItem("reqID"), userToken);
                dispatch(cartSlice.actions.removeOrbit(orbitName));
                if (orbits.length === 1) {
                    const reqIDString: string | null = localStorage.getItem("reqID");
                    const reqID: number = reqIDString ? parseInt(reqIDString, 10) : 0;
                    await changeReqStatus(userToken, {
                        ID: reqID,
                        Status: "На рассмотрении",
                    });
                    localStorage.setItem("reqID", "")
                }
            } else {
                const response = await createOrbitTransferReq(orbitName, userToken);
                localStorage.setItem("reqID", response.data)
                dispatch(cartSlice.actions.addOrbit(orbitName));
            }
        } catch (error) {
            console.error('Ошибка:', error);
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
                    <Card.Title style={{ fontWeight: 'bold' }}> {orbitName} </Card.Title>
                    <Card.Title> Статус: {orbitStatus ? "Доступна" : "Недоступна"} </Card.Title>
                </div>
                <Button
                    className='button-card'
                    style={{ backgroundColor: '#0E3E8DFF' }}
                    onClick={() => (navigate(`/orbits/${encodeURIComponent(orbitName)}`))}>
                    Подробнее
                </Button>
                {userRole === '1' && (
                    <>
                        <div style={{ width: '1px', height: '1px' }}></div>
                        <Button
                            className='button-add'
                            onClick={handleCreateRequest}
                            variant={isOrbitInCart ? 'danger' : 'success'}
                        >
                            {isOrbitInCart ? 'Удалить' : 'Добавить'}
                        </Button>
                    </>
                )}
                {userRole === '2' && (
                    <>
                        <Col>
                            <Button
                                className='button-card'
                                variant='success'
                                onClick={() => navigate(`/orbits/${encodeURIComponent(orbitName)}/edit`)}
                            >
                                Изменить
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                className='button-card'
                                onClick={handleStatusChange}
                                disabled={isStatusChanging}
                                variant='danger'
                            >
                                {isStatusChanging ? 'Удаление...' : 'Удалить'}
                            </Button>
                        </Col>
                    </>
                )}
            </Card.Body>
        </Card>
    );
};

export default OrbitCard;