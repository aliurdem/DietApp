import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import CustomersPage from './components/CustomersPage';
import CustomerLogsPage from './components/CustomerLogsPage';
import DietPlanPage from './components/DietPlanPage';
import Layout from './components/Layout';
import './App.css';

const App = () => {
  useEffect(() => {
    const initializeUsers = () => {
      const defaultUser = {
        username: 'ali',
        password: '1234',
      };

      const users = JSON.parse(localStorage.getItem('users')) || [];

      if (users.length === 0) {
        users.push(defaultUser);
        localStorage.setItem('users', JSON.stringify(users));
      }
    };

    initializeUsers();
  }, []);

  useEffect(() => {
    const initializeFoodList = () => {
      const foodList = [
        { name: 'Elma', calorie: 52 },
        { name: 'Muz', calorie: 96 },
        { name: 'Çilek', calorie: 32 },
        { name: 'Pirinç', calorie: 130 },
        { name: 'Tavuk Göğsü', calorie: 165 },
      ];

      if (!localStorage.getItem('food_list')) {
        localStorage.setItem('food_list', JSON.stringify(foodList));
      }
    };

    initializeFoodList();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route element={<Layout />}>
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/customer-logs/:email" element={<CustomerLogsPage />} />
          <Route path="/diet-plan/:email" element={<DietPlanPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
