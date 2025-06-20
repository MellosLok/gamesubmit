import React, { useState } from 'react';
import { Form, Input, Select, Button, Card, Typography, message, Space, Tag, Modal } from 'antd';
import { ControlOutlined, CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { GameInfo, ReleaseType, Theme } from '../../types';
import { gameAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface GameFormProps {
  onSuccess: () => void;
}

const GameForm: React.FC<GameFormProps> = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmData, setConfirmData] = useState<GameInfo | null>(null);
  const [gameValidation, setGameValidation] = useState<{
    isValid: boolean;
    gameName?: string;
    publisherName?: string;
    message?: string;
  } | null>(null);
  const { user, refreshUser } = useAuth();

  // 检查是否为编辑模式
  const isEditMode = user?.gameInfo && user?.status === 'signed_up_with_game';

  // 初始化表单数据
  React.useEffect(() => {
    if (isEditMode && user?.gameInfo) {
      form.setFieldsValue({
        gameId: user.gameInfo.gameId,
        releaseType: user.gameInfo.releaseType,
        theme: user.gameInfo.theme,
        themeDescription: user.gameInfo.themeDescription,
      });
      // 设置游戏验证状态
      setGameValidation({
        isValid: true,
        gameName: user.gameInfo.gameName,
        publisherName: user.gameInfo.publisherName,
        message: '验证成功',
      });
    }
  }, [isEditMode, user?.gameInfo, form]);

  // 验证游戏ID
  const validateGameId = async (gameId: string) => {
    if (!gameId) {
      setGameValidation(null);
      return;
    }

    setValidating(true);
    try {
      const response = await gameAPI.validateGameId(gameId);
      
      if (response.success && response.data) {
        setGameValidation(response.data);
        if (response.data.isValid) {
          message.success('游戏ID验证成功！');
        } else {
          message.error(response.data.message || '游戏ID验证失败');
        }
      } else {
        setGameValidation({
          isValid: false,
          message: response.message || '验证失败'
        });
        message.error(response.message || '验证失败');
      }
    } catch (error) {
      console.error('Game validation failed:', error);
      setGameValidation({
        isValid: false,
        message: '验证失败，请重试'
      });
      message.error('验证失败，请重试');
    } finally {
      setValidating(false);
    }
  };

  // 提交游戏信息
  const handleSubmit = async (values: any) => {
    if (!user) {
      message.error('请先登录');
      return;
    }

    // 在编辑模式下不需要验证游戏ID
    if (!isEditMode && !gameValidation?.isValid) {
      message.error('请先验证游戏ID');
      return;
    }

    // 显示确认弹框
    const gameInfo: GameInfo = {
      gameId: values.gameId,
      gameName: isEditMode ? user.gameInfo!.gameName : (gameValidation?.gameName || ''),
      publisherName: isEditMode ? user.gameInfo!.publisherName : (gameValidation?.publisherName || ''),
      releaseType: values.releaseType,
      theme: values.theme,
      themeDescription: values.themeDescription,
    };
    
    setConfirmData(gameInfo);
    setShowConfirm(true);
  };

  const handleConfirmSubmit = async () => {
    if (!confirmData) return;

    setLoading(true);
    try {
      const response = await gameAPI.submitGameInfo(confirmData);
      
      if (response.success) {
        message.success(isEditMode ? '游戏信息修改成功！' : '游戏信息提交成功！');
        await refreshUser();
        onSuccess();
      } else {
        message.error(response.message || '提交失败，请重试');
      }
    } catch (error) {
      console.error('Game submission failed:', error);
      message.error('提交失败，请重试');
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  const renderConfirmModal = () => {
    if (!confirmData) return null;
    
    return (
      <Modal
        title={isEditMode ? "确认修改游戏信息" : "确认游戏信息"}
        open={showConfirm}
        onOk={handleConfirmSubmit}
        onCancel={() => setShowConfirm(false)}
        okText="确认提交"
        cancelText="取消"
        confirmLoading={loading}
        width={500}
      >
        <div style={{ marginBottom: 16 }}>
          <Text type="warning">
            <ExclamationCircleOutlined /> 
            {isEditMode 
              ? "请注意：游戏ID不能修改，但可以修改上线形式、应征主题和主题描述" 
              : "提交后游戏ID无法修改，请确认是否以该游戏参加征集。您可以在稍后修改上线形式，应征主题和主题描述。"
            }
          </Text>
        </div>
        <div style={{ lineHeight: 2 }}>
          <div><strong>游戏ID：</strong>{confirmData.gameId}</div>
          <div><strong>游戏名称：</strong>{confirmData.gameName}</div>
          <div><strong>厂商名称：</strong>{confirmData.publisherName}</div>
          <div><strong>上线形式：</strong>{confirmData.releaseType}</div>
          <div><strong>应征主题：</strong>{confirmData.theme}</div>
          <div><strong>主题描述：</strong>{confirmData.themeDescription}</div>
        </div>
      </Modal>
    );
  };

  return (
    <Card>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Title level={2}>游戏信息</Title>
        <Text type="secondary">{isEditMode ? '修改游戏信息' : '登记投稿游戏'}</Text>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          label={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>游戏ID</span>
              <a href="#" style={{ color: '#1890ff', fontSize: 12 }}>如何在TapTap创建游戏？</a>
            </div>
          }
          name="gameId"
          rules={[
            { required: true, message: '请输入游戏ID' },
            { min: 3, message: '游戏ID至少3位字符' }
          ]}
        >
          <Space.Compact style={{ width: '100%' }}>
            <Input
              prefix={<ControlOutlined />}
              placeholder="请输入游戏ID"
              disabled={isEditMode}
              style={isEditMode ? { backgroundColor: '#f5f5f5' } : {}}
            />
            <Button 
              loading={validating}
              disabled={isEditMode}
              onClick={() => {
                const gameId = form.getFieldValue('gameId');
                if (gameId) {
                  validateGameId(gameId);
                } else {
                  message.warning('请先输入游戏ID');
                }
              }}
            >
              验证
            </Button>
          </Space.Compact>
        </Form.Item>

        {/* 游戏验证结果显示 */}
        {gameValidation && (
          <div style={{ marginBottom: 16 }}>
            {gameValidation.isValid ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircleOutlined style={{ color: '#52c41a' }} />
                <Text type="success">验证成功</Text>
                {gameValidation.gameName && (
                  <Tag color="blue">游戏：{gameValidation.gameName}</Tag>
                )}
                {gameValidation.publisherName && (
                  <Tag color="green">厂商：{gameValidation.publisherName}</Tag>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
                <Text type="danger">{gameValidation.message}</Text>
              </div>
            )}
          </div>
        )}

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

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            size="large"
            style={{ width: '100%' }}
          >
            {isEditMode ? '保存修改' : '提交游戏信息'}
          </Button>
        </Form.Item>
      </Form>

      {renderConfirmModal()}
    </Card>
  );
};

export default GameForm; 