import { FC, useState } from 'react'
import { loginUser } from '../modules/login';

import '../styles/LoginPage.styles.css';


const LoginPage: FC = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
  
    const handleLogin = async () => {
        try {
          const data = {
            username: login,
            password: password
          };
          await loginUser(data);
          
            } catch (error: any) {
              setErrorMessage(error.message as string);
            }
          };

  return (
    <div className="login-card">
      <h2>Авторизация</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className="form-group">
        <label htmlFor="login">Логин:</label>
        <input className="input-login" type="text" id="login" value={login} onChange={(e) => setLogin(e.target.value)} placeholder="Введите логин" />
      </div>
      <div className="form-group">
        <label htmlFor="password">Пароль:</label>
        <input className="input-login" type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Введите пароль" />
      </div>
      <button onClick={handleLogin}>Войти</button>
    </div>
  );
};  

export default LoginPage