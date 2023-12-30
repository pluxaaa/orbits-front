import { FC } from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../modules/authMethods';
import store, { useAppDispatch } from '../../store/store';
import './NavigationMain.styles.css';

const NavigationMain: FC = () => {
    const { userToken, userName } = useSelector((state: ReturnType<typeof store.getState>) => state.auth);

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
                            <NavLink to="/profile" className="nav-link">{userName}</NavLink>
                            <Nav.Item style={{ cursor: 'pointer' }} onClick={handleLogout} className="nav-link">Выйти</Nav.Item>
                        </>}
                    {!userToken &&
                        <>
                            <NavLink style={{ marginRight: '10px' }} to="/login" className='nav-link'>Вход</NavLink>
                            <NavLink style={{ marginRight: '10px' }} to="/register" className='nav-link'>Регистрация</NavLink>
                        </>}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default NavigationMain;
