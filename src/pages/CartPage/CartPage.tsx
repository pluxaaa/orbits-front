import { FC, useState } from "react";
import { Button, Modal, Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { useNavigate } from "react-router-dom";
import { deleteOrbitTransfer } from "../../modules/deleteTransferToOrbit";
import cartSlice from "../../store/cartSlice";
import store, { useAppDispatch } from "../../store/store";
import { changeReqStatus } from "../../modules/changeRequestStatus";
import { DropResult } from "react-beautiful-dnd";
import { updateTransfersOrder } from "../../modules/updateTransfersOrder";
import CartTable from "../../components/CartTable/CartTable";
import "./CartPage.styles.css";

const Cart: FC = () => {
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { userToken } = useSelector((state: ReturnType<typeof store.getState>) => state.auth);
    const orbits = useSelector((state: ReturnType<typeof store.getState>) => state.cart.orbits);
    const transfersOrder = useSelector((state: ReturnType<typeof store.getState>) => state.cart.transfersOrder);

    const deleteFromCart = (orbitName = '') => {
        if (!userToken) {
          return;
        }
        return async ()  => {
          await deleteOrbitTransfer(orbitName, localStorage.getItem("reqID"), userToken)
            .then(() => {
              dispatch(cartSlice.actions.removeOrbit(orbitName));
              if (orbits.length === 1) {
                deleteRequest()
              }
            })
            .catch(() => {
              setShowError(true);
            });
        };
      };

    const sendRequest = async () => {
        if (!userToken) {
            return;
        }

        const reqIDString: string | null = localStorage.getItem("reqID");
        const reqID: number = reqIDString ? parseInt(reqIDString, 10) : 0;

        await changeReqStatus(userToken, {
            ID: reqID,
            Status: "На рассмотрении",
        });

        if (orbits) {
            orbits.forEach((orbitName: string) => {
                dispatch(cartSlice.actions.removeOrbit(orbitName));
            });
            localStorage.setItem("reqID", "")
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

        await changeReqStatus(userToken, {
            ID: reqID,
            Status: "Удалена",
        });

        if (orbits) {
            orbits.forEach((orbitName: string) => {
                dispatch(cartSlice.actions.removeOrbit(orbitName));
            });
            localStorage.setItem("reqID", "")
        }
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

        const newTransfersOrderOrder = Array.from(Object.entries(transfersOrder));
        const [movedOrbit, movedNumber] = newTransfersOrderOrder.splice(result.source.index, 1)[0];
        newTransfersOrderOrder.splice(result.destination.index, 0, [movedOrbit, movedNumber]);

        const newTransfersOrder: { [orbit: string]: number } = {};
        newTransfersOrderOrder.forEach(([orbit, number], index) => {
            newTransfersOrder[orbit] = index + 1;
        });

        // сравнение нового состояния с предыдущим
        const changedEntries = Object.entries(newTransfersOrder).filter(([orbit, number]) => {
            return transfersOrder[orbit] !== number;
        });

        const changedData: { [orbit: string]: number } = {};
        changedEntries.forEach(([orbit, number]) => {
            changedData[orbit] = number;
        });

        dispatch(cartSlice.actions.setTransfersOrder(newTransfersOrder));

        const reqIDString: string | null = localStorage.getItem("reqID");
        const reqID: number = reqIDString ? parseInt(reqIDString, 10) : 0;

        // отправляю только измененные записи
        await updateTransfersOrder(userToken?.toString(), reqID, changedData);
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
                    <Button onClick={() => (navigate(`/login`))} variant="primary" className="button">
                        Войти
                    </Button>
                </>
            )}
            {userToken && (
                <>
                    {orbits?.length !== 0 && <h3>Выбранные орбиты:</h3>}
                    {orbits?.length === 0 && <h4>Вы ещё не выбрали ни одной орбиты</h4>}

                    <CartTable transfersOrder={transfersOrder} deleteFromCart={deleteFromCart} onDragEnd={onDragEnd} />

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
                                        Очистить
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
