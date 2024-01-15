import { Link } from 'react-router-dom';
import './MenuPage.styles.css';
import { useSelector } from 'react-redux';
import store from '../../store/store';

const HomePage = () => {
    const { userRole, userToken } = useSelector((state: ReturnType<typeof store.getState>) => state.auth);

    return (
        <div className="table-container">
            <table>
                <tbody>
                    <tr>
                        <td colSpan={1} style={{ textAlign: 'center' }}>
                            <h2>Меню</h2>
                        </td>
                    </tr>
                    {!userToken && (
                        <>
                            <tr>
                                <td>
                                    <Link to="/register">
                                        <div className="table-cell-link">Зарегистрироваться</div>
                                    </Link>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <Link to="/login">
                                        <div className="table-cell-link">Войти</div>
                                    </Link>
                                </td>
                            </tr>
                        </>)}
                    <tr>
                        <td>
                            <Link to="/orbits">
                                <div className="table-cell-link">Орбиты</div>
                            </Link>
                        </td>
                    </tr>
                    {userRole == '2' && (
                    <tr>
                        <td>
                            <Link to="/orbits/add">
                                <div className="table-cell-link">Новая орбита</div>
                            </Link>
                        </td>
                    </tr>
                    )}
                    {userToken && (
                    <tr>
                        <td>
                            <Link to="/transfer_requests">
                                <div className="table-cell-link">Заявки</div>
                            </Link>
                        </td>
                    </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default HomePage;
