import React, { useState } from 'react';
import { Card, Typography, Button, Space, Steps, Result } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { UserStatus } from '../../types';
import SignupForm from '../../components/SignupForm';
import GameForm from '../../components/GameForm';
import AllInfoModal from '../../components/AllInfoModal';

const { Title } = Typography;

const Home: React.FC = () => {
  const { user } = useAuth();
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [showGameForm, setShowGameForm] = useState(false);
  const [showAllInfo, setShowAllInfo] = useState(false);

  if (!user) {
    return null; // 用户未登录时，由App组件显示登录页面
  }

  const getCurrentStep = () => {
    switch (user.status) {
      case UserStatus.NOT_SIGNED_UP:
        return 0;
      case UserStatus.SIGNED_UP_NO_GAME:
        return 1;
      case UserStatus.SIGNED_UP_WITH_GAME:
        return 2;
      default:
        return 0;
    }
  };

  const getStepItems = () => [
    {
      title: '登记信息',
      icon: <UserOutlined />,
    },
    {
      title: '投稿游戏',
      icon: <ClockCircleOutlined />,
    },
    {
      title: '完成',
      icon: <CheckCircleOutlined />,
    },
  ];

  const renderContent = () => {
    if (showSignupForm) {
      return (
        <SignupForm
          onSuccess={() => {
            setShowSignupForm(false);
          }}
        />
      );
    }

    if (showGameForm) {
      return (
        <GameForm
          onSuccess={() => {
            setShowGameForm(false);
          }}
        />
      );
    }

    switch (user.status) {
      case UserStatus.NOT_SIGNED_UP:
        return (
          <Result
            icon={<UserOutlined style={{ color: '#1890ff' }} />}
            title="开始报名"
            subTitle="填写基本信息，提交游戏详情"
            extra={
              <Button type="primary" size="large" onClick={() => setShowSignupForm(true)}>
                填写报名信息
              </Button>
            }
          />
        );

      case UserStatus.SIGNED_UP_NO_GAME:
        return (
          <Result
            icon={<ClockCircleOutlined style={{ color: '#faad14' }} />}
            title="报名成功"
            subTitle="请在征集结束前登记投稿游戏"
            extra={
              <Space>
                <Button type="primary" size="large" onClick={() => setShowGameForm(true)}>
                  登记投稿游戏
                </Button>
                <Button size="large" onClick={() => setShowSignupForm(true)}>
                  修改报名信息
                </Button>
              </Space>
            }
          />
        );

      case UserStatus.SIGNED_UP_WITH_GAME:
        return (
          <Result
            icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            title="报名完成"
            subTitle={`您正在以【${user.gameInfo?.gameName} - ${user.gameInfo?.publisherName}】参加本期征集活动。请在征集期内在TapTap正式上架游戏，部分活动奖励将根据游戏在征集期内的数据情况核算发放。`}
            extra={
              <Button type="primary" size="large" onClick={() => setShowAllInfo(true)}>
                查看报名信息
              </Button>
            }
          />
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <Card style={{ marginBottom: 24 }}>
        <Title level={3}>报名进度</Title>
        <Steps
          current={getCurrentStep()}
          items={getStepItems()}
          style={{ marginTop: 16 }}
        />
      </Card>

      {renderContent()}
      <AllInfoModal 
        open={showAllInfo} 
        onClose={() => setShowAllInfo(false)} 
      />
    </div>
  );
};

export default Home; 