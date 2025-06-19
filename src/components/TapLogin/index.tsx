import React, { useState } from 'react';
import { Card, Button, Typography, Space, message } from 'antd';
import { LoginOutlined, UserOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';

const { Title, Text } = Typography;

const TapLogin: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  // 模拟Tap登录流程
  const handleTapLogin = async () => {
    setLoading(true);
    try {
      // 在实际项目中，这里会跳转到Tap的OAuth页面
      // 然后通过回调获取授权码
      // 这里我们模拟一个成功的登录
      await login();
      message.success('登录成功！');
    } catch (error) {
      console.error('Login failed:', error);
      message.error('登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ maxWidth: 400, margin: '100px auto', textAlign: 'center' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <UserOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
          <Title level={2}>GameJam 报名系统</Title>
          <Text type="secondary">请使用Tap账号登录</Text>
        </div>

        <Button
          type="primary"
          size="large"
          icon={<LoginOutlined />}
          loading={loading}
          onClick={handleTapLogin}
          style={{ width: '100%' }}
        >
          使用Tap账号登录
        </Button>

        <div style={{ fontSize: 12, color: '#999' }}>
          <Text>登录后即可参与GameJam报名</Text>
        </div>
      </Space>
    </Card>
  );
};

export default TapLogin; 