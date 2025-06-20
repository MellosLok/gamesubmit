import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, Space, message, Divider } from 'antd';
import { LoginOutlined, ClockCircleOutlined, TrophyOutlined, TeamOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';

const { Title, Text, Paragraph } = Typography;

const TapLogin: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const { login } = useAuth();

  // 设置结束时间：2024年10月22日 23:59:59
  const endDate = new Date('2024-10-22T23:59:59').getTime();

  // 倒计时计算
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endDate - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 模拟Tap登录流程
  const handleTapLogin = async () => {
    setLoading(true);
    try {
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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* 顶部Banner */}
      <div style={{ 
        background: 'linear-gradient(45deg, #1a1a1a 0%, #2d2d2d 100%)',
        padding: '40px 20px',
        textAlign: 'center',
        color: 'white',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
      }}>
        <Title level={1} style={{ color: 'white', marginBottom: 16 }}>
          聚光灯 · 主题游戏创作征集
        </Title>
        <Text style={{ fontSize: 20, color: '#ffd700' }}>
          S1 | 7月18日 - 10月22日
        </Text>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px' }}>
        {/* 倒计时和参与按钮 */}
        <Card style={{ marginBottom: 32, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' }}>
          {/* 倒计时 */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <Title level={3} style={{ marginBottom: 16 }}>
              <ClockCircleOutlined style={{ marginRight: 8, color: '#1890ff' }} />
              征集结束倒计时
            </Title>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: 32, 
                  fontWeight: 'bold', 
                  color: '#1890ff',
                  background: '#f0f8ff',
                  padding: '12px 16px',
                  borderRadius: 8,
                  minWidth: 80
                }}>
                  {timeLeft.days}
                </div>
                <Text style={{ fontSize: 14, color: '#666' }}>天</Text>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: 32, 
                  fontWeight: 'bold', 
                  color: '#1890ff',
                  background: '#f0f8ff',
                  padding: '12px 16px',
                  borderRadius: 8,
                  minWidth: 80
                }}>
                  {timeLeft.hours}
                </div>
                <Text style={{ fontSize: 14, color: '#666' }}>时</Text>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: 32, 
                  fontWeight: 'bold', 
                  color: '#1890ff',
                  background: '#f0f8ff',
                  padding: '12px 16px',
                  borderRadius: 8,
                  minWidth: 80
                }}>
                  {timeLeft.minutes}
                </div>
                <Text style={{ fontSize: 14, color: '#666' }}>分</Text>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: 32, 
                  fontWeight: 'bold', 
                  color: '#1890ff',
                  background: '#f0f8ff',
                  padding: '12px 16px',
                  borderRadius: 8,
                  minWidth: 80
                }}>
                  {timeLeft.seconds}
                </div>
                <Text style={{ fontSize: 14, color: '#666' }}>秒</Text>
              </div>
            </div>
          </div>

          <Divider />

          {/* 参与按钮 */}
          <div style={{ textAlign: 'center' }}>
            <Button
              type="primary"
              size="large"
              icon={<LoginOutlined />}
              loading={loading}
              onClick={handleTapLogin}
              style={{ 
                width: '100%', 
                height: 60, 
                fontSize: 18,
                background: 'linear-gradient(45deg, #1890ff, #722ed1)',
                border: 'none',
                borderRadius: 12
              }}
            >
              立即参与征集
            </Button>
            <div style={{ marginTop: 16, fontSize: 14, color: '#666' }}>
              <Text>需要使用Tap账号登录</Text>
            </div>
          </div>
        </Card>

        {/* 活动介绍 */}
        <Card style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' }}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* 活动介绍 */}
            <div>
              <Title level={4}>
                <TrophyOutlined style={{ marginRight: 8, color: '#faad14' }} />
                活动介绍
              </Title>
              <Paragraph style={{ fontSize: 16, lineHeight: 1.8 }}>
                定期面向所有开发者举办的主题游戏征集活动，开发者可随时加入，自由投稿游戏，并获得TapTap提供的流量扶持。
              </Paragraph>
            </div>

            {/* 参与规则 */}
            <div>
              <Title level={4}>
                <TeamOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                参与规则
              </Title>
              <div style={{ fontSize: 15, lineHeight: 1.8 }}>
                <ul style={{ paddingLeft: 20 }}>
                  <li>参赛者需使用Tap账号登录报名</li>
                  <li>游戏作品需围绕指定主题进行创作</li>
                  <li>作品需在10月22日前完成并提交，提交时间越早，获得扶持机会越大</li>
                  <li>参赛作品需遵守相关法规和平台规范</li>
                </ul>
              </div>
            </div>

            {/* 奖励说明 */}
            <div>
              <Title level={4}>
                <TrophyOutlined style={{ marginRight: 8, color: '#eb2f96' }} />
                奖励说明
              </Title>
              <Text>
                XXXXXXXXXXX
              </Text>
            </div>

            {/* 更多详情 */}
            <div>
              <Title level={4}>更多详情</Title>
              <Text>
                <a href="#" style={{ color: '#1890ff', fontSize: 16 }}>点击查看详细活动规则</a>
              </Text>
            </div>
          </Space>
        </Card>
      </div>
    </div>
  );
};

export default TapLogin; 