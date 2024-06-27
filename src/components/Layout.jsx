import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import Unauthorized from './Unauthorized';

const Layout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/';
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  if (!isAuthenticated && !isLoginPage) {
    return <Unauthorized />;
  }

  return (
    <div>
      {!isLoginPage && <LogoutButton />}
      <Outlet />
    </div>
  );
};

export default Layout;
