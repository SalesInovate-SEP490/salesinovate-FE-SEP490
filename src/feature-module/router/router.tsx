import React, { useEffect, useState } from 'react'
import { Outlet, Route, Routes } from 'react-router'
import { authRoutes, publicRoutes } from './router.link';
import Header from '../../core/common/header';
import Sidebar from '../../core/common/sidebar';
import ThemeSettings from '../../core/common/theme-settings/themeSettings';
import Error404 from '../pages/error/error-404';
import { useDispatch } from 'react-redux';
import { checkAuth } from '../../core/data/redux/commonSlice';
import ProtectedRoute from './ProtectedRoute';
import { getToken } from '../../utils/jwtUtils';

const ALLRoutes = () => {
  const [token, setToken] = useState<string | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    setToken(getToken());
  }, []);

  const HeaderLayout = () => (
    <>
      <Header />
      <Sidebar />
      <Outlet />
      <ThemeSettings />
    </>
  );
  const AuthPages = () => (
    <>
      <Outlet />
    </>
  );
  return (
    <>
      <Routes>
        <Route path={"/"} element={
          <ProtectedRoute token={token} path={""}>
            <HeaderLayout />
          </ProtectedRoute>
        }>
          {publicRoutes.map((route, idx) => (
            <Route path={route.path} element={
              <ProtectedRoute token={token} path={route.path}>
                {route.element}
              </ProtectedRoute>
            } key={idx} />
          ))}
        </Route>
        <Route path={"/"} element={<AuthPages />}>
          {authRoutes.map((route, idx) => (
            <Route path={route.path} element={
              <ProtectedRoute token={token} path={route.path}>
                {route.element}
              </ProtectedRoute>
            } key={idx} />
          ))}
        </Route>
        {/* All other routes that not match will redirect to 404 page */}
        <Route path='*' element={<Error404 />} />
      </Routes>
    </>
  )
}
export default ALLRoutes
