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
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [editingRequest, setEditingRequest] = useState<string | null>(null);
  const [editedPrice, setEditedPrice] = useState<number>(0);
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);

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

  const handleBulkStatusUpdate = async (status: ServiceRequest['status']) => {
    try {
      const promises = selectedRequests.map(requestId => 
        updateServiceRequestStatus(requestId, status)
      );
      await Promise.all(promises);
      
      setRequests(prev => 
        prev.map(req => 
          selectedRequests.includes(req.id) 
            ? { ...req, status, updatedAt: new Date() }
            : req
        )
      );
      setSelectedRequests([]);
    } catch (err) {
      console.error('Error updating bulk status:', err);
      alert('Failed to update selected requests');
    }
  };

  const handleSelectRequest = (requestId: string) => {
    setSelectedRequests(prev => 
      prev.includes(requestId) 
        ? prev.filter(id => id !== requestId)
        : [...prev, requestId]
    );
  };

  const handleSelectAll = () => {
    if (selectedRequests.length === filteredRequests.length) {
      setSelectedRequests([]);
    } else {
      setSelectedRequests(filteredRequests.map(r => r.id));
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
          <div className="header-content">
            <h1>Admin Dashboard</h1>
            <div className="loading-spinner">Loading requests...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-panel">
        <div className="admin-header">
          <div className="header-content">
            <h1>Admin Dashboard</h1>
            <div className="error-message">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  const totalValue = requests
    .filter(r => r.estimate)
    .reduce((sum, r) => sum + (r.estimate?.totalCost || 0), 0);

  return (
    <div className="admin-panel">
      {/* Header */}
      <div className="admin-header">
        <div className="header-content">
          <div className="header-title">
            <h1>Admin Dashboard</h1>
            <p>Manage service requests and customer orders</p>
          </div>
          <div className="header-actions">
            <button 
              className={`view-toggle ${viewMode === 'cards' ? 'active' : ''}`}
              onClick={() => setViewMode('cards')}
            >
              📋 Cards
            </button>
            <button 
              className={`view-toggle ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
            >
              📊 Table
            </button>
          </div>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="stats-dashboard">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-number">{requests.length}</div>
            <div className="stat-label">Total Requests</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <div className="stat-number">{requests.filter(r => r.status === 'pending').length}</div>
            <div className="stat-label">Pending</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-number">{requests.filter(r => r.status === 'confirmed').length}</div>
            <div className="stat-label">Confirmed</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-number">${totalValue.toLocaleString()}</div>
            <div className="stat-label">Total Value</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="admin-controls">
        <div className="search-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search requests, customers, or IDs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
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

      {/* Bulk Actions */}
      {selectedRequests.length > 0 && (
        <div className="bulk-actions">
          <div className="bulk-info">
            <span>{selectedRequests.length} selected</span>
          </div>
          <div className="bulk-buttons">
            <button 
              onClick={() => handleBulkStatusUpdate('confirmed')}
              className="bulk-btn confirm"
            >
              ✅ Confirm Selected
            </button>
            <button 
              onClick={() => handleBulkStatusUpdate('denied')}
              className="bulk-btn deny"
            >
              ❌ Deny Selected
            </button>
            <button 
              onClick={() => setSelectedRequests([])}
              className="bulk-btn cancel"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Requests List */}
      <div className="requests-container">
        {filteredRequests.length === 0 ? (
          <div className="no-requests">
            <div className="no-requests-icon">📭</div>
            <h3>No requests found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        ) : viewMode === 'table' ? (
          <div className="table-view">
            <table className="requests-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectedRequests.length === filteredRequests.length && filteredRequests.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>Service</th>
                  <th>Customer</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map(request => (
                  <tr key={request.id} className={selectedRequests.includes(request.id) ? 'selected' : ''}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedRequests.includes(request.id)}
                        onChange={() => handleSelectRequest(request.id)}
                      />
                    </td>
                    <td>
                      <div className="service-cell">
                        <div className="service-name">{request.serviceName}</div>
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
                      <div className="price-cell">
                        {request.estimate ? (
                          <span className="price">${request.estimate.totalCost.toFixed(2)}</span>
                        ) : (
                          <span className="no-price">No estimate</span>
                        )}
                      </div>
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
                              ✅
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate(request.id, 'denied')}
                              className="action-btn deny"
                              title="Deny"
                            >
                              ❌
                            </button>
                          </>
                        )}
                        {request.estimate && (
                          <button 
                            onClick={() => handlePriceEdit(request)}
                            className="action-btn edit"
                            title="Edit Price"
                          >
                            ✏️
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="cards-view">
            {filteredRequests.map(request => (
              <div key={request.id} className="request-card">
                <div className="card-header">
                  <div className="card-title">
                    <h3>{request.serviceName}</h3>
                    <div className="card-meta">
                      <span className="request-id">#{request.id.slice(-8)}</span>
                      <span className="request-date">{formatDate(request.createdAt)}</span>
                    </div>
                  </div>
                  <div className="card-status">
                    {getStatusBadge(request.status)}
                  </div>
                </div>

                <div className="card-content">
                  <div className="customer-section">
                    <h4>👤 Customer</h4>
                    <div className="customer-details">
                      <p><strong>{request.customerInfo.firstName} {request.customerInfo.lastName}</strong></p>
                      <p>📧 {request.customerInfo.email}</p>
                      <p>📞 {request.customerInfo.phone}</p>
                      <p>📍 {request.customerInfo.address}, {request.customerInfo.city}</p>
                    </div>
                  </div>

                  <div className="pricing-section">
                    <h4>💰 Pricing</h4>
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
                        <div className="estimate-breakdown">
                          <p><strong>Hours:</strong> {request.estimate.totalHours}</p>
                          <p><strong>Labor:</strong> ${request.estimate.laborCost.toFixed(2)}</p>
                          <p><strong>Paint:</strong> ${request.estimate.paintCost.toFixed(2)}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="no-estimate-info">
                        {request.serviceType === 'flat-rate' ? (
                          <div className="flat-rate-info">
                            <p><strong>Service Type:</strong> Flat Rate</p>
                            <p><strong>Status:</strong> Fixed pricing - no estimate needed</p>
                            <p><em>This service has a predetermined price based on the service type.</em></p>
                          </div>
                        ) : request.serviceType === 'custom-quote' ? (
                          <div className="custom-quote-info">
                            <p><strong>Service Type:</strong> Custom Quote Required</p>
                            <p><strong>Status:</strong> Manual quote needed</p>
                            <p><em>This service requires a custom quote from your team.</em></p>
                            {request.customProjectDetails && (
                              <div className="custom-details">
                                <p><strong>Project Description:</strong></p>
                                <p>{request.customProjectDetails.description}</p>
                                {request.customProjectDetails.budget && (
                                  <p><strong>Customer Budget:</strong> ${request.customProjectDetails.budget}</p>
                                )}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="missing-estimate-info">
                            <p><strong>Service Type:</strong> {request.serviceType}</p>
                            <p><strong>Status:</strong> Estimate missing</p>
                            <p><em>This calculated service should have an estimate. Check form data for details.</em></p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="card-actions">
                  {request.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => handleStatusUpdate(request.id, 'confirmed')}
                        className="btn-confirm"
                      >
                        ✅ Confirm
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate(request.id, 'denied')}
                        className="btn-deny"
                      >
                        ❌ Deny
                      </button>
                    </>
                  )}
                  {request.status === 'confirmed' && (
                    <button 
                      onClick={() => handleStatusUpdate(request.id, 'completed')}
                      className="btn-complete"
                    >
                      🎉 Mark Complete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
