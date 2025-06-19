import { 
  UserProfile, 
  SignupFormData, 
  GameInfo, 
  ApiResponse, 
  GameValidationResponse,
  UserStatus
} from '../types';

// 模拟用户数据
let mockUser: UserProfile | null = null;

// 模拟游戏数据
const mockGames = [
  { id: 'game001', name: '超级冒险', publisher: '游戏工作室A' },
  { id: 'game002', name: '魔法世界', publisher: '游戏工作室B' },
  { id: 'game003', name: '赛车竞速', publisher: '游戏工作室C' },
];

// 模拟API延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 模拟Tap登录
export const mockTapLogin = async (): Promise<ApiResponse<{ token: string; user: UserProfile }>> => {
  await delay(1000);
  
  // 模拟用户信息
  const user: UserProfile = {
    userInfo: {
      tapId: 'tap_' + Math.random().toString(36).substr(2, 9),
      username: '测试用户' + Math.floor(Math.random() * 1000),
      avatar: 'https://via.placeholder.com/40',
    },
    status: UserStatus.NOT_SIGNED_UP,
  };
  
  mockUser = user;
  
  return {
    success: true,
    data: {
      token: 'mock_token_' + Date.now(),
      user,
    },
  };
};

// 模拟获取当前用户
export const mockGetCurrentUser = async (): Promise<ApiResponse<UserProfile>> => {
  await delay(500);
  
  if (!mockUser) {
    return {
      success: false,
      message: '用户未登录',
    };
  }
  
  return {
    success: true,
    data: mockUser,
  };
};

// 模拟提交报名信息
export const mockSubmitSignup = async (data: SignupFormData): Promise<ApiResponse<UserProfile>> => {
  await delay(1000);
  
  if (!mockUser) {
    return {
      success: false,
      message: '用户未登录',
    };
  }
  
  mockUser = {
    ...mockUser,
    signupData: data,
    status: UserStatus.SIGNED_UP_NO_GAME,
  };
  
  return {
    success: true,
    data: mockUser,
  };
};

// 模拟验证游戏ID
export const mockValidateGameId = async (gameId: string): Promise<ApiResponse<GameValidationResponse>> => {
  await delay(800);
  
  const game = mockGames.find(g => g.id === gameId);
  
  if (game) {
    return {
      success: true,
      data: {
        isValid: true,
        gameName: game.name,
        publisherName: game.publisher,
        message: '验证成功',
      },
    };
  } else {
    return {
      success: true,
      data: {
        isValid: false,
        message: '游戏ID不存在或无权限访问',
      },
    };
  }
};

// 模拟提交游戏信息
export const mockSubmitGameInfo = async (gameInfo: GameInfo): Promise<ApiResponse<UserProfile>> => {
  await delay(1000);
  
  if (!mockUser) {
    return {
      success: false,
      message: '用户未登录',
    };
  }
  
  mockUser = {
    ...mockUser,
    gameInfo,
    status: UserStatus.SIGNED_UP_WITH_GAME,
  };
  
  return {
    success: true,
    data: mockUser,
  };
};

// 模拟登出
export const mockLogout = async (): Promise<ApiResponse<void>> => {
  await delay(500);
  mockUser = null;
  
  return {
    success: true,
  };
}; 