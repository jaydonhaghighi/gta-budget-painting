import React, { useState, useEffect } from 'react';
import { getServiceRequests, updateServiceRequestStatus } from '../services/firestoreService';
import { useAuth } from '../context/AuthContext';
import type { ServiceRequest } from '../types/ServiceRequest';
import './AdminPanel.css';

const AdminPanel: React.FC = () => {
  const { user, loading: authLoading, isAdmin, signIn, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'denied' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [editingRequest, setEditingRequest] = useState<string | null>(null);
  const [editedPrice, setEditedPrice] = useState<number>(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<ServiceRequest | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  useEffect(() => {
    if (user && isAdmin) {
      loadRequests();
    } else {
      setLoading(false);
    }
  }, [user, isAdmin]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    try {
      await signIn(email, password);
    } catch (error: any) {
      setLoginError(error.message || 'Login failed');
    }
  };

  const handleLogout = async () => {
    await logout();
    setEmail('');
    setPassword('');
    setLoginError('');
  };

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

      // Send invoice email when status is confirmed
      if (newStatus === 'confirmed') {
        await sendInvoiceEmail(requestId);
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status');
    }
  };

  const sendInvoiceEmail = async (requestId: string) => {
    try {
      const request = requests.find(req => req.id === requestId);
      if (!request) {
        console.error('Request not found');
        return;
      }

      // Generate invoice data from service request
      const invoiceData = generateInvoiceData(request);
      
      // Call the Cloud Function to send invoice email
      const response = await fetch('https://us-central1-gta-budget-painting.cloudfunctions.net/sendInvoiceEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Invoice email sent successfully:', result);
        alert('Invoice email sent to client!');
      } else {
        throw new Error('Failed to send invoice email');
      }
    } catch (err) {
      console.error('Error sending invoice email:', err);
      alert('Failed to send invoice email. Please try again.');
    }
  };

  const generateInvoiceData = (request: ServiceRequest) => {
    const invoiceDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);
    
    // Calculate totals
    let subtotal = 0;
    
    if (request.totals?.itemsSubtotal) {
      // Cart order
      subtotal = request.totals.itemsSubtotal;
    } else if (request.estimate?.totalCost) {
      // Single service
      subtotal = request.estimate.totalCost;
    }
    
    const tax = subtotal * 0.13; // 13% HST for Ontario
    const total = subtotal + tax;
    
    // Generate invoice items from cart items or single service
    let items = [];
    
    if (request.lineItems && request.lineItems.length > 0) {
      // Cart order
      items = request.lineItems.map((item, index) => ({
        id: `item-${index + 1}`,
        serviceName: item.serviceName,
        serviceType: item.serviceType,
        description: generateServiceDescription(item),
        quantity: 1,
        unitPrice: item.estimate?.totalCost || 0,
        total: item.estimate?.totalCost || 0
      }));
    } else if (request.serviceName) {
      // Single service
      items = [{
        id: 'item-1',
        serviceName: request.serviceName,
        serviceType: request.serviceType || 'calculated',
        description: generateServiceDescription({ serviceName: request.serviceName, serviceType: request.serviceType }),
        quantity: 1,
        unitPrice: request.estimate?.totalCost || 0,
        total: request.estimate?.totalCost || 0
      }];
    }
    
    return {
      invoiceNumber: `GTA-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      invoiceDate: invoiceDate.toLocaleDateString('en-CA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      dueDate: dueDate.toLocaleDateString('en-CA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      clientInfo: {
        name: `${request.customerInfo.firstName} ${request.customerInfo.lastName}`,
        email: request.customerInfo.email,
        phone: request.customerInfo.phone,
        address: request.customerInfo.address
      },
      serviceLocation: {
        address: request.customerInfo.address,
        city: request.customerInfo.city,
        postalCode: request.customerInfo.postalCode
      },
      items,
      subtotal,
      tax,
      total,
      terms: 'Payment due within 30 days. All work guaranteed for 2 years.'
    };
  };

  const generateServiceDescription = (item: any): string => {
    const serviceName = item.serviceName || 'Painting Service';
    const serviceType = item.serviceType || 'calculated';
    
    switch (serviceType) {
      case 'calculated':
        return `Professional ${serviceName.toLowerCase()} including materials, labor, and setup`;
      case 'flat-rate':
        return `Standard ${serviceName.toLowerCase()} package with all materials included`;
      case 'custom-quote':
        return `Custom ${serviceName.toLowerCase()} project with detailed specifications`;
      default:
        return `Professional painting service with quality materials and expert craftsmanship`;
    }
  };

  const handleViewOrderDetails = (request: ServiceRequest) => {
    setSelectedOrder(request);
    setShowOrderDetails(true);
  };

  const closeOrderDetails = () => {
    setShowOrderDetails(false);
    setSelectedOrder(null);
  };

  const formatFormDataValue = (key: string, value: any): string => {
    // Handle bedroom arrays specially
    if (key === 'bedrooms' && Array.isArray(value)) {
      return value.map((bedroom, index) => {
        const bedroomNum = index + 1;
        const name = bedroom.name ? ` (${bedroom.name})` : '';
        return `Bedroom ${bedroomNum}${name}: ${bedroom.length}' × ${bedroom.width}' × ${bedroom.height}' - ${bedroom.windows} windows, ${bedroom.doors} doors${bedroom.includeCeiling ? ', includes ceiling' : ''}${bedroom.includeBaseboards ? ', includes baseboards' : ''}`;
      }).join('; ');
    }
    
    // Handle other arrays
    if (Array.isArray(value)) {
      return value.map(item => typeof item === 'object' ? JSON.stringify(item) : String(item)).join(', ');
    }
    
    // Handle objects
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value);
    }
    
    // Handle primitive values
    return String(value);
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
        
        console.log('Updating cart order totals:', updatedTotals);
        await updateServiceRequestStatus(requestId, request.status, { totals: updatedTotals });
        
        setRequests(prev => {
          const updated = prev.map(req => 
            req.id === requestId 
              ? { ...req, totals: updatedTotals, updatedAt: new Date() }
              : req
          );
          console.log('Updated requests state:', updated.find(r => r.id === requestId));
          return updated;
        });
      } else if (request.estimate) {
        // For single service requests
        const updatedEstimate = {
          ...request.estimate,
          totalCost: editedPrice
        };
        
        console.log('Updating single service estimate:', updatedEstimate);
        await updateServiceRequestStatus(requestId, request.status, { estimate: updatedEstimate });
        
        setRequests(prev => {
          const updated = prev.map(req => 
            req.id === requestId 
              ? { ...req, estimate: updatedEstimate, updatedAt: new Date() }
              : req
          );
          console.log('Updated requests state:', updated.find(r => r.id === requestId));
          return updated;
        });
      }
      
      setEditingRequest(null);
      setRefreshKey(prev => prev + 1); // Force re-render
      
      // Force a complete data refresh after a short delay
      setTimeout(() => {
        loadRequests();
      }, 100);
      
      console.log('Price updated successfully');
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
          (request.serviceName?.toLowerCase().includes(searchLower) || false) ||
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
          const priceA = getRequestEstimate(a)?.totalCost || 0;
          const priceB = getRequestEstimate(b)?.totalCost || 0;
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
      scheduled: { text: 'Scheduled', class: 'status-scheduled' },
      denied: { text: 'Denied', class: 'status-denied' },
      completed: { text: 'Completed', class: 'status-completed' },
      cancelled: { text: 'Cancelled', class: 'status-cancelled' }
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
    // For cart orders, use the totals.grandTotal (which gets updated when we edit)
    if (request.type === 'cart-order' && request.totals) {
      const totalCost = request.totals.grandTotal;
      
      const totalHours = request.lineItems?.reduce((sum, item) => {
        return sum + (item.estimate?.totalHours || 0);
      }, 0) || 0;
      
      const totalLaborCost = request.lineItems?.reduce((sum, item) => {
        return sum + (item.estimate?.laborCost || 0);
      }, 0) || 0;
      
      const totalPaintCost = request.lineItems?.reduce((sum, item) => {
        return sum + (item.estimate?.paintCost || 0);
      }, 0) || 0;
      
      return {
        totalCost,
        totalHours,
        laborCost: totalLaborCost,
        paintCost: totalPaintCost,
        isCartOrder: true,
        itemCount: request.lineItems?.length || 0
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

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="admin-panel">
        <div className="admin-container">
          <div className="loading">Checking authentication...</div>
        </div>
      </div>
    );
  }

  // Show access denied if user is authenticated but not admin
  if (user && !isAdmin) {
    return (
      <div className="admin-panel">
        <div className="admin-container">
          <div className="access-denied">
            <h2>Access Denied</h2>
            <p>You don't have admin privileges.</p>
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!user) {
    return (
      <div className="admin-panel">
        <div className="admin-container">
          <div className="login-container">
            <div className="login-form">
              <h2>Admin Login</h2>
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password:</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {loginError && (
                  <div className="login-error">{loginError}</div>
                )}
                <button 
                  type="submit" 
                  className="btn-login"
                >
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                <img src="checkout/clipboard.svg" alt="Total Orders" className="stat-icon-img" />
              </div>
              <div className="stat-content">
                <div className="stat-number">{requests.length}</div>
                <div className="stat-label">Total Orders</div>
              </div>
            </div>
            <div className="stat-card pending">
              <div className="stat-icon">
                <img src="/labour-time.png" alt="Pending" className="stat-icon-img" />
              </div>
              <div className="stat-content">
                <div className="stat-number">{requests.filter(r => r.status === 'pending').length}</div>
                <div className="stat-label">Pending Review</div>
              </div>
            </div>
            <div className="stat-card confirmed">
              <div className="stat-icon">
                <img src="/breakdown.png" alt="Confirmed" className="stat-icon-img" />
              </div>
              <div className="stat-content">
                <div className="stat-number">{requests.filter(r => r.status === 'confirmed').length}</div>
                <div className="stat-label">Confirmed</div>
              </div>
            </div>
            <div className="stat-card completed">
              <div className="stat-icon">
                <img src="/money-bag.png" alt="Revenue" className="stat-icon-img" />
              </div>
              <div className="stat-content">
                <div className="stat-number">${requests.filter(r => r.status === 'completed').reduce((sum, r) => {
                  const estimate = r.lineItems ? r.lineItems.reduce((total, item) => total + (item.estimate?.totalCost || 0), 0) : (r.estimate?.totalCost || 0);
                  return sum + estimate;
                }, 0).toLocaleString()}</div>
                <div className="stat-label">Revenue</div>
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
                <table className="requests-table" key={refreshKey}>
              <thead>
                <tr>
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
                  <tr key={request.id} className="request-row" onClick={() => handleViewOrderDetails(request)} style={{cursor: 'pointer'}}>
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
                        {(() => {
                          const estimate = getRequestEstimate(request);
                          if (estimate) {
                            return editingRequest === request.id ? (
                              <div className="price-edit" onClick={(e) => e.stopPropagation()}>
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
                              <div className="price-display" onClick={(e) => e.stopPropagation()}>
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
                      <div className="action-buttons" onClick={(e) => e.stopPropagation()}>
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

      {/* Logout Button */}
      <div className="admin-footer">
        <button onClick={handleLogout} className="btn-logout">
          Logout
        </button>
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="modal-overlay" onClick={closeOrderDetails}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order Details - {selectedOrder.id}</h2>
              <button className="modal-close" onClick={closeOrderDetails}>×</button>
            </div>
            
            <div className="modal-body">
              {/* Customer Information */}
              <div className="details-section">
                <h3>Customer Information</h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <label>Name:</label>
                    <span>{selectedOrder.customerInfo.firstName} {selectedOrder.customerInfo.lastName}</span>
                  </div>
                  <div className="detail-item">
                    <label>Email:</label>
                    <span>{selectedOrder.customerInfo.email}</span>
                  </div>
                  <div className="detail-item">
                    <label>Phone:</label>
                    <span>{selectedOrder.customerInfo.phone}</span>
                  </div>
                  <div className="detail-item">
                    <label>Address:</label>
                    <span>{selectedOrder.customerInfo.address}, {selectedOrder.customerInfo.city}, {selectedOrder.customerInfo.postalCode}</span>
                  </div>
                  <div className="detail-item">
                    <label>Preferred Contact:</label>
                    <span>{selectedOrder.customerInfo.preferredContact}</span>
                  </div>
                  {selectedOrder.customerInfo.bestTimeToCall && (
                    <div className="detail-item">
                      <label>Best Time to Call:</label>
                      <span>{selectedOrder.customerInfo.bestTimeToCall}</span>
                    </div>
                  )}
                  {selectedOrder.customerInfo.howDidYouHear && (
                    <div className="detail-item">
                      <label>How They Heard:</label>
                      <span>{selectedOrder.customerInfo.howDidYouHear}</span>
                    </div>
                  )}
                  {selectedOrder.customerInfo.additionalNotes && (
                    <div className="detail-item full-width">
                      <label>Additional Notes:</label>
                      <span>{selectedOrder.customerInfo.additionalNotes}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Service Details */}
              <div className="details-section">
                <h3>Service Details</h3>
                {selectedOrder.lineItems && selectedOrder.lineItems.length > 0 ? (
                  // Cart Order
                  <div className="service-list">
                    {selectedOrder.lineItems.map((item, index) => (
                      <div key={index} className="service-item">
                        <div className="service-header">
                          <h4>{item.serviceName}</h4>
                          <span className="service-price">${item.estimate?.totalCost?.toFixed(2) || '0.00'}</span>
                        </div>
                        <div className="service-details">
                          <p><strong>Service Type:</strong> {item.serviceType}</p>
                          {item.formData && Object.keys(item.formData).length > 0 && (
                            <div className="form-data">
                              <h5>Service Specifications:</h5>
                              <div className="form-data-grid">
                                {Object.entries(item.formData).map(([key, value]) => (
                                  <div key={key} className="form-data-item">
                                    <label>{key.replace(/([A-Z])/g, ' $1').trim()}:</label>
                                    <span>{formatFormDataValue(key, value)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {/* Cart Totals */}
                    {selectedOrder.totals && (
                      <div className="cart-totals">
                        <h4>Order Summary</h4>
                        <div className="totals-grid">
                          <div className="total-item">
                            <span>Items Subtotal:</span>
                            <span>${selectedOrder.totals.itemsSubtotal?.toFixed(2) || '0.00'}</span>
                          </div>
                          {selectedOrder.totals.travelFeeAdjustment && selectedOrder.totals.travelFeeAdjustment > 0 && (
                            <div className="total-item">
                              <span>Travel Fee:</span>
                              <span>${selectedOrder.totals.travelFeeAdjustment.toFixed(2)}</span>
                            </div>
                          )}
                          {selectedOrder.totals.discount && selectedOrder.totals.discount > 0 && (
                            <div className="total-item discount">
                              <span>Discount (15%):</span>
                              <span>-${selectedOrder.totals.discount.toFixed(2)}</span>
                            </div>
                          )}
                          <div className="total-item grand-total">
                            <span>Grand Total:</span>
                            <span>${selectedOrder.totals.grandTotal?.toFixed(2) || '0.00'}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  // Single Service
                  <div className="service-item">
                    <div className="service-header">
                      <h4>{selectedOrder.serviceName}</h4>
                      <span className="service-price">${selectedOrder.estimate?.totalCost?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="service-details">
                      <p><strong>Service Type:</strong> {selectedOrder.serviceType}</p>
                      {selectedOrder.formData && Object.keys(selectedOrder.formData).length > 0 && (
                        <div className="form-data">
                          <h5>Service Specifications:</h5>
                          <div className="form-data-grid">
                            {Object.entries(selectedOrder.formData).map(([key, value]) => (
                              <div key={key} className="form-data-item">
                                <label>{key.replace(/([A-Z])/g, ' $1').trim()}:</label>
                                <span>{formatFormDataValue(key, value)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Order Status & Timeline */}
              <div className="details-section">
                <h3>Order Status & Timeline</h3>
                <div className="status-timeline">
                  <div className="timeline-item">
                    <span className="timeline-date">{formatDate(selectedOrder.createdAt)}</span>
                    <span className="timeline-status">Order Created</span>
                  </div>
                  <div className="timeline-item">
                    <span className="timeline-date">{formatDate(selectedOrder.updatedAt)}</span>
                    <span className="timeline-status">Status: {selectedOrder.status.toUpperCase()}</span>
                  </div>
                  {selectedOrder.scheduledDate && (
                    <div className="timeline-item">
                      <span className="timeline-date">{formatDate(selectedOrder.scheduledDate)}</span>
                      <span className="timeline-status">Scheduled</span>
                    </div>
                  )}
                  {selectedOrder.completionDate && (
                    <div className="timeline-item">
                      <span className="timeline-date">{formatDate(selectedOrder.completionDate)}</span>
                      <span className="timeline-status">Completed</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeOrderDetails}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
