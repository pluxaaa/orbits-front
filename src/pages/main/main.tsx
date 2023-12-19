import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import NavigationMain from '../../components/NavigationMain/NavigationMain';
import Footer from '../../components/Footer/Footer';
import Auth from '../AuthPage/AuthPage';
import Cart from '../CartPage/CartPage';
import OrbitDetailed from '../OrbitDetPage/OrbitDetPage';
import OrbitsAll from '../OrbitsAllPage/OrbitsAllPage';
import Profile from '../ProfilePage/ProfilePage';
import TransfReqDet from '../RequestDetPage/RequestDetPage';
import TransfReq from '../RequestsAllPage/RequestsAllPage';
import NotFoundPage from './NotFoundPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';
import store from '../../store/store';

ReactDOM.createRoot(document.getElementById('root')!).render(
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
          <Route path="*" Component={NotFoundPage} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </Provider>
)
