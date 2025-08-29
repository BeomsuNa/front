import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LoginPage from './page/loginPage.tsx'
import CreatePage from './page/createPage.tsx'
import AboutPage from './page/aboutPage.tsx'
import GalleryPage from './page/galleryPage.tsx'
import BackGroundLayout from './backGroundLayout.tsx'
import MainPage from './page/mainPage.tsx'
import SignupPage from './page/signupPage.tsx'
import AppProviders from './providers/AppProviders.tsx'

export const Layout = () => <BackGroundLayout />
export const Main = () => <MainPage />
export const About = () => <AboutPage />
export const Gallery = () => <GalleryPage />;
export const Create = () => <CreatePage />;
export const Login = () => <LoginPage />;
export const Signup = () => <SignupPage/>;

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout/>,
    children: [
      { index:true, element: <Main /> },
      { path: '/login', element: <Login /> },
      { path: '/create', element: <Create /> },
      { path: '/gallery', element: <Gallery /> },
      { path: '/about', element: <About /> },
      { path: '/signup', element: <Signup /> }
    ]

  },
])
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <AppProviders>
      <RouterProvider router={router} />
      </AppProviders>

  </React.StrictMode>
);