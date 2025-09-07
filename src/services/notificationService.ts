import api from './api'

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'error' | 'success'
  is_read: boolean
  created_at: string
  updated_at: string
}

export interface NotificationResponse {
  notifications: Notification[]
  pagination: {
    page: number
    limit: number
    total: number
    total_pages: number
  }
  unread_count: number
}

class NotificationService {
  static async getNotifications(page = 1, limit = 20): Promise<NotificationResponse> {
    const response = await api.get(`/notifications?page=${page}&limit=${limit}`)
    return response.data
  }

  static async getUnreadCount(): Promise<{ unread_count: number }> {
    const response = await api.get('/notifications/unread-count')
    return response.data
  }

  static async markAsRead(notificationId: string): Promise<{ message: string }> {
    const response = await api.put(`/notifications/${notificationId}/read`)
    return response.data
  }

  static async markAllAsRead(): Promise<{ message: string }> {
    const response = await api.put('/notifications/read-all')
    return response.data
  }

  static async deleteNotification(notificationId: string): Promise<{ message: string }> {
    const response = await api.delete(`/notifications/${notificationId}`)
    return response.data
  }

  static async testMongoConnection(mongodbUri: string, databaseName: string): Promise<{
    message?: string
    error?: string
    connected: boolean
  }> {
    const response = await api.post('/auth/test-mongodb', {
      mongodb_uri: mongodbUri,
      database_name: databaseName,
    })
    return response.data
  }
}

export default NotificationService
