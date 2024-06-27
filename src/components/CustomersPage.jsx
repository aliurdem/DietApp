import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Modal, Form, Input, InputNumber, Typography, Space, message } from 'antd';
import { EditOutlined, DeleteOutlined, UnorderedListOutlined, NumberOutlined } from '@ant-design/icons';
import './css/CustomersPage.css';

const { confirm } = Modal;
const { Title } = Typography;

const CustomersPage = () => {
  const [data, setData] = useState(() => {
    const localStorageData = localStorage.getItem('customers_data');
    return localStorageData ? JSON.parse(localStorageData) : [];
  });

  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editCustomerId, setEditCustomerId] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (isEditMode && editCustomerId !== null) {
      const selectedCustomer = data.find(item => item.row_id === editCustomerId);
      if (selectedCustomer) {
        form.setFieldsValue(selectedCustomer);
      }
    } else {
      form.resetFields();
    }
  }, [isEditMode, editCustomerId, data, form]);

  const handleFormSubmit = (values) => {
    if (isEditMode) {
      handleUpdate(values);
    } else {
      handleCreate(values);
    }
  };

  const handleCreate = (values) => {
    if (data.some(item => item.Email === values.Email)) {
      message.error('Bu e-posta adresi zaten kayıtlı.');
      return;
    }

    const newCustomer = {
      row_id: data.length > 0 ? data[data.length - 1].row_id + 1 : 1,
      ...values
    };
    const updatedData = [...data, newCustomer];
    setData(updatedData);
    updateLocalStorage(updatedData);
    logCustomerAction('create', newCustomer);
    form.resetFields();
    setShowForm(false);
  };

  const handleUpdate = (values) => {
    if (data.some(item => item.Email === values.Email && item.row_id !== editCustomerId)) {
      message.error('Bu e-posta adresi zaten kayıtlı.');
      return;
    }

    const updatedData = data.map(item =>
      item.row_id === editCustomerId ? { ...item, ...values } : item
    );
    setData(updatedData);
    updateLocalStorage(updatedData);
    logCustomerAction('update', { ...values, Email: values.Email });
    form.resetFields();
    setShowForm(false);
  };

  const handleDelete = (row_id) => {
    const deletedCustomer = data.find(item => item.row_id === row_id);
    confirm({
      title: 'Müşteriyi silmek istediğinizden emin misiniz?',
      onOk() {
        const updatedData = data.filter(item => item.row_id !== row_id);
        setData(updatedData);
        updateLocalStorage(updatedData);
        removeCustomerLogs(deletedCustomer.Email);
        logCustomerAction('delete', deletedCustomer);
      },
      onCancel() {},
    });
  };

  const removeCustomerLogs = (email) => {
    const logs = JSON.parse(localStorage.getItem('customer_logs')) || [];
    const updatedLogs = logs.filter(log => log.customer.Email !== email);
    localStorage.setItem('customer_logs', JSON.stringify(updatedLogs));
  };

  const updateLocalStorage = (updatedData) => {
    localStorage.setItem('customers_data', JSON.stringify(updatedData));
  };

  const logCustomerAction = (actionType, customer) => {
    const logs = JSON.parse(localStorage.getItem('customer_logs')) || [];
    const log = {
      action: actionType,
      timestamp: new Date().toISOString(),
      customer: {
        Email: customer.Email,
        Height: customer.Height,
        Weight: customer.Weight,
        Age: customer.Age,
      }
    };
    logs.push(log);
    localStorage.setItem('customer_logs', JSON.stringify(logs));
  };

  const openUpdateForm = (item) => {
    setEditCustomerId(item.row_id);
    setIsEditMode(true);
    setShowForm(true);
  };

  const toggleForm = () => {
    form.resetFields();
    setShowForm(prev => !prev);
    setIsEditMode(false);
    setEditCustomerId(null);
  };

  const closeForm = () => {
    setShowForm(false);
    setIsEditMode(false);
    setEditCustomerId(null);
    form.resetFields();
  };

  const columns = [
    {
      title: 'E-posta',
      dataIndex: 'Email',
      key: 'Email',
    },
    {
      title: 'Adı',
      dataIndex: 'Name',
      key: 'Name',
    },
    {
      title: 'Boy',
      dataIndex: 'Height',
      key: 'Height',
    },
    {
      title: 'Kilo',
      dataIndex: 'Weight',
      key: 'Weight',
    },
    {
      title: 'Yaş',
      dataIndex: 'Age',
      key: 'Age',
    },
    {
      title: 'İşlemler',
      key: 'operation',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" icon={<EditOutlined />} onClick={() => openUpdateForm(record)} />
          <Button type="danger" icon={<DeleteOutlined />} onClick={() => handleDelete(record.row_id)} />
          <Link to={`/customer-logs/${record.Email}`}>
            <Button icon={<UnorderedListOutlined />} />
          </Link>
          <Link to={`/diet-plan/${record.Email}`}>
            <Button icon={<NumberOutlined />} />
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <div className="page-container">
      <div className="content-container">
        <Title level={2}>Müşteriler</Title>
        <Button type="primary" onClick={toggleForm} style={{ marginBottom: 16 }}>
          Yeni Müşteri Ekle
        </Button>
        <Modal
          title={isEditMode ? 'Müşteri Güncelle' : 'Yeni Müşteri Ekle'}
          open={showForm}
          onCancel={closeForm}
          footer={null}
        >
          <Form layout="vertical" onFinish={handleFormSubmit} form={form}>
            <Form.Item label="Adı" name="Name" rules={[{ required: true, message: 'Lütfen adı girin' }]}>
              <Input className="custom-input" />
            </Form.Item>
            <Form.Item label="Boy" name="Height" rules={[{ required: true, message: 'Lütfen boyu girin' }]}>
              <InputNumber min={0} className="custom-input" />
            </Form.Item>
            <Form.Item label="Kilo" name="Weight" rules={[{ required: true, message: 'Lütfen kiloyu girin' }]}>
              <InputNumber min={0} className="custom-input" />
            </Form.Item>
            <Form.Item label="E-posta" name="Email" rules={[{ required: true, type: 'email', message: 'Geçerli bir e-posta girin' }]}>
              <Input className="custom-input" />
            </Form.Item>
            <Form.Item label="Yaş" name="Age">
              <InputNumber min={0} className="custom-input" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                {isEditMode ? 'Güncelle' : 'Müşteri Ekle'}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
        <Table
          dataSource={data}
          columns={columns}
          rowKey="row_id"
          pagination={false}
          scroll={{ y: 400 }}
          className="customers-table"
        />
      </div>
    </div>
  );
};

export default CustomersPage;
