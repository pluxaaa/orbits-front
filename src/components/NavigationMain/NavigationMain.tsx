import React, { FC, useState } from 'react';
import { Nav, NavDropdown, Navbar } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../modules/authMethods';
import store, { useAppDispatch } from '../../store/store';
import './NavigationMain.styles.css';

const NavigationMain: FC = () => {
    const { userToken, userRole, userName } = useSelector((state: ReturnType<typeof store.getState>) => state.auth);
    const [showDropdown, setShowDropdown] = useState(false);

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleLogout = () => {
        if (userToken) {
            dispatch(logoutUser(userToken));
            navigate('/orbits');
        }
    };

    return (
        <Navbar expand="sm">
            <NavLink className="logo" to="/orbits" style={{ textDecoration: 'none' }}>ORBIT TRANSFER</NavLink>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <span><NavLink to="/orbits" className="nav-link">Список орбит</NavLink></span>
                <Nav className="ml-auto">
                    {userToken &&
                        <>
                            <NavLink to="/transfer_requests" className="nav-link">Заявки</NavLink>
                            <NavDropdown
                                className="nav-dropdown"
                                title={userName}
                                id="basic-nav-dropdown"
                                show={showDropdown}
                                onMouseEnter={() => setShowDropdown(true)}
                                onMouseLeave={() => setShowDropdown(false)}
                                align={{ sm: 'end' }}
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
                            <NavLink to="/login" className='nav-link'>Вход</NavLink>
                        </>}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default NavigationMain;
