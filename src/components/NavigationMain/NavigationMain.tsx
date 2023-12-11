import { FC } from 'react';
import { useSelector } from 'react-redux';
import store from '../../store/store'
import { Nav } from 'react-bootstrap';
import Navbar from 'react-bootstrap/Navbar';
import './NavigationMain.styles.css';

const NavigationMain: FC = () => {
    const {userToken, userRole} = useSelector((state: ReturnType<typeof store.getState>) => state.auth)
    return (
        <Navbar className="navbar" expand="lg">
            <Navbar.Brand className="navbar-logo" href="/orbits">ORBIT TRANSFER</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="navbar-blocks mr-auto">
                    <Nav.Link className="navbar-block" href="/orbits">Список орбит</Nav.Link>
                </Nav>
                <Nav>
                    {!userToken &&
                        <Nav.Link className="navbar-block" href="/auth">Вход</Nav.Link>
                    }
                    {userToken && userRole == '1' || userRole == '2' &&
                        <Nav.Link className="navbar-block" href="/transfer_requests">Заявки</Nav.Link>
                    }
                    {userToken &&
                        <Nav.Link className="navbar-block" href="/profile">Личный кабинет</Nav.Link>
                    }
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default NavigationMain;
