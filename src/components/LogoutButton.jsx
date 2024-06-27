import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Button type="primary" onClick={handleLogout} style={{ marginBottom: 16 }}>
        Çıkış Yap
      </Button>
    </div>
  );
};

export default LogoutButton;
