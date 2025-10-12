import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { logger } from 'firebase-functions';

const db = getFirestore();

// Set admin custom claims for a user
export const setAdminClaims = onCall(async (request) => {
  try {
    const { uid, email, role = 'admin' } = request.data;
    const callerUid = request.auth?.uid;

    if (!callerUid) {
      throw new HttpsError('unauthenticated', 'User must be authenticated');
    }

    // Check if caller is super admin
    const callerClaims = await getAuth().getUser(callerUid);
    if (!callerClaims.customClaims?.isSuperAdmin) {
      throw new HttpsError('permission-denied', 'Only super admins can set admin claims');
    }

    if (!uid || !email) {
      throw new HttpsError('invalid-argument', 'UID and email are required');
    }

    // Set custom claims
    await getAuth().setCustomUserClaims(uid, {
      isAdmin: true,
      role: role,
      isSuperAdmin: role === 'super-admin'
    });

    // Add to admin users collection
    await db.collection('adminUsers').doc(uid).set({
      uid,
      email,
      role,
      createdAt: new Date(),
      createdBy: callerUid,
      isActive: true
    });

    logger.info(`Admin claims set for user ${email} with role ${role}`);
    return { success: true, message: 'Admin privileges granted' };

  } catch (error) {
    logger.error('Error setting admin claims:', error);
    throw new HttpsError('internal', 'Failed to set admin claims');
  }
});

// Remove admin privileges
export const removeAdminClaims = onCall(async (request) => {
  try {
    const { uid } = request.data;
    const callerUid = request.auth?.uid;

    if (!callerUid) {
      throw new HttpsError('unauthenticated', 'User must be authenticated');
    }

    // Check if caller is super admin
    const callerClaims = await getAuth().getUser(callerUid);
    if (!callerClaims.customClaims?.isSuperAdmin) {
      throw new HttpsError('permission-denied', 'Only super admins can remove admin claims');
    }

    if (!uid) {
      throw new HttpsError('invalid-argument', 'UID is required');
    }

    // Remove custom claims
    await getAuth().setCustomUserClaims(uid, {
      isAdmin: false,
      role: 'user',
      isSuperAdmin: false
    });

    // Deactivate in admin users collection
    await db.collection('adminUsers').doc(uid).update({
      isActive: false,
      removedAt: new Date(),
      removedBy: callerUid
    });

    logger.info(`Admin claims removed for user ${uid}`);
    return { success: true, message: 'Admin privileges removed' };

  } catch (error) {
    logger.error('Error removing admin claims:', error);
    throw new HttpsError('internal', 'Failed to remove admin claims');
  }
});

// Get all admin users
export const getAdminUsers = onCall(async (request) => {
  try {
    const callerUid = request.auth?.uid;

    if (!callerUid) {
      throw new HttpsError('unauthenticated', 'User must be authenticated');
    }

    // Check if caller is admin
    const callerClaims = await getAuth().getUser(callerUid);
    if (!callerClaims.customClaims?.isAdmin) {
      throw new HttpsError('permission-denied', 'Only admins can view admin users');
    }

    const adminUsersSnapshot = await db.collection('adminUsers')
      .where('isActive', '==', true)
      .orderBy('createdAt', 'desc')
      .get();

    const adminUsers = adminUsersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return { adminUsers };

  } catch (error) {
    logger.error('Error getting admin users:', error);
    throw new HttpsError('internal', 'Failed to get admin users');
  }
});

// Initialize super admin (run once to set up first admin)
export const initializeSuperAdmin = onCall(async (request) => {
  try {
    const { email, password } = request.data;

    if (!email || !password) {
      throw new HttpsError('invalid-argument', 'Email and password are required');
    }

    // Create user
    const userRecord = await getAuth().createUser({
      email,
      password,
      emailVerified: true
    });

    // Set super admin claims
    await getAuth().setCustomUserClaims(userRecord.uid, {
      isAdmin: true,
      role: 'super-admin',
      isSuperAdmin: true
    });

    // Add to admin users collection
    await db.collection('adminUsers').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email,
      role: 'super-admin',
      createdAt: new Date(),
      createdBy: 'system',
      isActive: true
    });

    logger.info(`Super admin created: ${email}`);
    return { success: true, message: 'Super admin created successfully' };

  } catch (error) {
    logger.error('Error initializing super admin:', error);
    throw new HttpsError('internal', 'Failed to initialize super admin');
  }
});
