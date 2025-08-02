import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './frontend/page/homePage.tsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MainPage from './frontend/page/homePage.tsx'
import LoginPage from './frontend/page/LoginPage.tsx'
import CreatePage from './frontend/page/CreatePage.tsx'
import AboutPage from './frontend/page/AboutPage.tsx'
import GalleryPage from './frontend/page/GalleryPage.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
    { path: '/', element: <MainPage /> },
    { path: '/login', element: <LoginPage /> },
    { path: '/create', element: <CreatePage />},
    { path: '/gallery', element: <GalleryPage /> },
    { path: '/about', element: <AboutPage /> }
    ]
  },
])
ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />,
);