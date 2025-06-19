import { 
  UserProfile, 
  SignupFormData, 
  GameInfo, 
  ApiResponse, 
  GameValidationResponse 
} from '../types';
import {
  mockTapLogin,
  mockGetCurrentUser,
  mockSubmitSignup,
  mockValidateGameId,
  mockSubmitGameInfo,
  mockLogout
} from './mockApi';

// Tap登录相关API
export const tapAuthAPI = {
  // 获取当前用户信息
  getCurrentUser: (): Promise<ApiResponse<UserProfile>> => {
    return mockGetCurrentUser();
  },

  // Tap登录
  login: (): Promise<ApiResponse<{ token: string; user: UserProfile }>> => {
    return mockTapLogin();
  },

  // 登出
  logout: (): Promise<ApiResponse<void>> => {
    return mockLogout();
  },
};

// 报名相关API
export const signupAPI = {
  // 提交报名信息
  submitSignup: (data: SignupFormData): Promise<ApiResponse<UserProfile>> => {
    return mockSubmitSignup(data);
  },

  // 获取报名信息
  getSignupInfo: (): Promise<ApiResponse<UserProfile>> => {
    return mockGetCurrentUser();
  },
};

// 游戏相关API
export const gameAPI = {
  // 验证游戏ID
  validateGameId: (gameId: string): Promise<ApiResponse<GameValidationResponse>> => {
    return mockValidateGameId(gameId);
  },

  // 提交游戏信息
  submitGameInfo: (gameInfo: GameInfo): Promise<ApiResponse<UserProfile>> => {
    return mockSubmitGameInfo(gameInfo);
  },

  // 获取游戏信息
  getGameInfo: (): Promise<ApiResponse<GameInfo>> => {
    return mockGetCurrentUser().then(response => {
      if (response.success && response.data?.gameInfo) {
        return { success: true, data: response.data.gameInfo };
      }
      return { success: false, message: '未找到游戏信息' };
    });
  },
}; 