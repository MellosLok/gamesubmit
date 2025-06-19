import React from 'react';
import { Layout as AntLayout } from 'antd';
import Header from './Header';

const { Content } = AntLayout;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Header />
      <Content style={{ 
        padding: '24px',
        background: '#f5f5f5'
      }}>
        <div style={{ 
          maxWidth: 1200, 
          margin: '0 auto',
          background: '#fff',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          {children}
        </div>
      </Content>
    </AntLayout>
  );
};

export default Layout; 