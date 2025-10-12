import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { getAuth } from 'firebase-admin/auth';
import { logger } from 'firebase-functions';

// Grant admin privileges to a user by email
export const grantAdminPrivileges = onCall(async (request) => {
  try {
    const { email } = request.data;
    
    if (!email) {
      throw new HttpsError('invalid-argument', 'Email is required');
    }

    // Get the user by email
    const userRecord = await getAuth().getUserByEmail(email);
    
    // Set custom claims to grant admin privileges
    await getAuth().setCustomUserClaims(userRecord.uid, { admin: true });
    
    logger.info(`Admin privileges granted to user: ${email}`);
    
    return { success: true, message: `Admin privileges granted to ${email}` };
  } catch (error) {
    logger.error('Error granting admin privileges:', error);
    throw new HttpsError('internal', 'Failed to grant admin privileges');
  }
});

// Revoke admin privileges from a user by email
export const revokeAdminPrivileges = onCall(async (request) => {
  try {
    const { email } = request.data;
    
    if (!email) {
      throw new HttpsError('invalid-argument', 'Email is required');
    }

    // Get the user by email
    const userRecord = await getAuth().getUserByEmail(email);
    
    // Remove admin claims
    await getAuth().setCustomUserClaims(userRecord.uid, { admin: false });
    
    logger.info(`Admin privileges revoked from user: ${email}`);
    
    return { success: true, message: `Admin privileges revoked from ${email}` };
  } catch (error) {
    logger.error('Error revoking admin privileges:', error);
    throw new HttpsError('internal', 'Failed to revoke admin privileges');
  }
});

// List all users with admin privileges
export const listAdminUsers = onCall(async (request) => {
  try {
    const listUsersResult = await getAuth().listUsers();
    const adminUsers = [];
    
    for (const userRecord of listUsersResult.users) {
      const customClaims = userRecord.customClaims;
      if (customClaims && customClaims.admin === true) {
        adminUsers.push({
          uid: userRecord.uid,
          email: userRecord.email,
          displayName: userRecord.displayName,
          creationTime: userRecord.metadata.creationTime
        });
      }
    }
    
    return { adminUsers };
  } catch (error) {
    logger.error('Error listing admin users:', error);
    throw new HttpsError('internal', 'Failed to list admin users');
  }
});
