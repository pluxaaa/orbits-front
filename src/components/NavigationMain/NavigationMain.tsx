import React, { FC, useState } from 'react';
import { Nav, NavDropdown, Navbar } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../modules/auth-actions';
import store, { useAppDispatch } from '../../store/store';
import './NavigationMain.styles.css';
import CartButton from '../CartButton/CartButton';

const NavigationMain: FC = () => {
    const { userToken, userRole, userName } = useSelector((state: ReturnType<typeof store.getState>) => state.auth);
    const [showDropdown, setShowDropdown] = useState(false);

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleLogout = () => {
        if (userToken) {
            dispatch(logoutUser(userToken));
            navigate('/orbits/');
        }
    };

    return (
        <Navbar expand="md">
            <Navbar.Brand className="logo" href="/orbits">ORBIT TRANSFER</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <span><Nav.Link href="/orbits">Список орбит</Nav.Link></span>
                {userToken &&<CartButton />}
                <Nav className="ml-auto">
                    {userToken &&
                        <>
                            <Nav.Link href="/transfer_requests">Заявки</Nav.Link>
                            <NavDropdown
                                className="nav-dropdown"
                                title={userName}
                                id="basic-nav-dropdown"
                                show={showDropdown}
                                onMouseEnter={() => setShowDropdown(true)}
                                onMouseLeave={() => setShowDropdown(false)}
                                align={{ lg: 'end' }}
                            >
                                <NavDropdown.Item
                                    className="navbar-block"
                                    onClick={() => {
                                        navigate('/profile');
                                        setShowDropdown(false);
                                    }}
                                >
                                    Личный кабинет
                                </NavDropdown.Item>
                                <NavDropdown.Item
                                    className="navbar-block"
                                    onClick={() => {
                                        handleLogout();
                                        setShowDropdown(false);
                                    }}
                                >
                                    Выйти
                                </NavDropdown.Item>
                            </NavDropdown>
                        </>}
                    {!userToken &&
                        <>
                            <Nav.Link href="/auth">Вход</Nav.Link>
                        </>}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default NavigationMain;
