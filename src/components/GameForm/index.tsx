import React, { useState } from 'react';
import { Form, Input, Select, Button, Card, Typography, message, Space, Tag } from 'antd';
import { ControlOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
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
  const [gameValidation, setGameValidation] = useState<{
    isValid: boolean;
    gameName?: string;
    publisherName?: string;
    message?: string;
  } | null>(null);
  const { user, refreshUser } = useAuth();

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

    if (!gameValidation?.isValid) {
      message.error('请先验证游戏ID');
      return;
    }

    setLoading(true);
    try {
      const gameInfo: GameInfo = {
        gameId: values.gameId,
        gameName: gameValidation.gameName || '',
        publisherName: gameValidation.publisherName || '',
        releaseType: values.releaseType,
        theme: values.theme,
        themeDescription: values.themeDescription,
      };

      const response = await gameAPI.submitGameInfo(gameInfo);
      
      if (response.success) {
        message.success('游戏信息提交成功！');
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
    }
  };

  return (
    <Card>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Title level={2}>游戏信息提交</Title>
        <Text type="secondary">请填写游戏相关信息</Text>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          label="投稿游戏ID"
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
              onChange={(e) => validateGameId(e.target.value)}
            />
            <Button 
              loading={validating}
              onClick={() => {
                const gameId = form.getFieldValue('gameId');
                if (gameId) {
                  validateGameId(gameId);
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
            placeholder="请描述游戏和主题的关联性（100字以内）"
            rows={4}
            maxLength={100}
            showCount
          />
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            disabled={!gameValidation?.isValid}
            size="large"
            style={{ width: '100%' }}
          >
            提交游戏信息
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default GameForm; 