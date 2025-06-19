import React from 'react';
import { Layout, Avatar, Dropdown, Space, Typography } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: `Tap ID: ${user?.userInfo.tapId}`,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  const getStatusText = () => {
    if (!user) return '';
    
    switch (user.status) {
      case 'not_signed_up':
        return '未报名';
      case 'signed_up_no_game':
        return '已报名，待提交游戏';
      case 'signed_up_with_game':
        return `正在以【${user.gameInfo?.gameName}】-【${user.gameInfo?.publisherName}】参加`;
      default:
        return '';
    }
  };

  return (
    <AntHeader style={{ 
      background: '#fff', 
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Typography.Title level={3} style={{ margin: 0, color: '#1890ff' }}>
          GameJam 报名系统
        </Typography.Title>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {user && (
          <>
            <Text type="secondary" style={{ fontSize: 14 }}>
              {getStatusText()}
            </Text>
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              arrow
            >
              <Space style={{ cursor: 'pointer' }}>
                <Avatar 
                  src={user.userInfo.avatar} 
                  icon={<UserOutlined />}
                  size="small"
                />
                <Text>{user.userInfo.username}</Text>
              </Space>
            </Dropdown>
          </>
        )}
      </div>
    </AntHeader>
  );
};

export default Header; 