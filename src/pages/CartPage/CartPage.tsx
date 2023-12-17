import { FC, useState, useEffect } from "react";
import { Button, ListGroup, ListGroupItem, Modal } from "react-bootstrap";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { useNavigate } from "react-router-dom";
import { createRequest } from "../../modules/create-request";
import cartSlice from "../../store/cartSlice";
import store, { useAppDispatch } from "../../store/store";
import "./CartPage.styles.css";

const Cart: FC = () => {
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { userToken } = useSelector((state: ReturnType<typeof store.getState>) => state.auth);
    const orbits = useSelector((state: ReturnType<typeof store.getState>) => state.cart.orbits);

    const deleteFromCart = (orbitName = '') => {
        return (event: React.MouseEvent) => {
            dispatch(cartSlice.actions.removeOrbit(orbitName));
            event.preventDefault();
        };
    };

    const addOrbit = async () => {
        if (!orbits || userToken === null) {
            return;
        }

        try {
            const result = await createRequest(orbits, userToken);

            if (result.status === 201) {
                setRedirectUrl(`/transfer_requests/${result.data}`);
                setShowSuccess(true);
            } else {
                setShowError(true);
            }
        } catch (error) {
            console.error("Ошибка при создании заявки:", error);
            setShowError(true);
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
                    <Modal.Title>Заявка сохранена</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button variant="success" onClick={handleSuccessClose}>
                        Просмотр
                    </Button>
                </Modal.Footer>
            </Modal>
            {orbits?.length !== 0 && <h3>Выбранные орбиты:</h3>}
            {orbits?.length === 0 && <h4>Вы ещё не выбрали ни одной орбиты</h4>}
            <ListGroup style={{ width: '500px' }}>
                {orbits?.map((orbitName, orbitID) => (
                    <ListGroupItem key={orbitID}>
                        {orbitName}
                        <span className="pull-right button-group" style={{ float: 'right' }}>
                            <Button variant="danger" onClick={deleteFromCart(orbitName)}>
                                Удалить
                            </Button>
                        </span>
                    </ListGroupItem>
                ))}
            </ListGroup>
            {orbits?.length !== 0 && <button onClick={addOrbit}>Сохранить</button>}
            <button onClick={() => navigate("/orbits")}>К орбитам</button>
        </div>
    );
};

export default Cart;
