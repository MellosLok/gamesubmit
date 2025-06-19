import React, { useState } from 'react';
import { Modal, Typography, Button, Form, Input, InputNumber, Select, Space, message } from 'antd';
import { UserOutlined, PhoneOutlined, WechatOutlined, TeamOutlined } from '@ant-design/icons';
import { ReleaseType, Theme } from '../../types';
import { signupAPI, gameAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface AllInfoModalProps {
  open: boolean;
  onClose: () => void;
}

const AllInfoModal: React.FC<AllInfoModalProps> = ({ open, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { user, refreshUser } = useAuth();

  // 初始化表单数据
  React.useEffect(() => {
    if (open && user) {
      form.setFieldsValue({
        // 报名信息
        tapId: user.signupData?.tapId || user.userInfo.tapId,
        phone: user.signupData?.phone,
        wechat: user.signupData?.wechat,
        teamSize: user.signupData?.teamSize,
        // 游戏信息
        gameId: user.gameInfo?.gameId,
        releaseType: user.gameInfo?.releaseType,
        theme: user.gameInfo?.theme,
        themeDescription: user.gameInfo?.themeDescription,
      });
    }
  }, [open, user, form]);

  const handleSave = async (values: any) => {
    if (!user) return;

    setLoading(true);
    try {
      // 保存报名信息
      if (user.signupData) {
        const signupData = {
          tapId: values.tapId,
          phone: values.phone,
          wechat: values.wechat,
          teamSize: values.teamSize,
        };
        await signupAPI.submitSignup(signupData);
      }

      // 保存游戏信息
      if (user.gameInfo) {
        const gameInfo = {
          gameId: values.gameId,
          gameName: user.gameInfo.gameName,
          publisherName: user.gameInfo.publisherName,
          releaseType: values.releaseType,
          theme: values.theme,
          themeDescription: values.themeDescription,
        };
        await gameAPI.submitGameInfo(gameInfo);
      }

      await refreshUser();
      message.success('信息保存成功！');
      setIsEditing(false);
    } catch (error) {
      console.error('Save failed:', error);
      message.error('保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const renderViewMode = () => (
    <div style={{ lineHeight: 2 }}>
      <div style={{ marginBottom: 20 }}>
        <Title level={4}>基本信息</Title>
        <div><strong>Tap ID：</strong>{user?.signupData?.tapId || user?.userInfo.tapId}</div>
        <div><strong>手机号：</strong>{user?.signupData?.phone}</div>
        <div><strong>微信号：</strong>{user?.signupData?.wechat}</div>
        <div><strong>团队人数：</strong>{user?.signupData?.teamSize}人</div>
      </div>
      
      {user?.gameInfo && (
        <div>
          <Title level={4}>游戏信息</Title>
          <div><strong>游戏ID：</strong>{user.gameInfo.gameId}</div>
          <div><strong>游戏名称：</strong>{user.gameInfo.gameName}</div>
          <div><strong>厂商名称：</strong>{user.gameInfo.publisherName}</div>
          <div><strong>上线形式：</strong>{user.gameInfo.releaseType}</div>
          <div><strong>应征主题：</strong>{user.gameInfo.theme}</div>
          <div><strong>主题描述：</strong>{user.gameInfo.themeDescription}</div>
        </div>
      )}
    </div>
  );

  const renderEditMode = () => (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSave}
    >
      <div style={{ marginBottom: 20 }}>
        <Title level={4}>基本信息</Title>
        <Form.Item
          label="Tap ID"
          name="tapId"
        >
          <Input 
            prefix={<UserOutlined />} 
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
      </div>

      {user?.gameInfo && (
        <div>
          <Title level={4}>游戏信息</Title>
          <Form.Item
            label="游戏ID"
            name="gameId"
          >
            <Input disabled style={{ backgroundColor: '#f5f5f5' }} />
          </Form.Item>

          <Form.Item
            label="上线形式"
            name="releaseType"
            rules={[{ required: true, message: '请选择上线形式' }]}
          >
            <Select placeholder="请选择上线形式">
              {Object.values(ReleaseType).map(type => (
                <Option key={type} value={type}>{type}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="应征主题"
            name="theme"
            rules={[{ required: true, message: '请选择应征主题' }]}
          >
            <Select placeholder="请选择应征主题">
              {Object.values(Theme).map(theme => (
                <Option key={theme} value={theme}>{theme}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="主题描述"
            name="themeDescription"
            rules={[
              { required: true, message: '请输入主题描述' },
              { max: 100, message: '主题描述不能超过100字' }
            ]}
          >
            <TextArea
              placeholder="请描述游戏如何体现所选主题（100字以内）"
              rows={4}
              maxLength={100}
              showCount
            />
          </Form.Item>
        </div>
      )}
    </Form>
  );

  return (
    <Modal
      title="报名信息"
      open={open}
      onCancel={onClose}
      footer={null}
      width={700}
      style={{ top: 20 }}
    >
      <div style={{ marginBottom: 20, textAlign: 'right' }}>
        {!isEditing ? (
          <Button type="primary" onClick={() => setIsEditing(true)}>
            修改信息
          </Button>
        ) : (
          <Space>
            <Button onClick={() => setIsEditing(false)}>
              取消
            </Button>
            <Button type="primary" loading={loading} onClick={() => form.submit()}>
              保存
            </Button>
          </Space>
        )}
      </div>

      {isEditing ? renderEditMode() : renderViewMode()}
    </Modal>
  );
};

export default AllInfoModal; 