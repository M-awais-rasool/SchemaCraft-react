import api from './api';
import type { LoginRequest, SignupRequest, LoginResponse, User } from '../types/auth';

export class AuthService {
  static async signup(userData: SignupRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/signup', userData);
    
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  }

  static async signin(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/signin', credentials);
    
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  }

  static async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/auth/me');
    
    localStorage.setItem('user', JSON.stringify(response.data));
    
    return response.data;
  }

  static async updateMongoURI(mongodbUri: string, databaseName: string): Promise<void> {
    await api.put('/auth/mongodb-uri', {
      mongodb_uri: mongodbUri,
      database_name: databaseName,
    });
  }

  static async setPassword(password: string): Promise<void> {
    await api.post('/auth/set-password', {
      password: password,
    });
  }

  static async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await api.post('/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
  }

  static signout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }

  static isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  static getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  static getStoredToken(): string | null {
    return localStorage.getItem('auth_token');
  }
}
