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
    <Card style={{ maxWidth: 500, margin: '100px auto', textAlign: 'center' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <UserOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
          <Title level={2}>聚光灯 · 主题游戏创作征集</Title>
          <div style={{ marginBottom: 16 }}>
            <Text type="secondary" style={{ fontSize: 20, fontWeight: 'bold' }}>
              S1 | 7月18日 - 10月22日
            </Text>
          </div>
        </div>

        <Button
          type="primary"
          size="large"
          icon={<LoginOutlined />}
          loading={loading}
          onClick={handleTapLogin}
          style={{ width: '100%' }}
        >
          点击参与
        </Button>

        <div style={{ fontSize: 12, color: '#999' }}>
          <Text>需要使用Tap账号登录</Text>
        </div>
      </Space>
    </Card>
  );
};

export default TapLogin; 