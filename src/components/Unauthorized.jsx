import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Card } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import './css/Unauthorized.css';

const { Title, Text } = Typography;

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate('/');
  };

  return (
    <div className="unauthorized-container">
      <Card className="unauthorized-card">
        <LockOutlined style={{ fontSize: '64px', color: '#ff4d4f' }} />
        <Title level={2}>Bu sayfaya erişiminiz yok</Title>
        <Text type="secondary">Lütfen giriş yapın</Text>
        <br />
        <Button type="primary" onClick={handleLoginRedirect} style={{ marginTop: '20px' }}>
          Giriş Yap
        </Button>
      </Card>
    </div>
  );
};

export default Unauthorized;
