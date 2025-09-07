import api from './api';

export interface DashboardData {
  user: {
    id: string;
    name: string;
    email: string;
    api_key: string;
    mongodb_uri: boolean;
    database_name: string;
    created_at: string;
    last_login: string;
  };
  stats: {
    total_schemas: number;
    api_usage: {
      total_requests: number;
      last_request: string;
      monthly_quota: number;
      used_this_month: number;
    };
    has_custom_db: boolean;
  };
  schemas: any[];
  recent_activities?: {
    id: string;
    type: string;
    action: string;
    created_at: string;
  }[];
}

export interface APIUsageData {
  total_requests: number;
  last_request: string;
  monthly_quota: number;
  used_this_month: number;
  remaining_quota: number;
  quota_percentage: number;
}

export class UserService {
  static async getDashboard(): Promise<DashboardData> {
    const response = await api.get<DashboardData>('/user/dashboard');
    return response.data;
  }

  static async regenerateAPIKey(): Promise<{ message: string; api_key: string }> {
    const response = await api.post<{ message: string; api_key: string }>('/user/regenerate-api-key');
    return response.data;
  }

  static async getAPIUsage(): Promise<APIUsageData> {
    const response = await api.get<APIUsageData>('/user/api-usage');
    return response.data;
  }

  static async updateProfile(profileData: {
    name: string;
    email: string;
    company?: string;
    timezone?: string;
    language?: string;
  }): Promise<void> {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  }

  static async changePassword(passwordData: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> {
    const response = await api.put('/auth/change-password', passwordData);
    return response.data;
  }

  static async updateNotificationPreferences(preferences: {
    emailUpdates: boolean;
    apiAlerts: boolean;
    securityNotifications: boolean;
    marketing: boolean;
  }): Promise<void> {
    const response = await api.put('/auth/notification-preferences', preferences);
    return response.data;
  }

  static async deleteAccount(): Promise<void> {
    const response = await api.delete('/auth/account');
    return response.data;
  }

  static async getAPIDocumentation(): Promise<any> {
    const response = await api.get('/user/api-documentation');
    return response.data;
  }
}
