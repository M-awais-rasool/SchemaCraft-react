import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase/firbase';
import api from './api';
import type { LoginResponse } from '../types/auth';

export class GoogleAuthService {
  static async signInWithGoogle(): Promise<LoginResponse> {
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      
      if (!firebaseUser.email) {
        throw new Error('No email found in Google account');
      }
      console.log('Google user authenticated:', firebaseUser);
      const idToken = await firebaseUser.getIdToken();
      console.log('Google ID Token:', idToken);
      const response = await api.post<LoginResponse>('/auth/google', {
        id_token: idToken,
      });
      
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Google authentication error:', error);
      
      // Handle Firebase popup cancellation errors
      if (error.code === 'auth/popup-closed-by-user' || 
          error.code === 'auth/cancelled-popup-request' ||
          error.code === 'auth/popup-blocked') {
        // Create a specific error for popup cancellation
        const cancelError = new Error('Google sign-in was cancelled');
        (cancelError as any).code = 'auth/popup-cancelled';
        throw cancelError;
      }
      
      throw error;
    }
  }

  static async signOut(): Promise<void> {
    try {
      await auth.signOut();
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Google sign out error:', error);
      throw error;
    }
  }
}
