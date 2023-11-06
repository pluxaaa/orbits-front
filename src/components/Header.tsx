import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
    return (
        <div className="header">
            <div className="header-wrapper">
                <Link to='/orbits' className="header-logo">ORBITS</Link>

                <div className="header-blocks">
                    <Link className="header-block" to='/orbits'>Список орбит</Link>
                    <Link className="header-block" to='/orbits'>Контакты</Link>
                </div>

                <Link to='/orbits' className="header-profile">Личный кабинет</Link>
            </div>
        </div>
    )
};

export default Header;
