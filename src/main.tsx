import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider} from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.min.css';

import OrbitsPage from './OrbitsPage'
import OrbitPage from './OrbitPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <OrbitsPage />
  },
  {
    path: '/orbit',
    element: <OrbitPage />
  }
])


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)