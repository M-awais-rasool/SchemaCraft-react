import api from './api'

export interface Activity {
  id: string
  user_id: string
  type: 'create' | 'update' | 'delete' | 'api' | 'auth' | 'connect' | 'security' | 'login' | 'logout'
  action: string
  description?: string
  resource?: string
  resource_id?: string
  ip_address?: string
  user_agent?: string
  metadata?: Record<string, any>
  created_at: string
}

export interface ActivityResponse {
  activities: Activity[]
  pagination: {
    page: number
    limit: number
    total: number
    total_pages: number
  }
}

class ActivityService {
  static async getActivities(page = 1, limit = 20): Promise<ActivityResponse> {
    const response = await api.get(`/activities?page=${page}&limit=${limit}`)
    return response.data
  }

  static async createActivity(activityData: {
    type: Activity['type']
    action: string
    description?: string
    resource?: string
    resource_id?: string
    metadata?: Record<string, any>
  }): Promise<Activity> {
    const response = await api.post('/activities', activityData)
    return response.data
  }

  static getActivityIcon(type: Activity['type']): string {
    switch (type) {
      case 'create':
        return '🆕'
      case 'update':
        return '✏️'
      case 'delete':
        return '🗑️'
      case 'api':
        return '🔗'
      case 'auth':
        return '🔐'
      case 'connect':
        return '🔌'
      case 'security':
        return '🛡️'
      case 'login':
        return '🔑'
      case 'logout':
        return '🚪'
      default:
        return '📝'
    }
  }

  static getActivityColor(type: Activity['type']): string {
    switch (type) {
      case 'create':
        return 'text-green-600'
      case 'update':
        return 'text-blue-600'
      case 'delete':
        return 'text-red-600'
      case 'api':
        return 'text-purple-600'
      case 'auth':
      case 'login':
        return 'text-indigo-600'
      case 'connect':
        return 'text-orange-600'
      case 'security':
        return 'text-yellow-600'
      case 'logout':
        return 'text-gray-600'
      default:
        return 'text-gray-600'
    }
  }

  static formatTimeAgo(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) {
      return 'Just now'
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours} hour${hours > 1 ? 's' : ''} ago`
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days} day${days > 1 ? 's' : ''} ago`
    } else {
      return date.toLocaleDateString()
    }
  }
}

export default ActivityService
