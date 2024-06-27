import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Typography, List, Button, Modal, Select, message, Col, Row, Radio } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import './css/DietPlanPage.css';

const { Title, Text } = Typography;
const { Option } = Select;

const DietPlanPage = () => {
  const { email } = useParams();
  const [customer, setCustomer] = useState(null);
  const [bmi, setBmi] = useState(null);
  const [bmiCategory, setBmiCategory] = useState('');
  const [dailyCalories, setDailyCalories] = useState(2000); 
  const [mealPlan, setMealPlan] = useState({
    breakfast: [],
    lunch: [],
    dinner: []
  });
  const [selectedFood, setSelectedFood] = useState(null);
  const [visible, setVisible] = useState(false);
  const [currentMeal, setCurrentMeal] = useState('');
  const [mealSummaryVisible, setMealSummaryVisible] = useState(false);
  const [goal, setGoal] = useState(''); 
  const [goalModalVisible, setGoalModalVisible] = useState(true); 
  const foodList = JSON.parse(localStorage.getItem('food_list')) || [];

  useEffect(() => {
    const customersData = JSON.parse(localStorage.getItem('customers_data')) || [];
    const foundCustomer = customersData.find(c => c.Email === email);
    if (foundCustomer) {
      setCustomer(foundCustomer);
      calculateBMI(foundCustomer.Weight, foundCustomer.Height);
    }
  }, [email]);

  useEffect(() => {
    if (bmi && goal) {
      let baseCalories = 2000;

      if (bmi < 18.5) {
        baseCalories -= 500; 
      } else if (bmi >= 18.5 && bmi < 24.9) {} 
      else if (bmi >= 25 && bmi < 29.9) {
        baseCalories += 300; 
      } else if (bmi >= 30) {
        baseCalories += 500; 
      }

      if (goal === 'gain') {
        baseCalories += 500; 
      } else if (goal === 'lose') {
        baseCalories -= 500; 
      }

      baseCalories = Math.round(baseCalories); 
      setDailyCalories(baseCalories > 1200 ? baseCalories : 1200);
      determineBMICategory(bmi);
    }
  }, [bmi, goal]);

  const calculateBMI = (weight, height) => {
    const heightInMeters = height / 100;
    const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(2);
    setBmi(bmiValue);
  };

  const determineBMICategory = (bmi) => {
    if (bmi < 18.5) setBmiCategory('Zayıf');
    else if (bmi >= 18.5 && bmi < 24.9) setBmiCategory('Normal');
    else if (bmi >= 25 && bmi < 29.9) setBmiCategory('Kilolu');
    else if (bmi >= 30) setBmiCategory('Obez');
  };

  const addFoodToMeal = () => {
    if (!selectedFood) {
      message.error('Lütfen bir yiyecek seçin');
      return;
    }

    const newMeal = [...mealPlan[currentMeal], selectedFood];
    const totalCalories = newMeal.reduce((sum, food) => sum + food.calorie, 0);

    const maxCaloriesPerMeal = dailyCalories / 3;

    if (totalCalories > maxCaloriesPerMeal) {
      message.error(`Bu öğünün kalorisi ${Math.round(maxCaloriesPerMeal)} kaloriyi aşamaz`);
      return;
    }

    setMealPlan({ ...mealPlan, [currentMeal]: newMeal });
    setVisible(false);
    setSelectedFood(null);
  };

  const removeFoodFromMeal = (meal, index) => {
    const newMeal = mealPlan[meal].filter((_, i) => i !== index);
    setMealPlan({ ...mealPlan, [meal]: newMeal });
  };

  const showAddFoodModal = (meal) => {
    setCurrentMeal(meal);
    setSelectedFood(null); 
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const calculateRemainingCalories = (meal) => {
    const consumedCalories = mealPlan[meal].reduce((sum, food) => sum + food.calorie, 0);
    return Math.round(dailyCalories / 3 - consumedCalories);
  };

  const showMealSummary = () => {
    setMealSummaryVisible(true);
  };

  const sendEmail = () => {
    message.success('Mail gönderildi');
  };

  const handleGoalSelection = () => {
    if (goal) {
      setGoalModalVisible(false);
    } else {
      message.error('Lütfen bir amaç seçin');
    }
  };

  if (!customer) {
    return <div>Müşteri bulunamadı</div>;
  }

  const mealSummary = (
    <div className="meal-summary">
      <Title level={4}>Kahvaltı</Title>
      <ul>
        {mealPlan.breakfast.map((item, index) => (
          <li key={index}>{item.name} - {item.calorie} kalori</li>
        ))}
      </ul>
      <Title level={4} style={{ marginTop: 20 }}>Öğle Yemeği</Title>
      <ul>
        {mealPlan.lunch.map((item, index) => (
          <li key={index}>{item.name} - {item.calorie} kalori</li>
        ))}
      </ul>
      <Title level={4} style={{ marginTop: 20 }}>Akşam Yemeği</Title>
      <ul>
        {mealPlan.dinner.map((item, index) => (
          <li key={index}>{item.name} - {item.calorie} kalori</li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="diet-plan-container">
      <Card title={`${customer.Name} için Diyet Planı`} bordered={false} style={{ width: '100%' }}>
        <Row gutter={16}>
          <Col span={8}>
            <Text strong>Boy:</Text> {customer.Height} cm
          </Col>
          <Col span={8}>
            <Text strong>Kilo:</Text> {customer.Weight} kg
          </Col>
          <Col span={8}>
            <Text strong>Yaş:</Text> {customer.Age}
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: 10 }}>
          <Col span={8}>
            <Title level={4}>BMI: {bmi}</Title>
          </Col>
          <Col span={8}>
            <Title level={4}>Kategori: {bmiCategory}</Title>
          </Col>
          <Col span={8}>
            <Title level={4}>Günlük Kalori İhtiyacı: {dailyCalories}</Title>
          </Col>
        </Row>

        <Row gutter={16} style={{ marginTop: 20 }}>
          {['breakfast', 'lunch', 'dinner'].map((meal) => (
            <Col span={8} key={meal}>
              <Card title={`${meal === 'breakfast' ? 'Kahvaltı' : meal === 'lunch' ? 'Öğle Yemeği' : 'Akşam Yemeği'} (${calculateRemainingCalories(meal)}/${Math.round(dailyCalories / 3)} kalori)`} bordered={true} className="meal-card">
                <div className="meal-content">
                  <List
                    bordered
                    dataSource={mealPlan[meal]}
                    renderItem={(item, index) => (
                      <List.Item
                        actions={[<Button type="link" icon={<CloseCircleOutlined />} onClick={() => removeFoodFromMeal(meal, index)} />]}
                      >
                        {item.name} - {item.calorie} kalori
                      </List.Item>
                    )}
                  />
                </div>
                <Button type="primary" onClick={() => showAddFoodModal(meal)} style={{ marginTop: '10px' }}>Yiyecek Ekle</Button>
              </Card>
            </Col>
          ))}
        </Row>

        <Row gutter={16} style={{ marginTop: 20 }}>
          <Col span={24}>
            <Button type="primary" onClick={showMealSummary} style={{ width: '100%' }}>Öğünleri Görüntüle</Button>
          </Col>
        </Row>
      </Card>

      <Modal
        title="Yiyecek Ekle"
        visible={visible}
        onCancel={handleCancel}
        onOk={addFoodToMeal}
      >
        <Select
          style={{ width: '100%' }}
          value={selectedFood ? selectedFood.name : undefined} // Boş seçim
          onChange={value => setSelectedFood(foodList.find(food => food.name === value))}
        >
          {foodList.map(food => (
            <Option key={food.name} value={food.name}>
              {food.name} - {food.calorie} kalori
            </Option>
          ))}
        </Select>
      </Modal>

      <Modal
        title="Diyet Listesi"
        visible={mealSummaryVisible}
        onCancel={() => setMealSummaryVisible(false)}
        footer={
          <Row justify="end" gutter={8}>
            <Col>
              <Button onClick={() => setMealSummaryVisible(false)}>Kapat</Button>
            </Col>
            <Col>
              <Button type="primary" onClick={sendEmail}>Mail Gönder</Button>
            </Col>
          </Row>
        }
        centered
      >
        {mealSummary}
      </Modal>

      <Modal
        title="Diyet Amacınızı Seçin"
        visible={goalModalVisible}
        onCancel={() => setGoalModalVisible(false)}
        footer={
          <Row justify="end" gutter={8}>
            <Col>
              <Button onClick={handleGoalSelection}>Onayla</Button>
            </Col>
          </Row>
        }
        centered
        closable={false}
      >
        <Radio.Group onChange={(e) => setGoal(e.target.value)} value={goal}>
          <Radio value="gain">Kilo Almak</Radio>
          <Radio value="lose">Kilo Vermek</Radio>
        </Radio.Group>
      </Modal>
    </div>
  );
};

export default DietPlanPage;
