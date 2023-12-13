import { FC } from "react";
import {useSelector } from "react-redux/es/hooks/useSelector";
import { Button, ListGroup, ListGroupItem } from "react-bootstrap";
import cartSlice from "../store/cartSlice";
import store, { useAppDispatch } from "../store/store";

interface InputChangeInterface {
    target: HTMLInputElement;
  }

const TransfToOrbit: FC = () => {
    const dispatch = useAppDispatch()

    const {orbits} = useSelector((state: ReturnType<typeof store.getState>) => state.cart)

    const deleteFromCart = (orbitName = '') => {
        return (event: React.MouseEvent) => {
            dispatch(cartSlice.actions.removeOrbit(orbitName))
            event.preventDefault()
        }
    }

    return (
        <>
            <h3>Выбранные орбиты:</h3>
            <ListGroup style={{width: '500px'}}>
                {orbits?.map((orbitName) => (
                    <ListGroupItem> {orbitName}
                        <span className="pull-right button-group" style={{float: 'right'}}>
                            <Button variant="danger" onClick={deleteFromCart(orbitName)}>Удалить</Button>
                        </span>
                    </ListGroupItem>
                ))
                }
            </ListGroup>
        </>
    )

}

export default TransfToOrbit;