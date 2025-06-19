// 用户信息类型
export interface UserInfo {
  tapId: string;
  username: string;
  avatar?: string;
}

// 报名表单数据类型
export interface SignupFormData {
  tapId: string;
  phone: string;
  wechat: string;
  teamSize: number;
}

// 游戏信息类型
export interface GameInfo {
  gameId: string;
  gameName: string;
  publisherName: string;
  releaseType: ReleaseType;
  theme: Theme;
  themeDescription: string;
}

// 上线形式枚举
export enum ReleaseType {
  MINI_GAME = '小游戏',
  TAP_PLAY = 'TapPlay',
  WEB = 'WEB',
  SPARK_EDITOR = '星火编辑器'
}

// 应征主题枚举
export enum Theme {
  BLIND_BOX_CHALLENGE = '盲盒挑战',
  ENDLESS_CHALLENGE = '永无止境的闯关',
  GAMEPLAY_FUSION = '玩法缝合怪',
  CLASSIC_REMAKE = '经典重开',
  RESTART_LIFE = '重启人生',
  PET_PARADISE = '萌宠乐园'
}

// 用户状态枚举
export enum UserStatus {
  NOT_SIGNED_UP = 'not_signed_up',
  SIGNED_UP_NO_GAME = 'signed_up_no_game',
  SIGNED_UP_WITH_GAME = 'signed_up_with_game'
}

// 用户完整信息类型
export interface UserProfile {
  userInfo: UserInfo;
  signupData?: SignupFormData;
  gameInfo?: GameInfo;
  status: UserStatus;
}

// API响应类型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// 游戏验证响应类型
export interface GameValidationResponse {
  isValid: boolean;
  gameName?: string;
  publisherName?: string;
  message?: string;
} 