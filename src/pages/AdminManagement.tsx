import React, { useState } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';
import { useAuth } from '../context/AuthContext';
import './AdminManagement.css';

const AdminManagement: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [adminUsers, setAdminUsers] = useState<any[]>([]);

  // Cloud Functions
  const grantAdminPrivileges = httpsCallable(functions, 'grantAdminPrivileges');
  const revokeAdminPrivileges = httpsCallable(functions, 'revokeAdminPrivileges');
  const listAdminUsers = httpsCallable(functions, 'listAdminUsers');

  const handleGrantAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setMessage('');

    try {
      const result = await grantAdminPrivileges({ email: email.trim() });
      setMessage(`✅ ${result.data.message}`);
      setEmail('');
      loadAdminUsers(); // Refresh the list
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeAdmin = async (userEmail: string) => {
    if (!confirm(`Are you sure you want to revoke admin privileges from ${userEmail}?`)) {
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const result = await revokeAdminPrivileges({ email: userEmail });
      setMessage(`✅ ${result.data.message}`);
      loadAdminUsers(); // Refresh the list
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const loadAdminUsers = async () => {
    try {
      const result = await listAdminUsers({});
      setAdminUsers(result.data.adminUsers || []);
    } catch (error) {
      console.error('Error loading admin users:', error);
    }
  };

  // Load admin users on component mount
  React.useEffect(() => {
    if (isAdmin) {
      loadAdminUsers();
    }
  }, [isAdmin]);

  if (!user || !isAdmin) {
    return (
      <div className="admin-management">
        <div className="admin-container">
          <div className="access-denied">
            <h2>Access Denied</h2>
            <p>You need admin privileges to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-management">
      <div className="admin-container">
        <div className="admin-header">
          <h1>Admin Management</h1>
          <p>Grant or revoke admin privileges for users</p>
        </div>

        <div className="admin-sections">
          {/* Grant Admin Section */}
          <div className="admin-section">
            <h2>Grant Admin Privileges</h2>
            <form onSubmit={handleGrantAdmin} className="admin-form">
              <div className="form-group">
                <label htmlFor="email">User Email:</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  required
                />
              </div>
              <button 
                type="submit" 
                className="btn-grant"
                disabled={loading}
              >
                {loading ? 'Granting...' : 'Grant Admin'}
              </button>
            </form>
          </div>

          {/* Current Admin Users */}
          <div className="admin-section">
            <h2>Current Admin Users</h2>
            {adminUsers.length === 0 ? (
              <p className="no-admins">No admin users found</p>
            ) : (
              <div className="admin-list">
                {adminUsers.map((adminUser) => (
                  <div key={adminUser.uid} className="admin-user">
                    <div className="user-info">
                      <div className="user-email">{adminUser.email}</div>
                      <div className="user-meta">
                        Added: {new Date(adminUser.creationTime).toLocaleDateString()}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRevokeAdmin(adminUser.email)}
                      className="btn-revoke"
                      disabled={loading}
                    >
                      Revoke
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminManagement;
