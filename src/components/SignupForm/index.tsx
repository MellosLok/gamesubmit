import React, { useState } from 'react';
import { Form, Input, InputNumber, Button, Card, Typography, message } from 'antd';
import { UserOutlined, PhoneOutlined, WechatOutlined, TeamOutlined } from '@ant-design/icons';
import { SignupFormData } from '../../types';
import { signupAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const { Title, Text } = Typography;

interface SignupFormProps {
  onSuccess: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { user, refreshUser } = useAuth();

  const handleSubmit = async (values: SignupFormData) => {
    if (!user) {
      message.error('请先登录');
      return;
    }

    setLoading(true);
    try {
      const formData: SignupFormData = {
        ...values,
        tapId: user.userInfo.tapId,
      };

      const response = await signupAPI.submitSignup(formData);
      
      if (response.success) {
        message.success('报名成功！');
        await refreshUser();
        onSuccess();
      } else {
        message.error(response.message || '报名失败，请重试');
      }
    } catch (error) {
      console.error('Signup failed:', error);
      message.error('报名失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Title level={2}>GameJam 报名表单</Title>
        <Text type="secondary">请填写以下信息完成报名</Text>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          tapId: user?.userInfo.tapId || '',
        }}
      >
        <Form.Item
          label="Tap ID"
          name="tapId"
          rules={[{ required: true, message: 'Tap ID不能为空' }]}
        >
          <Input 
            prefix={<UserOutlined />} 
            placeholder="Tap ID" 
            disabled 
            style={{ backgroundColor: '#f5f5f5' }}
          />
        </Form.Item>

        <Form.Item
          label="联系人手机号"
          name="phone"
          rules={[
            { required: true, message: '请输入手机号' },
            { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式' }
          ]}
        >
          <Input 
            prefix={<PhoneOutlined />} 
            placeholder="请输入手机号" 
            maxLength={11}
          />
        </Form.Item>

        <Form.Item
          label="联系人微信号"
          name="wechat"
          rules={[
            { required: true, message: '请输入微信号' },
            { min: 6, message: '微信号至少6位字符' }
          ]}
        >
          <Input 
            prefix={<WechatOutlined />} 
            placeholder="请输入微信号" 
          />
        </Form.Item>

        <Form.Item
          label="团队人数预估"
          name="teamSize"
          rules={[
            { required: true, message: '请输入团队人数' },
            { type: 'number', min: 1, max: 50, message: '团队人数应在1-50人之间' }
          ]}
        >
          <InputNumber
            prefix={<TeamOutlined />}
            placeholder="请输入团队人数"
            min={1}
            max={50}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            size="large"
            style={{ width: '100%' }}
          >
            提交报名
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default SignupForm; 