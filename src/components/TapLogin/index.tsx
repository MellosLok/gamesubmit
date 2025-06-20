import React, { useState } from 'react';
import { Card, Button, Typography, Space, message } from 'antd';
import { LoginOutlined } from '@ant-design/icons';
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
    <Card style={{ maxWidth: 800, margin: '50px auto', padding: '20px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 活动标题 */}
        <div style={{ textAlign: 'center' }}>
          <Title level={2}>聚光灯 · 主题游戏创作征集</Title>
          <Text style={{ fontSize: 18 }}>S1 | 7月18日 - 10月22日</Text>
        </div>

        {/* 活动说明 */}
        <div>
          <Title level={4}>活动介绍</Title>
          <Text>
          定期面向所有开发者举办的主题游戏征集活动，开发者可随时加入，自由投稿游戏，并获得TapTap提供的流量扶持。
          </Text>
        </div>

        <div>
          <Title level={4}>参与规则</Title>
          <Text>
            • 参赛者需使用Tap账号登录报名<br/>
            • 游戏作品需围绕指定主题进行创作<br/>
            • 作品需在10月22日前完成并提交，提交时间越早，获得扶持机会越大<br/>
            • 参赛作品需遵守相关法规和平台规范
          </Text>
        </div>

        <div>
          <Title level={4}>奖励说明</Title>
          <Text>
            XXXXXXXXXXX
          </Text>
        </div>

        <div>
          <Title level={4}>更多详情</Title>
          <Text>
            <a href="#" style={{ color: '#1890ff' }}>点击查看详细活动规则</a>
          </Text>
        </div>

        {/* 登录按钮 */}
        <div style={{ textAlign: 'center' }}>
          <Button
            type="primary"
            size="large"
            icon={<LoginOutlined />}
            loading={loading}
            onClick={handleTapLogin}
            style={{ width: '200px' }}
          >
            点击参与
          </Button>
          <div style={{ marginTop: 16, fontSize: 14, color: '#666' }}>
            <Text>需要使用Tap账号登录</Text>
          </div>
        </div>
      </Space>
    </Card>
  );
};

export default TapLogin; 