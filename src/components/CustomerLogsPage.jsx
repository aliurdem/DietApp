import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Table, Button, Typography, Modal, List, message } from 'antd';
import { MailOutlined, CloseCircleOutlined, UnorderedListOutlined } from '@ant-design/icons';
import './css/CustomerLogsPage.css';

const { Title } = Typography;

const CustomerLogsPage = () => {
  const { email } = useParams();
  const [logs, setLogs] = useState([]);
  const [showLogsModal, setShowLogsModal] = useState(false);

  useEffect(() => {
    const storedLogs = JSON.parse(localStorage.getItem('customer_logs')) || [];
    const filteredLogs = storedLogs.filter(log => log.customer.Email === email);
    setLogs(filteredLogs);
  }, [email]);

  const formatDate = (timestamp) => {
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour12: false,
      timeZone: 'Europe/Istanbul'
    };
    return new Date(timestamp).toLocaleString('tr-TR', options);
  };

  const handleLogsView = () => {
    setShowLogsModal(true);
  };

  const handleCloseLogsModal = () => {
    setShowLogsModal(false);
  };

  const handleEmailSend = () => {
    message.success('Email gönderildi');
    setShowLogsModal(false);
  };

  const columns = [
    {
      title: 'Email',
      dataIndex: ['customer', 'Email'],
      key: 'email',
    },
    {
      title: 'Boy',
      dataIndex: ['customer', 'Height'],
      key: 'height',
    },
    {
      title: 'Kilo',
      dataIndex: ['customer', 'Weight'],
      key: 'weight',
    },
    {
      title: 'Yaş',
      dataIndex: ['customer', 'Age'],
      key: 'age',
    },
    {
      title: 'Tarih',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp) => formatDate(timestamp),
    },
  ];

  return (
    <div className="logs-page-container">
      <div className="logs-content-container">
        <Title level={2}>Müşteri Geçmişi</Title>
          <Button type="primary"  icon={<UnorderedListOutlined /> } onClick={handleLogsView} style={{ marginBottom: 16 }}>
            Logları Görüntüle
          </Button>
        <Table
          dataSource={logs}
          columns={columns}
          rowKey={(record, index) => index.toString()}
          pagination={false}
          scroll={{ y: 400 }}
          className="logs-table"
        />
        
        <Modal
          title="Loglar"
          open={showLogsModal}
          onCancel={handleCloseLogsModal}
          footer={[
            <Button key="back" onClick={handleCloseLogsModal} icon={<CloseCircleOutlined />}>
              Kapat
            </Button>,
            <Button key="submit" type="primary" onClick={handleEmailSend} icon={<MailOutlined />}>
              Mail Gönder
            </Button>,
          ]}
        >
          <List
            dataSource={logs}
            renderItem={log => (
              <List.Item>
                {formatDate(log.timestamp)} - {log.customer.Email} - {log.customer.Height} cm - {log.customer.Weight} kg - {log.customer.Age} yaş
              </List.Item>
            )}
          />
        </Modal>
      </div>
    </div>
  );
};

export default CustomerLogsPage;
