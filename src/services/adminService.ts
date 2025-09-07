import api from './api';
import type { User } from '../types/auth';

export interface AdminStats {
  total_users: number;
  active_users: number;
  inactive_users: number;
  total_schemas: number;
  total_api_requests: number;
}

export interface PaginatedUsers {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ToggleUserStatusRequest {
  is_active: boolean;
}

export interface UserAPIUsage {
  id: string
  name: string
  email: string
  used_this_month: number
  monthly_quota: number
  usage_percentage: number
  last_request: string
}

export interface APIUsageStats {
  overall_stats: {
    total_usage: number
    total_quota: number
    usage_percentage: number
    total_users: number
    high_usage_users: number
    quota_exceeded_users: number
  }
  high_usage_users: UserAPIUsage[]
  quota_exceeded_users: UserAPIUsage[]
  threshold_percentage: number
}

class AdminService {
  async getStats(): Promise<AdminStats> {
    const response = await api.get('/admin/stats');
    return response.data;
  }

  async getAllUsers(page: number = 1, limit: number = 20): Promise<PaginatedUsers> {
    const response = await api.get(`/admin/users?page=${page}&limit=${limit}`);
    return response.data;
  }

  async getUserById(userId: string): Promise<User> {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
  }

  async toggleUserStatus(userId: string, isActive: boolean): Promise<void> {
    await api.put(`/admin/users/${userId}/toggle-status`, { is_active: isActive });
  }

  async revokeUserAPIKey(userId: string): Promise<void> {
    await api.post(`/admin/users/${userId}/revoke-api-key`);
  }

  async getAllSchemas(): Promise<any[]> {
    const response = await api.get('/admin/schemas');
    return response.data;
  }

  async getUserSchemas(userId: string): Promise<any[]> {
    const response = await api.get(`/admin/users/${userId}/schemas`);
    return response.data;
  }

  async getAPIUsageStats(threshold: number = 80): Promise<APIUsageStats> {
    const response = await api.get(`/admin/api-usage?threshold=${threshold}`);
    return response.data;
  }

  async resetUserQuota(userId: string): Promise<{ message: string }> {
    const response = await api.post(`/admin/users/${userId}/reset-quota`);
    return response.data;
  }

  formatUsagePercentage(used: number, limit: number): string {
    const percentage = (used / limit) * 100;
    return `${percentage.toFixed(1)}%`;
  }

  getUsageStatusColor(used: number, limit: number): string {
    const percentage = (used / limit) * 100;
    if (percentage >= 100) return 'text-red-600';
    if (percentage >= 90) return 'text-orange-600';
    if (percentage >= 80) return 'text-yellow-600';
    if (percentage >= 50) return 'text-blue-600';
    return 'text-green-600';
  }

  getUsageStatusBadgeColor(used: number, limit: number): string {
    const percentage = (used / limit) * 100;
    if (percentage >= 100) return 'bg-red-100 text-red-800';
    if (percentage >= 90) return 'bg-orange-100 text-orange-800';
    if (percentage >= 80) return 'bg-yellow-100 text-yellow-800';
    if (percentage >= 50) return 'bg-blue-100 text-blue-800';
    return 'bg-green-100 text-green-800';
  }
}

export default new AdminService();
