import { FC, useState } from "react";
import { Button, ListGroup, ListGroupItem, Modal, Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { useNavigate } from "react-router-dom";
import { deleteOrbitTransfer } from "../../modules/delete-req-mm";
import cartSlice from "../../store/cartSlice";
import store, { useAppDispatch } from "../../store/store";
import { changeReqStatus } from "../../modules/change-req-status";
import { DragDropContext, Draggable, DropResult, Droppable } from "react-beautiful-dnd";
import { updateVisitNumbers } from "../../modules/update-orbit-order";
import "./CartPage.styles.css";

const Cart: FC = () => {
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { userToken } = useSelector((state: ReturnType<typeof store.getState>) => state.auth);
    const orbits = useSelector((state: ReturnType<typeof store.getState>) => state.cart.orbits);
    const visitNumbers = useSelector((state: ReturnType<typeof store.getState>) => state.cart.visitNumbers);

    const deleteFromCart = (orbitName = '') => {
        return (event: React.MouseEvent) => {
            if (!userToken) {
                return;
            }
            const response = deleteOrbitTransfer(orbitName, localStorage.getItem("reqID"), userToken);
            dispatch(cartSlice.actions.removeOrbit(orbitName));
            event.preventDefault();
        };
    };

    const sendRequest = async () => {
        if (!userToken) {
            return;
        }

        const reqIDString: string | null = localStorage.getItem("reqID");
        const reqID: number = reqIDString ? parseInt(reqIDString, 10) : 0;

        const editResult = await changeReqStatus(userToken, {
            ID: reqID,
            Status: "На рассмотрении",
        });

        localStorage.setItem("reqID", "");

        const storedOrbitsString: string[] | undefined = localStorage.getItem('orbits')?.split(',');
        if (storedOrbitsString) {
            storedOrbitsString.forEach((orbitName: string) => {
                dispatch(cartSlice.actions.removeOrbit(orbitName));
            });
            localStorage.setItem("orbits", "");
        }
        setRedirectUrl(`/transfer_requests/${reqID}`);
        setShowSuccess(true);
    };

    const deleteRequest = async () => {
        if (!userToken) {
            return;
        }

        const reqIDString: string | null = localStorage.getItem("reqID");
        const reqID: number = reqIDString ? parseInt(reqIDString, 10) : 0;

        const response = await changeReqStatus(userToken, {
            ID: reqID,
            Status: "Удалена",
        });

        localStorage.setItem("reqID", "");

        const storedOrbitsString: string[] | undefined = localStorage.getItem('orbits')?.split(',');
        if (storedOrbitsString) {
            storedOrbitsString.forEach((orbitName: string) => {
                dispatch(cartSlice.actions.removeOrbit(orbitName));
            });
            localStorage.setItem("orbits", "");
        }
        navigate(`/orbits`);
    };

    const handleErrorClose = () => {
        setShowError(false);
    };

    const handleSuccessClose = () => {
        setShowSuccess(false);

        if (redirectUrl) {
            navigate(redirectUrl);
            setRedirectUrl(null);
        }
    };

    const onDragEnd = async (result: DropResult) => {
        if (!result.destination) return;
    
        const newVisitNumbersOrder = Array.from(Object.entries(visitNumbers));
        const [movedOrbit, movedNumber] = newVisitNumbersOrder.splice(result.source.index, 1)[0];
        newVisitNumbersOrder.splice(result.destination.index, 0, [movedOrbit, movedNumber]);
    
        const newVisitNumbers: { [orbit: string]: number } = {};
        newVisitNumbersOrder.forEach(([orbit, number], index) => {
            newVisitNumbers[orbit] = index + 1;
        });
    
        // сравнение нового состояния с предыдущим
        const changedEntries = Object.entries(newVisitNumbers).filter(([orbit, number]) => {
            return visitNumbers[orbit] !== number;
        });
    
        const changedData: { [orbit: string]: number } = {};
        changedEntries.forEach(([orbit, number]) => {
            changedData[orbit] = number;
        });
    
        dispatch(cartSlice.actions.setVisitNumbers(newVisitNumbers));
    
        const reqIDString: string | null = localStorage.getItem("reqID");
        const reqID: number = reqIDString ? parseInt(reqIDString, 10) : 0;
    
        // отправляю только измененные записи
        const response = await updateVisitNumbers(userToken?.toString(), reqID, changedData);
    };
    


    return (
        <div className="cart-container">
            <Modal show={showError} onHide={handleErrorClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Не получилось добавить орбиту</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleErrorClose}>
                        Закрыть
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showSuccess} onHide={handleSuccessClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Заявка отправлена</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button variant="success" onClick={handleSuccessClose}>
                        Просмотр
                    </Button>
                    <Button onClick={() => (navigate(`/orbits`))} variant="primary" className="button">
                        К орбитам
                    </Button>
                </Modal.Footer>
            </Modal>
            {!userToken && (
                <>
                    <h3> Вам необходимо войти в систему </h3>
                    <Button onClick={() => (navigate(`/auth`))} variant="primary" className="button">
                        Войти
                    </Button>
                </>
            )}
            {userToken && (
                <>
                    {orbits?.length !== 0 && <h3>Выбранные орбиты:</h3>}
                    {orbits?.length === 0 && <h4>Вы ещё не выбрали ни одной орбиты</h4>}

                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="visitNumbers">
                            {(provided) => (
                                <ListGroup
                                    style={{ width: '500px' }}
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    {Object.entries(visitNumbers).map(([orbitName, visitNumber], index) => (
                                        <Draggable key={orbitName} draggableId={orbitName} index={index}>
                                            {(provided, snapshot) => (
                                                <ListGroupItem
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    {orbitName}
                                                    <span className="pull-right button-group" style={{ float: 'right' }}>
                                                        <Button variant="danger" onClick={deleteFromCart(orbitName)}>
                                                            Удалить
                                                        </Button>
                                                    </span>
                                                </ListGroupItem>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </ListGroup>
                            )}
                        </Droppable>
                    </DragDropContext>

                    {orbits?.length !== 0 && (
                        <>
                            <Row>
                                <Col>
                                    <Button
                                        className="common-button"
                                        variant="success"
                                        onClick={sendRequest}
                                        disabled={orbits.length === 0}
                                    >
                                        Сформировать
                                    </Button>
                                </Col>
                                <Col>
                                    <Button
                                        className="common-button"
                                        variant="danger"
                                        onClick={deleteRequest}
                                        disabled={orbits.length === 0}
                                    >
                                        Отменить
                                    </Button>
                                </Col>
                            </Row>
                        </>
                    )}
                    <button onClick={() => navigate("/orbits")}>К орбитам</button>
                </>
            )}
        </div>
    );
};

export default Cart;
