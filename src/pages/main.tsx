import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter} from 'react-router-dom'
import { Routes, Route } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

import Breadcrumbs from '../components/Breadcrumbs';
import NavigationMain from '../components/NavigationMain';
import OrbitsAll from './OrbitsAll';
import OrbitDetailed from './OrbitDetailed';
import LoginPage from './loginPage';
import LogoutPage from './logoutPage';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <NavigationMain />
      <Breadcrumbs />
      <Routes>
        <Route path="/login" Component={LoginPage} />
        <Route path="/logout" Component={LogoutPage} />
        <Route path="/orbits" Component={OrbitsAll} />
        <Route path="/orbits/:orbit_name" Component={OrbitDetailed} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
