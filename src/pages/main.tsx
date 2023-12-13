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
import Profile from './ProfilePage';
import TransfReq from './TransfReqPage';
import TransfReqDet from './TransfReqDetPage';
import TransfToOrbit from './TransfToOrbPage';

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
          <Route path="/transfer_requests" Component={TransfReq} />
          <Route path="/transfer_requests/:req_id" Component={TransfReqDet} />
          <Route path="/transfer_to_orbits" Component={TransfToOrbit} />
          <Route path="/auth" Component={AuthPage} />
          <Route path="/profile" Component={Profile} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)
