import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Button, Modal, Spinner } from 'react-bootstrap';

import './LoginPage.styles.css';

import { loginUser } from '../../modules/authMethods';
import store, { useAppDispatch } from '../../store/store';

interface InputChangeInterface {
  target: HTMLInputElement;
}


const Login: FC = () => {

  const { loading, error, success } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.auth
  )

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')

  const [showRegisterModal, setShowRegisterModal] = useState(true)

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLoginChange = (event: InputChangeInterface) => {
    setLogin(event.target.value)
  }

  const handlePasswordChange = (event: InputChangeInterface) => {
    setPassword(event.target.value)
  }

  const handleModalClose = () => {
    setShowErrorModal(false);
  };

  const sendLogin = async () => {
    setShowRegisterModal(false)
    await dispatch(loginUser({ login: login, password: password }));
    if (success) {
      navigate('/orbits');
      window.location.reload()
    }
  };

  useEffect(() => {
    if (error) {
      setErrorMessage(error);
      setShowErrorModal(true);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const sendLogin = async () => await dispatch(loginUser({ login: login, password: password }));
      sendLogin()
    }
    if (success && !showRegisterModal) {
      navigate('/orbits');
      window.location.reload()
    }
  }, [showRegisterModal, success])


  return (
    <>
      <Modal show={showErrorModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Ошибка</Modal.Title>
        </Modal.Header>
        <Modal.Body>{errorMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Закрыть
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="login-card">
        <h1>Вход</h1>
        <div className="form-group">
          <label>Логин:</label>
          <input className="input-login" value={login} onChange={handleLoginChange} />
        </div>
        <div className="form-group">
          <label>Пароль:</label>
          <input className="input-login" type="password" value={password} onChange={handlePasswordChange} />
        </div>
        <button onClick={sendLogin} disabled={loading}>
          Войти
        </button>
        <div style={{ textAlign: 'center', marginTop: '30px' }}>Нет аккаунта?</div>
        <button onClick={() => (navigate(`/register`))}>
          Регистрация
        </button>
        {loading ? <Spinner /> : ''}
      </div>
    </>
  );
};

export default Login;