import { AxiosError } from 'axios';
import { FC, useEffect, useState } from "react";
import { Button, Col, Form, FormGroup, ListGroup, ListGroupItem, Modal, Row } from "react-bootstrap";
import { useSelector } from 'react-redux';
import { Orbit, TransferRequest } from "../../modules/ds";
import { getDetailedReq } from '../../modules/getDetailedRequest';
import { getOrbitOrder } from '../../modules/getOrbitOrder';
import store, { useAppDispatch } from '../../store/store';
import "./RequestDetPage.styles.css";
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../modules/formatDate';
import cartSlice from '../../store/cartSlice';
import Cart from '../CartPage/CartPage';
import { changeReqStatusModer } from '../../modules/changeRequestStatusModer';

const TransfReqDet: FC = () => {
    const [orbits, setOrbits] = useState<Orbit[]>();
    const isInCart = useSelector((state: ReturnType<typeof store.getState>) => state.cart.isInCart);
    const [showError, setShowError] = useState(false);
    const { userToken, userRole } = useSelector((state: ReturnType<typeof store.getState>) => state.auth);
    const [req, setReq] = useState<TransferRequest | undefined>();
    const [status, setStatus] = useState<string | undefined>();
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    useEffect(() => {
        const pathname = window.location.pathname;
        const parts = pathname.split('/');
        const reqIdString = parts[parts.length - 1];

        const loadReq = async () => {
            try {
                const loadedReq = await getDetailedReq(userToken?.toString(), String(reqIdString));
                setError(null);
                setReq(loadedReq);
                setStatus(loadedReq?.Status);
                if (loadedReq?.Status !== 'Черновик') {
                    dispatch(cartSlice.actions.setIsInCart(false));
                }
            } catch (error) {
                if ((error as AxiosError).message === '403') {
                    setError("403 Доступ запрещен");
                } else {
                    setError("500 Ошибка загрузки заявки");
                }
            }

            if (userToken === null) {
                console.log("ERROR userToken null");
                return;
            }

            const reqID: number = reqIdString ? parseInt(reqIdString, 10) : 0;
            const orbitOrder = await getOrbitOrder(reqID, userToken);

            if (orbitOrder !== null) {
                const sortedOrbits = orbitOrder.sort((a, b) => a.transfer_order - b.transfer_order);
                const extractedOrbits = sortedOrbits.map((orbitOrder) => orbitOrder.orbit);
                setOrbits(extractedOrbits);
            }
        };

        loadReq();
    }, [isInCart]);

    const handleErrorClose = () => {
        setShowError(false);
    };

    const sendChanges = async (status: string) => {
        if (!userToken || req?.ID === undefined) {
            console.log("Ошибка токена или ID");
            return;
        }

        try {
            await changeReqStatusModer(userToken, {
                ID: req.ID,
                Status: status,
            });

            setStatus(status);
        } catch (error) {
            setShowError(true);
        }
    };

    useEffect(() => {
        if (status === 'Удалена') {
            navigate('/orbits');
        }
    }, [status]);

    return (
        <div className="container">
            {error ? (
                <div style={{ textAlign: 'center', fontSize: '2em', margin: 'auto' }}>
                    {error}
                </div>
            ) : (
                <>
                    {status === 'Черновик' || isInCart ? (
                        <Cart />
                    ) : (
                        <>
                            <Modal show={showError} onHide={handleErrorClose}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Произошла ошибка, заявка не была обновлена</Modal.Title>
                                </Modal.Header>
                                <Modal.Footer>
                                    <Button variant="danger" onClick={handleErrorClose}>
                                        Закрыть
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                            <h1>Заявка на трансфер #{req?.ID}</h1>
                            {userRole === '2' && req?.Client && (
                                <p>Клиент: {req.Client.Name}</p>
                            )}
                            <p>Статус: {status}</p>
                            {userRole === '2' && req?.Client && (
                                <p>
                                    {req?.Result ?
                                        (req?.Result === true ?
                                            <b>Маневр может быть проведен успешно</b> :
                                            <b>Маневр может не удасться</b>
                                        ) :
                                        <b>Нет информации о результате маневра</b>
                                    }
                                </p>
                            )}
                            <p>Дата создания: {formatDate(req?.DateCreated)}</p>
                            <p>Дата формирования: {formatDate(req?.DateProcessed)}</p>
                            {status !== '' && (<>
                                <h4>Орбиты:</h4>
                                <ListGroup className="list-group" style={{ width: '300px' }}>
                                    {orbits?.map((orbit) => (
                                        <ListGroupItem key={orbit.ID} className="list-group-item">
                                            {orbit.Name}
                                            {orbit.ImageURL && (
                                                <img
                                                    src={orbit?.ImageURL}
                                                    onError={(e) => { e.currentTarget.src = '/DEFAULT.jpg' }}
                                                    style={{ width: '75px', height: '75px', position: 'absolute', right: '5px', marginTop: '0px' }}
                                                />
                                            )}
                                            <div style={{ width: '75px', height: '75px' }}></div>
                                        </ListGroupItem>
                                    ))}
                                </ListGroup>
                            </>)}
                            <Form>
                                <FormGroup className="form-group">
                                    {userRole === '2' && status === 'На рассмотрении' && (
                                        <>
                                            <div>
                                                <Button
                                                    className="common-button"
                                                    variant="warning"
                                                    onClick={() => sendChanges('Отклонена')}>
                                                    Отклонить
                                                </Button>
                                            </div>
                                            <div>
                                                <Button
                                                    className="common-button"
                                                    variant="success"
                                                    onClick={() => sendChanges('Одобрена')}>
                                                    Одобрить
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </FormGroup>
                            </Form>
                            <Row>
                                <Col>
                                    <Button onClick={() => navigate(`/transfer_requests/`)}
                                        className="button">
                                        К заявкам
                                    </Button>
                                </Col>
                                <Col>
                                    <Button onClick={() => navigate(`/orbits/`)}
                                        className="button">
                                        К орбитам
                                    </Button>
                                </Col>
                            </Row>
                        </>
                    )}
                </>)}
        </div>
    );
};

export default TransfReqDet;
