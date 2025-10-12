import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';

// Initialize Cloud Functions
const setAdminClaims = httpsCallable(functions, 'setAdminClaims');
const removeAdminClaims = httpsCallable(functions, 'removeAdminClaims');
const getAdminUsers = httpsCallable(functions, 'getAdminUsers');
const initializeSuperAdmin = httpsCallable(functions, 'initializeSuperAdmin');

export interface AdminUser {
  id: string;
  uid: string;
  email: string;
  role: 'admin' | 'super-admin' | 'manager';
  createdAt: Date;
  createdBy: string;
  isActive: boolean;
  removedAt?: Date;
  removedBy?: string;
}

export interface AdminClaims {
  isAdmin: boolean;
  role: string;
  isSuperAdmin: boolean;
}

// Set admin claims for a user
export const setAdminUserClaims = async (uid: string, email: string, role: string = 'admin') => {
  try {
    const result = await setAdminClaims({ uid, email, role });
    return result.data;
  } catch (error) {
    console.error('Error setting admin claims:', error);
    throw error;
  }
};

// Remove admin claims from a user
export const removeAdminUserClaims = async (uid: string) => {
  try {
    const result = await removeAdminClaims({ uid });
    return result.data;
  } catch (error) {
    console.error('Error removing admin claims:', error);
    throw error;
  }
};

// Get all admin users
export const getAllAdminUsers = async (): Promise<AdminUser[]> => {
  try {
    const result = await getAdminUsers();
    return (result.data as any).adminUsers;
  } catch (error) {
    console.error('Error getting admin users:', error);
    throw error;
  }
};

// Initialize super admin (first admin setup)
export const createSuperAdmin = async (email: string, password: string) => {
  try {
    const result = await initializeSuperAdmin({ email, password });
    return result.data;
  } catch (error) {
    console.error('Error creating super admin:', error);
    throw error;
  }
};

// Check if current user has admin privileges
export const checkAdminStatus = async (user: any): Promise<AdminClaims | null> => {
  try {
    // Get the ID token result to access custom claims
    const idTokenResult = await user.getIdTokenResult();
    const claims = idTokenResult.claims;
    
    if (claims.isAdmin) {
      return {
        isAdmin: claims.isAdmin,
        role: claims.role,
        isSuperAdmin: claims.isSuperAdmin
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return null;
  }
};
