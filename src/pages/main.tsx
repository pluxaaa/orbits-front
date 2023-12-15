import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter} from 'react-router-dom'
import { Routes, Route } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

import Breadcrumbs from '../components/Breadcrumbs/Breadcrumbs';
import NavigationMain from '../components/NavigationMain/NavigationMain';
import OrbitsAll from './OrbitsAllPage';
import OrbitDetailed from './OrbitDetPage';
import Auth from './AuthPage';
import Profile from './ProfilePage';
import TransfReq from './RequestsAllPage';
import TransfReqDet from './RequestDetPage';
import Cart from './CartPage';

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
          <Route path="/cart" Component={Cart} />
          <Route path="/auth" Component={Auth} />
          <Route path="/profile" Component={Profile} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)
