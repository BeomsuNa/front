import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LoginPage from './frontend/page/loginPage.tsx'
import CreatePage from './frontend/page/createPage.tsx'
import AboutPage from './frontend/page/aboutPage.tsx'
import GalleryPage from './frontend/page/galleryPage.tsx'
import BackGroundLayout from './backGroundLayout.tsx'
import MainPage from './frontend/page/mainPage.tsx'

export const Layout = () => <BackGroundLayout />
export const Main = () => <MainPage />
export const About = () => <AboutPage />
export const Gallery = () => <GalleryPage />;
export const Create = () => <CreatePage />;
export const Login = () => <LoginPage />;

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout/>,
    children: [
      { index:true, element: <Main /> },
      { path: '/login', element: <Login /> },
      { path: '/create', element: <Create /> },
      { path: '/gallery', element: <Gallery /> },
      { path: '/about', element: <About /> }
    ]

  },
])
ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />,
);