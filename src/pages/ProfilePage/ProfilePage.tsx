import { FC } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../modules/authMethods';
import store, { useAppDispatch } from '../../store/store';
import './ProfilePage.styles.css';

const Profile: FC = () => {
    const { userToken, userName, userRole } = useSelector((state: ReturnType<typeof store.getState>) => state.auth);
    const isUserPresent = userToken !== undefined && userToken !== '';

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        if (userToken != null) {
            dispatch(logoutUser(userToken));
            navigate('/orbits/');
        }
    }

    return (
        <div className="profile-container">
            {!isUserPresent &&
                <h3 style={{ textAlign: 'center', fontSize: '2em', margin: 'auto', padding: 100 }}> 
                    Вам необходимо войти в систему
                </h3>
            }
            {isUserPresent &&
                <>
                    <h1> Аккаунт </h1>
                    {userRole == '1' && <p>Клиент</p> }
                    {userRole == '2' && <p>Модератор</p> }
                    <p>{userName}</p>
                    <button onClick={handleLogout}> Выйти из системы </button>
                </>
            }
        </div>
    );
}

export default Profile;
