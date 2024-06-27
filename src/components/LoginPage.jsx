import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, message } from 'antd';
import './css/login.css';

const { Title } = Typography;

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (values) => {
    const users = JSON.parse(localStorage.getItem('users')) || [];

    const user = users.find(user => user.username === values.username && user.password === values.password);

    if (user) {
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/customers');
    } else {
      message.error('Kullanıcı adı veya şifre hatalı.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-frame">
        <div className="logo-container">
          <img src="src/assets/logo.png" alt="Logo" className="logo" />
        </div>
        <Form name="login" onFinish={handleLogin} className="login-form">
          <Title level={3} className="login-title">Giriş Yap</Title>
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Lütfen kullanıcı adınızı girin!' }]}
          >
            <Input
              placeholder="Kullanıcı Adı"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Lütfen şifrenizi girin!' }]}
          >
            <Input.Password
              placeholder="Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              size="large"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-button" size="large">
              Giriş Yap
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
