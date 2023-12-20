import { AxiosError } from 'axios';
import { FC, useEffect, useState } from "react";
import { Button, Col, Form, FormGroup, ListGroup, ListGroupItem, Modal, Row } from "react-bootstrap";
import { useSelector } from 'react-redux';
import { changeReqStatus } from "../../modules/changeRequestStatus";
import { Orbit, TransferRequest } from "../../modules/ds";
import { getDetailedReq } from '../../modules/getDetailedRequest';
import { getRequestOrbits } from "../../modules/getRequestOrbits";
import store from '../../store/store';
import "./RequestDetPage.styles.css";
import { useNavigate } from 'react-router-dom';

const TransfReqDet: FC = () => {
    const [orbits, setOrbits] = useState<Orbit[]>();
    const [showError, setShowError] = useState(false);
    const { userToken, userRole } = useSelector((state: ReturnType<typeof store.getState>) => state.auth);
    const [req, setReq] = useState<TransferRequest | undefined>();
    const [status, setStatus] = useState<string | undefined>();
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const pathname = window.location.pathname;
        const parts = pathname.split('/');
        const reqIdString = parts[parts.length - 1];

        const loadReq = async () => {
            try {
                const loadedReq = await getDetailedReq(userToken?.toString(), String(reqIdString));
                setError(null);
                setReq(loadedReq);
                setStatus(loadedReq?.Status)
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
            const requestOrbits = await getRequestOrbits(reqID, userToken);
            setOrbits(requestOrbits);
        };

        loadReq();
    }, []);


    if (error) {
        return (
            <div style={{ textAlign: 'center', fontSize: '2em', margin: 'auto' }}>
                {error}
            </div>
        );
    }

    const handleErrorClose = () => {
        setShowError(false);
    };

    const sendChanges = async (status: string) => {
        if (!userToken || req?.ID === undefined) {
            console.log("Ошибка токена или ID");
            return;
        }

        try {
            const editResult = await changeReqStatus(userToken, {
                ID: req.ID,
                Status: status,
            });

            setStatus(status);
        } catch (error) {
            setShowError(true);
        }
    };

    return (
        <div className="container">
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
            <p>Статус: {status}</p>
            {status !== 'Отклонена' && (<>
                <h4>Орбиты:</h4>
                <ListGroup className="list-group" style={{ width: '300px' }}>
                    {orbits?.map((orbit) => (
                        <ListGroupItem key={orbit.ID} className="list-group-item">
                            {orbit.Name}
                            {orbit.ImageURL && (
                                <img
                                    src={orbit?.ImageURL}
                                    onError={(e) => { e.currentTarget.src = '/DEFAULT.jpg' }}
                                    style={{ width: '75px', height: '75px', position: 'absolute', right: '0' }}
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
                                onClick={() => sendChanges('Оказана')}>
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
        </div>
    );
};

export default TransfReqDet;
