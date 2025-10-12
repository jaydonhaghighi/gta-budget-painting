import React, { useState, useEffect } from 'react';
import { getServiceRequests, updateServiceRequestStatus } from '../services/firestoreService';
import type { ServiceRequest } from '../types/ServiceRequest';
import './AdminPanel.css';

const AdminPanel: React.FC = () => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'denied' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
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
    const estimate = getRequestEstimate(request);
    setEditingRequest(request.id);
    setEditedPrice(estimate?.totalCost || 0);
  };

  const handlePriceSave = async (requestId: string) => {
    try {
      const request = requests.find(r => r.id === requestId);
      if (!request) return;

      if (request.type === 'cart-order' && request.lineItems) {
        // For cart orders, update the totals
        const updatedTotals = {
          ...request.totals,
          grandTotal: editedPrice,
          itemsSubtotal: editedPrice - (request.totals?.travelFeeAdjustment || 0) - (request.totals?.discount || 0)
        };
        
        await updateServiceRequestStatus(requestId, request.status, { totals: updatedTotals });
        
        setRequests(prev => 
          prev.map(req => 
            req.id === requestId 
              ? { ...req, totals: updatedTotals, updatedAt: new Date() }
              : req
          )
        );
      } else if (request.estimate) {
        // For single service requests
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

  const filteredRequests = requests
    .filter(request => {
      // Status filter
      if (filter !== 'all' && request.status !== filter) return false;
      
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          request.serviceName.toLowerCase().includes(searchLower) ||
          request.customerInfo.firstName.toLowerCase().includes(searchLower) ||
          request.customerInfo.lastName.toLowerCase().includes(searchLower) ||
          request.customerInfo.email.toLowerCase().includes(searchLower) ||
          request.id.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
          break;
        case 'price':
          const priceA = a.estimate?.totalCost || 0;
          const priceB = b.estimate?.totalCost || 0;
          comparison = priceA - priceB;
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
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

  const getServiceTypeLabel = (serviceType: string) => {
    switch (serviceType) {
      case 'flat-rate': return 'Flat Rate';
      case 'custom-quote': return 'Custom Quote';
      case 'calculated': return 'Calculated';
      default: return serviceType;
    }
  };

  // Helper function to get estimate for both single service and cart orders
  const getRequestEstimate = (request: ServiceRequest) => {
    // For cart orders, get the total from lineItems
    if (request.type === 'cart-order' && request.lineItems) {
      const totalCost = request.lineItems.reduce((sum, item) => {
        return sum + (item.estimate?.totalCost || 0);
      }, 0);
      
      const totalHours = request.lineItems.reduce((sum, item) => {
        return sum + (item.estimate?.totalHours || 0);
      }, 0);
      
      const totalLaborCost = request.lineItems.reduce((sum, item) => {
        return sum + (item.estimate?.laborCost || 0);
      }, 0);
      
      const totalPaintCost = request.lineItems.reduce((sum, item) => {
        return sum + (item.estimate?.paintCost || 0);
      }, 0);
      
      return {
        totalCost,
        totalHours,
        laborCost: totalLaborCost,
        paintCost: totalPaintCost,
        isCartOrder: true,
        itemCount: request.lineItems.length
      };
    }
    
    // For single service requests
    return request.estimate ? { ...request.estimate, isCartOrder: false } : null;
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
        <div className="admin-container">
          <div className="loading">Loading requests...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-panel">
        <div className="admin-container">
          <div className="error">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-container">
        <div className="admin-header">
          <div className="admin-stats">
            <div className="stat-card total">
              <div className="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 3V21H21V3H3ZM19 19H5V5H19V19Z" fill="currentColor"/>
                  <path d="M7 7H17V9H7V7ZM7 11H17V13H7V11ZM7 15H14V17H7V15Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="stat-content">
                <div className="stat-number">{requests.length}</div>
                <div className="stat-label">Total Requests</div>
              </div>
            </div>
            <div className="stat-card pending">
              <div className="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="stat-content">
                <div className="stat-number">{requests.filter(r => r.status === 'pending').length}</div>
                <div className="stat-label">Pending Review</div>
              </div>
            </div>
            <div className="stat-card confirmed">
              <div className="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="stat-content">
                <div className="stat-number">{requests.filter(r => r.status === 'confirmed').length}</div>
                <div className="stat-label">Confirmed</div>
              </div>
            </div>
            <div className="stat-card completed">
              <div className="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="stat-content">
                <div className="stat-number">{requests.filter(r => r.status === 'completed').length}</div>
                <div className="stat-label">Completed</div>
              </div>
            </div>
          </div>
        </div>

        <div className="admin-controls">
          <div className="search-section">
            <input
              type="text"
              placeholder="Search requests, customers, or IDs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-section">
            <div className="filter-group">
              <label>Status:</label>
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value as any)}
                className="filter-select"
              >
                <option value="all">All ({requests.length})</option>
                <option value="pending">Pending ({requests.filter(r => r.status === 'pending').length})</option>
                <option value="confirmed">Confirmed ({requests.filter(r => r.status === 'confirmed').length})</option>
                <option value="denied">Denied ({requests.filter(r => r.status === 'denied').length})</option>
                <option value="completed">Completed ({requests.filter(r => r.status === 'completed').length})</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Sort by:</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as any)}
                className="filter-select"
              >
                <option value="date">Date</option>
                <option value="price">Price</option>
                <option value="status">Status</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Order:</label>
              <select 
                value={sortOrder} 
                onChange={(e) => setSortOrder(e.target.value as any)}
                className="filter-select"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        <div className="requests-table-container">
          {filteredRequests.length === 0 ? (
            <div className="no-requests">No requests found</div>
          ) : (
            <table className="requests-table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Customer</th>
                  <th>Type</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map(request => (
                  <tr key={request.id} className="request-row">
                  <td>
                    <div className="service-cell">
                      <div className="service-name">
                        {request.type === 'cart-order' ? `Cart Order (${request.lineItems?.length || 0} items)` : request.serviceName}
                      </div>
                      <div className="service-id">#{request.id.slice(-8)}</div>
                    </div>
                  </td>
                  <td>
                    <div className="customer-cell">
                      <div className="customer-name">{request.customerInfo.firstName} {request.customerInfo.lastName}</div>
                      <div className="customer-email">{request.customerInfo.email}</div>
                    </div>
                  </td>
                  <td>
                    <span className="service-type">
                      {request.type === 'cart-order' ? 'Cart Order' : getServiceTypeLabel(request.serviceType)}
                    </span>
                  </td>
                      <td>
                        {(() => {
                          const estimate = getRequestEstimate(request);
                          if (estimate) {
                            return editingRequest === request.id ? (
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
                                <div className="price-content">
                                  <span className="price">${estimate.totalCost.toFixed(2)}</span>
                                  {estimate.isCartOrder && (
                                    <div className="cart-info">
                                      <small>{estimate.itemCount} items</small>
                                    </div>
                                  )}
                                </div>
                                <button 
                                  onClick={() => handlePriceEdit(request)}
                                  className="btn-edit-price"
                                  title="Edit price"
                                >
                                  <img src="/pen.svg" alt="Edit" />
                                </button>
                              </div>
                            );
                          } else {
                            return <span className="no-price">No estimate</span>;
                          }
                        })()}
                      </td>
                    <td>
                      {getStatusBadge(request.status)}
                    </td>
                    <td>
                      <div className="date-cell">
                        {formatDate(request.createdAt)}
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        {request.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleStatusUpdate(request.id, 'confirmed')}
                              className="action-btn confirm"
                              title="Confirm"
                            >
                              Confirm
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate(request.id, 'denied')}
                              className="action-btn deny"
                              title="Deny"
                            >
                              Deny
                            </button>
                          </>
                        )}
                        {request.status === 'confirmed' && (
                          <button 
                            onClick={() => handleStatusUpdate(request.id, 'completed')}
                            className="action-btn complete"
                            title="Mark Complete"
                          >
                            Complete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
