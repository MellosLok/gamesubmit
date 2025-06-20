import React, { useState } from 'react';
import { Form, Input, InputNumber, Button, Card, Typography, message, Modal } from 'antd';
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
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmData, setConfirmData] = useState<SignupFormData | null>(null);
  const { user, refreshUser } = useAuth();

  // 检查是否为编辑模式
  const isEditMode = user?.signupData && user?.status !== 'not_signed_up';

  // 初始化表单数据
  React.useEffect(() => {
    if (isEditMode && user?.signupData) {
      form.setFieldsValue({
        tapId: user.signupData.tapId,
        phone: user.signupData.phone,
        wechat: user.signupData.wechat,
        teamSize: user.signupData.teamSize,
      });
    }
  }, [isEditMode, user?.signupData, form]);

  const handleSubmit = async (values: SignupFormData) => {
    if (!user) {
      message.error('请先登录');
      return;
    }

    // 显示确认弹框
    setConfirmData({
      ...values,
      tapId: user.userInfo.tapId,
    });
    setShowConfirm(true);
  };

  const handleConfirmSubmit = async () => {
    if (!confirmData) return;

    setLoading(true);
    try {
      const response = await signupAPI.submitSignup(confirmData);
      
      if (response.success) {
        message.success(isEditMode ? '报名信息修改成功！' : '报名成功！');
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
      setShowConfirm(false);
    }
  };

  const renderConfirmModal = () => {
    if (!confirmData) return null;
    
    return (
      <Modal
        title={isEditMode ? "确认修改报名信息" : "确认报名信息"}
        open={showConfirm}
        onOk={handleConfirmSubmit}
        onCancel={() => setShowConfirm(false)}
        okText="确认提交"
        cancelText="取消"
        confirmLoading={loading}
        width={500}
      >
        <div style={{ lineHeight: 2 }}>
          <div><strong>Tap ID：</strong>{confirmData.tapId}</div>
          <div><strong>手机号：</strong>{confirmData.phone}</div>
          <div><strong>微信号：</strong>{confirmData.wechat}</div>
          <div><strong>团队人数：</strong>{confirmData.teamSize}人</div>
        </div>
      </Modal>
    );
  };

  return (
    <Card>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Title level={2}>基本信息</Title>
        <Text type="secondary">{isEditMode ? '修改报名信息' : '填写基本信息完成报名'}</Text>
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
          label="手机号"
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
          label="微信号"
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
          label="团队人数"
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
            size="large"
            style={{ width: '100%' }}
          >
            {isEditMode ? '保存修改' : '提交报名'}
          </Button>
        </Form.Item>
      </Form>

      {renderConfirmModal()}
    </Card>
  );
};

export default SignupForm; 