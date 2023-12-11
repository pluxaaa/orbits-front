import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter} from 'react-router-dom'
import { Routes, Route } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

import Breadcrumbs from '../components/Breadcrumbs/Breadcrumbs';
import NavigationMain from '../components/NavigationMain/NavigationMain';
import OrbitsAll from './OrbitsAll';
import OrbitDetailed from './OrbitDetailed';
import AuthPage from './AuthPage';
import ProfilePage from './ProfilePage';
import TransfReqPage from './TransfReqPage';

import store from '../store/store';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <NavigationMain />
        <Breadcrumbs />
        <Routes>
          <Route path="/orbits" Component={OrbitsAll} />
          <Route path="/orbits/:orbit_name" Component={OrbitDetailed} />
          <Route path="/transfer_requests" Component={TransfReqPage} />
          <Route path="/auth" Component={AuthPage} />
          <Route path="/profile" Component={ProfilePage} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)