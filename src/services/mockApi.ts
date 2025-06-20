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
  { id: '12345', name: '超级冒险', publisher: '游戏工作室A' },
  { id: '23456', name: '魔法世界', publisher: '游戏工作室B' },
  { id: '34567', name: '赛车竞速', publisher: '游戏工作室C' },
];

// 模拟游戏权限数据（用户ID -> 有权限的游戏ID列表）
const mockGamePermissions = {
  // 假设当前用户只有前两个游戏的管理员权限
  '12345': true,  // 有权限
  '23456': true,  // 有权限
  '34567': false, // 无权限
};

// 模拟API延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 生成8位纯数字Tap ID
const generateTapId = (): string => {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
};

// 模拟Tap登录
export const mockTapLogin = async (): Promise<ApiResponse<{ token: string; user: UserProfile }>> => {
  await delay(1000);
  
  // 模拟用户信息
  const user: UserProfile = {
    userInfo: {
      tapId: generateTapId(),
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
  
  if (!game) {
    // 游戏ID不存在
    return {
      success: true,
      data: {
        isValid: false,
        message: '游戏ID不存在',
      },
    };
  }
  
  // 检查用户是否有该游戏的管理员权限
  const hasPermission = mockGamePermissions[gameId as keyof typeof mockGamePermissions];
  
  if (!hasPermission) {
    // 游戏存在但用户无权限
    return {
      success: true,
      data: {
        isValid: false,
        message: '您所登录的TapTap账号并无该游戏的管理员权限',
      },
    };
  }
  
  // 验证成功
  return {
    success: true,
    data: {
      isValid: true,
      gameName: game.name,
      publisherName: game.publisher,
      message: '验证成功',
    },
  };
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