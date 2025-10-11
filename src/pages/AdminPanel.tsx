import React, { useState, useEffect } from 'react';
import { getServiceRequests, updateServiceRequestStatus } from '../services/firestoreService';
import type { ServiceRequest } from '../types/ServiceRequest';
import './AdminPanel.css';

const AdminPanel: React.FC = () => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'denied'>('all');
  const [editingRequest, setEditingRequest] = useState<string | null>(null);
  const [editedPrice, setEditedPrice] = useState<number>(0);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const allRequests = await getServiceRequests();
      setRequests(allRequests);
    } catch (err) {
      setError('Failed to load requests');
      console.error('Error loading requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId: string, newStatus: ServiceRequest['status']) => {
    try {
      await updateServiceRequestStatus(requestId, newStatus);
      setRequests(prev => 
        prev.map(req => 
          req.id === requestId ? { ...req, status: newStatus, updatedAt: new Date() } : req
        )
      );
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status');
    }
  };

  const handlePriceEdit = (request: ServiceRequest) => {
    setEditingRequest(request.id);
    setEditedPrice(request.estimate?.totalCost || 0);
  };

  const handlePriceSave = async (requestId: string) => {
    try {
      // Update the request with new price
      const request = requests.find(r => r.id === requestId);
      if (request && request.estimate) {
        const updatedEstimate = {
          ...request.estimate,
          totalCost: editedPrice
        };
        
        await updateServiceRequestStatus(requestId, request.status, { estimate: updatedEstimate });
        
        setRequests(prev => 
          prev.map(req => 
            req.id === requestId 
              ? { ...req, estimate: updatedEstimate, updatedAt: new Date() }
              : req
          )
        );
      }
      setEditingRequest(null);
    } catch (err) {
      console.error('Error updating price:', err);
      alert('Failed to update price');
    }
  };

  const filteredRequests = requests.filter(request => {
    if (filter === 'all') return true;
    return request.status === filter;
  });

  const getStatusBadge = (status: ServiceRequest['status']) => {
    const statusConfig = {
      pending: { text: 'Pending', class: 'status-pending' },
      confirmed: { text: 'Confirmed', class: 'status-confirmed' },
      denied: { text: 'Denied', class: 'status-denied' },
      completed: { text: 'Completed', class: 'status-completed' }
    };
    
    const config = statusConfig[status];
    return <span className={`status-badge ${config.class}`}>{config.text}</span>;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-CA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="admin-panel">
        <div className="admin-header">
          <h1>Admin Panel</h1>
        </div>
        <div className="loading">Loading requests...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-panel">
        <div className="admin-header">
          <h1>Admin Panel</h1>
        </div>
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <div className="admin-stats">
          <div className="stat">
            <span className="stat-number">{requests.length}</span>
            <span className="stat-label">Total Requests</span>
          </div>
          <div className="stat">
            <span className="stat-number">{requests.filter(r => r.status === 'pending').length}</span>
            <span className="stat-label">Pending</span>
          </div>
        </div>
      </div>

      <div className="admin-filters">
        <button 
          className={filter === 'all' ? 'active' : ''} 
          onClick={() => setFilter('all')}
        >
          All ({requests.length})
        </button>
        <button 
          className={filter === 'pending' ? 'active' : ''} 
          onClick={() => setFilter('pending')}
        >
          Pending ({requests.filter(r => r.status === 'pending').length})
        </button>
        <button 
          className={filter === 'confirmed' ? 'active' : ''} 
          onClick={() => setFilter('confirmed')}
        >
          Confirmed ({requests.filter(r => r.status === 'confirmed').length})
        </button>
        <button 
          className={filter === 'denied' ? 'active' : ''} 
          onClick={() => setFilter('denied')}
        >
          Denied ({requests.filter(r => r.status === 'denied').length})
        </button>
      </div>

      <div className="requests-list">
        {filteredRequests.length === 0 ? (
          <div className="no-requests">No requests found</div>
        ) : (
          filteredRequests.map(request => (
            <div key={request.id} className="request-card">
              <div className="request-header">
                <div className="request-info">
                  <h3>{request.serviceName}</h3>
                  <p className="request-id">#{request.id}</p>
                  <p className="request-date">{formatDate(request.createdAt)}</p>
                </div>
                <div className="request-status">
                  {getStatusBadge(request.status)}
                </div>
              </div>

              <div className="request-details">
                <div className="customer-info">
                  <h4>Customer</h4>
                  <p><strong>{request.customerInfo.firstName} {request.customerInfo.lastName}</strong></p>
                  <p>{request.customerInfo.email}</p>
                  <p>{request.customerInfo.phone}</p>
                  <p>{request.customerInfo.address}, {request.customerInfo.city}, {request.customerInfo.postalCode}</p>
                </div>

                <div className="estimate-info">
                  <h4>Estimate</h4>
                  {request.estimate ? (
                    <div className="estimate-details">
                      {editingRequest === request.id ? (
                        <div className="price-edit">
                          <input
                            type="number"
                            value={editedPrice}
                            onChange={(e) => setEditedPrice(Number(e.target.value))}
                            className="price-input"
                          />
                          <button 
                            onClick={() => handlePriceSave(request.id)}
                            className="btn-save"
                          >
                            Save
                          </button>
                          <button 
                            onClick={() => setEditingRequest(null)}
                            className="btn-cancel"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="price-display">
                          <span className="price">${request.estimate.totalCost.toFixed(2)}</span>
                          <button 
                            onClick={() => handlePriceEdit(request)}
                            className="btn-edit-price"
                          >
                            Edit Price
                          </button>
                        </div>
                      )}
                      <p><strong>Hours:</strong> {request.estimate.totalHours}</p>
                      <p><strong>Labor:</strong> ${request.estimate.laborCost.toFixed(2)}</p>
                      <p><strong>Paint:</strong> ${request.estimate.paintCost.toFixed(2)}</p>
                    </div>
                  ) : (
                    <p>No estimate available</p>
                  )}
                </div>
              </div>

              <div className="request-actions">
                {request.status === 'pending' && (
                  <>
                    <button 
                      onClick={() => handleStatusUpdate(request.id, 'confirmed')}
                      className="btn-confirm"
                    >
                      Confirm
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(request.id, 'denied')}
                      className="btn-deny"
                    >
                      Deny
                    </button>
                  </>
                )}
                {request.status === 'confirmed' && (
                  <button 
                    onClick={() => handleStatusUpdate(request.id, 'completed')}
                    className="btn-complete"
                  >
                    Mark Complete
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
