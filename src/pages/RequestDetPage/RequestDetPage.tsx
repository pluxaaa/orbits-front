import { AxiosError } from 'axios';
import React, { FC, useEffect, useRef, useState } from "react";
import { Button, Form, FormGroup, ListGroup, ListGroupItem, Modal } from "react-bootstrap";
import { useSelector } from 'react-redux';
import Select from 'react-select';
import { changeReqStatus } from "../../modules/change-req-status";
import { Orbit, TransferRequest } from "../../modules/ds";
import { getAllOrbits } from "../../modules/get-all-orbits";
import { getDetailedReq } from '../../modules/get-detailed-req';
import { getRequestOrbits } from "../../modules/get-request-orbits";
import { setRequestOrbits } from "../../modules/set-request-orbits";
import cartSlice from "../../store/cartSlice";
import store, { useAppDispatch } from '../../store/store';
import "./RequestDetPage.styles.css";

const TransfReqDet: FC = () => {
    const [orbitNames, setOrbitNames] = useState<string[]>();
    const [orbits, setOrbits] = useState<Orbit[]>();
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const { userToken, userRole } = useSelector((state: ReturnType<typeof store.getState>) => state.auth);
    const [reqId, setReqId] = useState(0);
    const [req, setReq] = useState<TransferRequest | undefined>();
    const [options, setOptions] = useState<Orbit[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const pathname = window.location.pathname;
        const parts = pathname.split('/');
        const reqIdString = parts[parts.length - 1];

        if (reqIdString) {
            setReqId(+reqIdString);
        }
        const loadReq = async () => {
            try {
                const loadedReq = await getDetailedReq(userToken?.toString(), String(reqIdString));
                setError(null);
                setReq(loadedReq);
            } catch (error) {
                if ((error as AxiosError).message === '403') {
                    setError("403 Доступ запрещен");
                } else {
                    setError("500 Ошибка загрузки заявки");
                }
            }

            if (userToken === null) {
                return;
            }

            const orbits = await getRequestOrbits(+reqIdString, userToken);
            setOrbits(orbits)
            var orbitNames: string[] = [];
            if (orbits) {
                for (let orbit of orbits) {
                    orbitNames.push(orbit.Name);
                }
                setOrbitNames(orbitNames)
                if (req?.Status == 'Черновик') {
                    localStorage.setItem("orbits", orbitNames.join(","));
                }
            }
        };

        const fetchOrbits = async () => {
            const orbits = await getAllOrbits();
            setOptions(orbits);
        };

        loadReq();
        fetchOrbits();
    }, [userToken]);

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

    const handleSuccessClose = () => {
        setShowSuccess(false);
        if (req?.Status != 'Черновик') {
            window.location.href = '/orbits';
        }
    };

    const sendChanges = async (status: string) => {
        if (!userToken) {
            return;
        }

        var req_id = 0;

        if (req?.ID !== undefined) {
            req_id = req?.ID;
        }

        const editResult = await changeReqStatus(userToken, {
            ID: req_id,
            Status: status,
        });

        if (!orbitNames || !userToken) {
            return;
        }

        if (status !== 'Удалена') {
            const orbitsResult = await setRequestOrbits(req?.ID, orbitNames, userToken);
            if (orbitsResult.status === 201) {
                setShowSuccess(true);
            } else {
                setShowError(true);
            }
            console.log(orbitsResult);
            if (status != 'Черновик') {
                localStorage.setItem("orbits", '')
                window.location.href = '/orbits';
            }
        } else {
            localStorage.setItem("orbits", '')
            setOrbits([])
            setOrbitNames([]);
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
            <Modal show={showSuccess} onHide={handleSuccessClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Обновление заявки прошло успешно!</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button variant="success" onClick={handleSuccessClose}>
                        Закрыть
                    </Button>
                </Modal.Footer>
            </Modal>
            <h1>Заявка на трансфер #{req?.ID}</h1>
            <p>Статус: {req?.Status}</p>
            <h4>Орбиты:</h4>
            <ListGroup className="list-group" style={{ width: '300px' }}>
                {orbits?.map((orbit) => (
                    <ListGroupItem key={orbit.ID} className="list-group-item">
                        {orbit.Name}
                        {orbit.ImageURL && (
                            <img
                                src={orbit.ImageURL}
                                alt={`Image for ${orbit.Name}`}
                                style={{ width: '75px', height: '75px', position: 'absolute', right: '0' }}
                            />
                        )}
                        <div style={{ width: '75px', height: '75px' }}></div>
                    </ListGroupItem>
                ))}
            </ListGroup>
            <Form>
                <FormGroup className="form-group">
                    {userRole === '2' && req?.Status === 'На рассмотрении' && (
                        <>
                            <div>
                                <Button className="common-button" variant="warning"
                                    onClick={() => sendChanges('Отклонена')}>Отклонить</Button>
                            </div>
                            <div>
                                <Button className="common-button" variant="success"
                                    onClick={() => sendChanges('Оказана')}>Одобрить</Button>
                            </div>
                        </>
                    )}
                </FormGroup>
            </Form>
            <div className="button-container">
                <Button href='/transfer_requests' className="button">К заявкам</Button>
                <Button href='/orbits' className="button">К орбитам</Button>
            </div>
        </div>
    );
};

export default TransfReqDet;
