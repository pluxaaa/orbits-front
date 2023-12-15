import React, { FC, useEffect, useState, useRef } from "react";
import { useSelector } from 'react-redux';
import { Form, FormGroup, Button, ListGroup, ListGroupItem, Modal } from "react-bootstrap";
import Select from 'react-select';
import { getDetailedReq } from '../modules/get-detailed-req';
import { TransferRequest } from "../modules/ds";
import store, { useAppDispatch } from '../store/store';
import { getRequestOrbits } from "../modules/get-request-orbits";
import { setRequestOrbits } from "../modules/set-request-orbits";
import { changeReqStatus } from "../modules/change-req-status";
import { Orbit } from '../modules/ds';
import { getAllOrbits } from "../modules/get-all-orbits";
import "../styles/TransfReqDetPage.styles.css";
import cartSlice from "../store/cartSlice";
import { AxiosError } from 'axios';


const TransfReqDet: FC = () => {
    const newOrbitInputRef = useRef<any>(null);
    const dispatch = useAppDispatch()
    const [orbitNames, setOrbitNames] = useState<string[]>();
    const [newOrbit, setNewOrbit] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const { userToken, userRole } = useSelector((state: ReturnType<typeof store.getState>) => state.auth);
    const [reqId, setReqId] = useState(0);
    const [req, setReq] = useState<TransferRequest | undefined>();
    const [options, setOptions] = useState<Orbit[]>([]);
    const [selectedOrbit, setSelectedOrbit] = useState<Orbit | null>(null);
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
            var orbitNames: string[] = [];
            if (orbits) {
                for (let orbit of orbits) {
                    orbitNames.push(orbit.Name);
                }
                setOrbitNames(orbitNames);
                if (req?.Status == 'Черновик'){
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

    const removeOrbit = (removedOrbitName: string) => {
        return (event: React.MouseEvent) => {
            if (!orbitNames) {
                return;
            }

            dispatch(cartSlice.actions.removeOrbit(removedOrbitName))
            setOrbitNames(orbitNames.filter(function (orbitName) {
                return orbitName !== removedOrbitName;
            }));

            event.preventDefault();
        };
    };

    const addOrbit = () => {
        if (!selectedOrbit || !selectedOrbit.Name || !orbitNames) {
            return;
        }
    
        const orbitNameToAdd = selectedOrbit.Name;
    
        if (orbitNames.includes(orbitNameToAdd)) {
            console.error('Орбита уже добавлена:', orbitNameToAdd);
            return;
        }

        dispatch(cartSlice.actions.addOrbit(orbitNameToAdd))
        setOrbitNames([...orbitNames, orbitNameToAdd]);
    
        setNewOrbit('');
    
        if (newOrbitInputRef.current != null) {
            newOrbitInputRef.current.value = '';
        }
    };
    

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
        console.log(editResult);

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
            if (status != 'Черновик'){
                localStorage.setItem("orbits", '')
                window.location.href = '/orbits';
            }
        } else {
            localStorage.setItem("orbits", '')
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
            <ListGroup className="list-group" style={{ width: '500px' }}>
                {orbitNames?.map((orbitName, orbitID) => (
                    <ListGroupItem key={orbitID} className="list-group-item">
                        {orbitName}
                        {req?.Status === 'Черновик' && (
                            <span className="button-group">
                                <Button variant="danger" onClick={removeOrbit(orbitName)}>Удалить</Button>
                            </span>
                        )}
                    </ListGroupItem>
                ))}
            </ListGroup>
            {req?.Status === 'Черновик' && (
                <div className="input-group">
                    <Select
                        options={options.map(option => ({ value: option.Name, label: option.Name }))}
                        value={selectedOrbit ? { value: selectedOrbit.Name, label: selectedOrbit.Name } : null}
                        onChange={(value) => setSelectedOrbit(options.find(option => option.Name === value?.value) || null)}
                        isSearchable
                        placeholder="Выберите орбиту..."
                    />
                    <Button onClick={addOrbit} className="button">Добавить</Button>
                </div>
            )}
            <Form>
                {req?.Status === 'Черновик' && (
                    <Button onClick={() => sendChanges('Черновик')} className="button">Сохранить изменения</Button>
                )}
                <FormGroup className="form-group">
                    {userRole === '1' && req?.Status === 'Черновик' && (
                        <>
                            <div>
                                <Button className="common-button" variant="primary" 
                                onClick={() => sendChanges('На рассмотрении')}>Сформировать</Button>
                            </div>
                            <div>
                                <Button className="common-button" variant="danger" 
                                onClick={() => sendChanges('Удалена')}>Отменить</Button>
                            </div>
                        </>
                    )}

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
