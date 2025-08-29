import React, { useState, useEffect, useRef } from 'react'
import './QuoteCalculator.css'

// Service types matching the services page
type ServiceCategory = 'interior' | 'exterior' | 'specialty' | null
type ServiceType = string

// Legacy Room interface for interior services
interface Room {
  id: string
  length: number
  width: number
  height: number
  addons: {
    ceilings: boolean
    doors: number
    windows: number
    trims: boolean
    baseboards: boolean
    closets: number
  }
}

interface QuoteCalculatorProps {}

const QuoteCalculator: React.FC<QuoteCalculatorProps> = () => {
  // Main quote flow state
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>(null)
  const [selectedService, setSelectedService] = useState<ServiceType>('')
  
  // Legacy room state for interior painting
  const [rooms, setRooms] = useState<Room[]>([])
  
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  })
  const [lastAddedRoomId, setLastAddedRoomId] = useState<string | null>(null)
  const [preferredDate, setPreferredDate] = useState('')
  const roomRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  // Service definitions matching ServicesPage
  const serviceCategories = {
    interior: {
      title: "Interior Painting",
      icon: "🏠",
      services: [
        { id: 'accent-wall', name: 'Accent Wall Painting', icon: '🎨', priceRange: '$150 - $400' },
        { id: 'touch-ups', name: 'Interior Touch-ups', icon: '🖌️', priceRange: '$75 - $200' },
        { id: 'cabinets', name: 'Kitchen or Bathroom Cabinet Painting', icon: '🏺', priceRange: '$800 - $2,500' },
        { id: 'small-room', name: 'Small Room Makeover', icon: '🛏️', priceRange: '$400 - $1,200' },
        { id: 'window-trim', name: 'Window & Trim Repainting', icon: '🪟', priceRange: '$200 - $600' },
        { id: 'other-interior', name: 'Other Interior Services', icon: '✨', priceRange: 'Quote on request' }
      ]
    },
    exterior: {
      title: "Exterior Painting",
      icon: "🏡",
      services: [
        { id: 'deck-staining', name: 'Deck Staining/Painting', icon: '🏗️', priceRange: '$300 - $1,500' },
        { id: 'exterior-touch-ups', name: 'Exterior Touch-ups', icon: '🔧', priceRange: '$150 - $500' },
        { id: 'garage-door', name: 'Garage & Front Door Painting', icon: '🚪', priceRange: '$200 - $800' },
        { id: 'porch-rail', name: 'Porch or Stair Rail Painting', icon: '🏛️', priceRange: '$150 - $600' },
        { id: 'shed', name: 'Shed or Small Outbuilding Painting', icon: '🏚️', priceRange: '$300 - $1,000' },
        { id: 'other-exterior', name: 'Other Exterior Services', icon: '🎯', priceRange: 'Quote on request' }
      ]
    },
    specialty: {
      title: "Specialty & Cleaning Services",
      icon: "🧽",
      services: [
        { id: 'pressure-washing', name: 'Pressure Washing', icon: '💨', priceRange: '$150 - $500' },
        { id: 'other-specialty', name: 'Other Specialty Services', icon: '🛠️', priceRange: 'Quote on request' }
      ]
    }
  }

  // Pricing constants (per square foot and per item)
  const PRICING = {
    wallPainting: 3.50, // per sq ft
    ceilingPainting: 2.50, // per sq ft
    doorPainting: 75, // per door
    windowTrim: 25, // per window
    trimPainting: 4, // per linear foot
    baseboardPainting: 3, // per linear foot
    closetPainting: 150 // per closet
  }

  // Generate dynamic room name based on position
  const getRoomName = (roomId: string) => {
    const roomIndex = rooms.findIndex(room => room.id === roomId)
    return roomIndex >= 0 ? `Room ${roomIndex + 1}` : 'Room'
  }

  const addRoom = () => {
    // Always add room directly - no calendar popup
    addRoomDirectly()
  }

  const addRoomDirectly = () => {
    const newRoomId = Date.now().toString()
    const newRoom: Room = {
      id: newRoomId,
      length: 0,
      width: 0,
      height: 0,
      addons: {
        ceilings: false,
        doors: 0,
        windows: 0,
        trims: false,
        baseboards: false,
        closets: 0
      }
    }
    setRooms([...rooms, newRoom])
    setLastAddedRoomId(newRoomId)
  }



  // Scroll to newly added room
  useEffect(() => {
    if (lastAddedRoomId && roomRefs.current[lastAddedRoomId]) {
      const element = roomRefs.current[lastAddedRoomId]
      if (element) {
        setTimeout(() => {
          const elementTop = element.getBoundingClientRect().top + window.pageYOffset
          const offsetPosition = elementTop - 160 // 100px padding from top
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          })
        }, 100) // Small delay to ensure DOM is updated
      }
      setLastAddedRoomId(null) // Reset after scrolling
    }
  }, [lastAddedRoomId, rooms])

  const removeRoom = (roomId: string) => {
    setRooms(rooms.filter(room => room.id !== roomId))
  }

  const updateRoom = (roomId: string, updates: Partial<Room>) => {
    setRooms(rooms.map(room => 
      room.id === roomId ? { ...room, ...updates } : room
    ))
  }

  const updateRoomAddon = (roomId: string, addon: keyof Room['addons'], value: boolean | number) => {
    setRooms(rooms.map(room => 
      room.id === roomId 
        ? { ...room, addons: { ...room.addons, [addon]: value } }
        : room
    ))
  }

  const calculateRoomCost = (room: Room) => {
    const wallArea = 2 * (room.length * room.height + room.width * room.height)
    const ceilingArea = room.length * room.width
    const perimeter = 2 * (room.length + room.width)
    
    let cost = wallArea * PRICING.wallPainting
    
    if (room.addons.ceilings) {
      cost += ceilingArea * PRICING.ceilingPainting
    }
    
    cost += room.addons.doors * PRICING.doorPainting
    cost += room.addons.windows * PRICING.windowTrim
    cost += room.addons.closets * PRICING.closetPainting
    
    if (room.addons.trims) {
      cost += perimeter * PRICING.trimPainting
    }
    
    if (room.addons.baseboards) {
      cost += perimeter * PRICING.baseboardPainting
    }
    
    return cost
  }

  const getTotalCost = () => {
    return rooms.reduce((total, room) => total + calculateRoomCost(room), 0)
  }

  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the quote to your backend
    const quoteData = {
      customer: customerInfo,
      service: {
        category: selectedCategory,
        type: selectedService,
        details: rooms.length > 0 ? { rooms } : {}
      },
      totalCost: rooms.length > 0 ? getTotalCost() : 0,
      preferredDate,
      date: new Date().toISOString()
    }
    console.log('Quote submitted:', quoteData)
    
    const serviceName = serviceCategories[selectedCategory!]?.services.find(s => s.id === selectedService)?.name
    const message = rooms.length > 0 
      ? `Quote for ${serviceName}! Total: $${getTotalCost().toFixed(2)}\nWe'll contact you within 24 hours.`
      : `Quote request for ${serviceName} submitted!\nWe'll contact you within 24 hours with pricing details.`
    
    alert(message)
  }

  // Reset flow when changing categories
  const handleCategorySelect = (category: ServiceCategory) => {
    setSelectedCategory(category)
    setSelectedService('')
    setRooms([])
  }

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId)
  }

  const renderServiceCategorySelection = () => (
    <section className="service-category-selection">
      <h2>What type of service do you need?</h2>
      <p>Choose the category that best matches your painting project</p>
      
      <div className="category-grid">
        {Object.entries(serviceCategories).map(([key, category]) => (
          <div 
            key={key}
            className={`category-card ${selectedCategory === key ? 'selected' : ''}`}
            onClick={() => handleCategorySelect(key as ServiceCategory)}
          >
            <span className="category-icon">{category.icon}</span>
            <h3>{category.title}</h3>
            <p>{category.services.length} services available</p>
          </div>
        ))}
      </div>
    </section>
  )

  const renderServiceSelection = () => {
    if (!selectedCategory) return null
    
    const category = serviceCategories[selectedCategory]
    
    return (
      <section className="service-selection">
        <div className="service-header">
          <button 
            className="btn-back"
            onClick={() => setSelectedCategory(null)}
          >
            <img src="/back-btn.png" alt="Back" />
          </button>
          <h2>{category.title}</h2>
        </div>
        
        <div className="services-grid">
          {category.services.map((service) => (
            <div 
              key={service.id}
              className={`service-card ${selectedService === service.id ? 'selected' : ''}`}
              onClick={() => handleServiceSelect(service.id)}
            >
              <span className="service-icon">{service.icon}</span>
              <h3>{service.name}</h3>
              <div className="price-range">
                <span className="price-label">Starting from:</span>
                <span className="price">{service.priceRange}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  const renderServiceForm = () => {
    if (!selectedService) return null
    
    const category = serviceCategories[selectedCategory!]
    const service = category.services.find(s => s.id === selectedService)
    
    if (!service) return null

    return (
      <section className="service-form">
        <div className="form-header">
          <div className="form-header-top">
            <button 
              className="btn-back"
              onClick={() => setSelectedService('')}
            >
              <img src="/back-btn.png" alt="Back" />
            </button>
            <h2>{service.name}</h2>
          </div>
        </div>

        {selectedCategory === 'interior' && (selectedService === 'small-room' || selectedService === 'other-interior') && renderRoomBasedForm()}
        {selectedCategory === 'interior' && selectedService === 'accent-wall' && renderAccentWallForm()}
        {selectedCategory === 'interior' && selectedService === 'touch-ups' && renderTouchUpForm()}
        {selectedCategory === 'interior' && selectedService === 'cabinets' && renderCabinetForm()}
        {selectedCategory === 'interior' && selectedService === 'window-trim' && renderWindowTrimForm()}
        
        {selectedCategory === 'exterior' && renderExteriorForm()}
        {selectedCategory === 'specialty' && renderSpecialtyForm()}
      </section>
    )
  }

  // Service-specific form renderers
  const renderRoomBasedForm = () => (
    <div className="room-based-form">
      <div className="rooms-header">
        <h3>Rooms to Paint</h3>
        <button type="button" onClick={addRoom} className="btn-add-room">
          + Add Room
        </button>
      </div>

      {rooms.length === 0 && (
        <div className="no-rooms">
          <p>No rooms added yet. Click "Add Room" to get started!</p>
        </div>
      )}

      {rooms.map((room) => (
        <div 
          key={room.id} 
          className="room-card"
          ref={(el) => { roomRefs.current[room.id] = el }}
        >
          <div className="room-header">
            <span className="room-name-display">
              {getRoomName(room.id)}
            </span>
            <button
              type="button"
              onClick={() => removeRoom(room.id)}
              className="btn-remove-room"
            >
              Remove
            </button>
          </div>

          <div className="room-dimensions">
            <h4>Room Dimensions (feet)</h4>
            <div className="dimensions-grid">
              <div className="dimension-input">
                <label>Length</label>
                <input
                  type="number"
                  value={room.length || ''}
                  onChange={(e) => updateRoom(room.id, { length: parseFloat(e.target.value) || 0 })}
                  min="1"
                  step="0.5"
                />
              </div>
              <div className="dimension-input">
                <label>Width</label>
                <input
                  type="number"
                  value={room.width || ''}
                  onChange={(e) => updateRoom(room.id, { width: parseFloat(e.target.value) || 0 })}
                  min="1"
                  step="0.5"
                />
              </div>
              <div className="dimension-input">
                <label>Height</label>
                <input
                  type="number"
                  value={room.height || ''}
                  onChange={(e) => updateRoom(room.id, { height: parseFloat(e.target.value) || 0 })}
                  min="7"
                  step="0.5"
                />
              </div>
            </div>
          </div>

          <div className="room-addons">
            <h4>Additional Services</h4>
            <div className="addons-grid">
              <label className="addon-checkbox">
                <input
                  type="checkbox"
                  checked={room.addons.ceilings}
                  onChange={(e) => updateRoomAddon(room.id, 'ceilings', e.target.checked)}
                />
                <span>Paint Ceilings (+$2.50/sq ft)</span>
              </label>

              <label className="addon-checkbox">
                <input
                  type="checkbox"
                  checked={room.addons.trims}
                  onChange={(e) => updateRoomAddon(room.id, 'trims', e.target.checked)}
                />
                <span>Paint Trims & Moldings (+$4/linear ft)</span>
              </label>

              <label className="addon-checkbox">
                <input
                  type="checkbox"
                  checked={room.addons.baseboards}
                  onChange={(e) => updateRoomAddon(room.id, 'baseboards', e.target.checked)}
                />
                <span>Paint Baseboards (+$3/linear ft)</span>
              </label>

              <div className="addon-number">
                <label>Doors to Paint</label>
                <input
                  type="number"
                  value={room.addons.doors || ''}
                  onChange={(e) => updateRoomAddon(room.id, 'doors', parseInt(e.target.value) || 0)}
                  min="0"
                />
                <span className="addon-price">$75 each</span>
              </div>

              <div className="addon-number">
                <label>Windows (trim only)</label>
                <input
                  type="number"
                  value={room.addons.windows || ''}
                  onChange={(e) => updateRoomAddon(room.id, 'windows', parseInt(e.target.value) || 0)}
                  min="0"
                />
                <span className="addon-price">$25 each</span>
              </div>

              <div className="addon-number">
                <label>Closets (interior)</label>
                <input
                  type="number"
                  value={room.addons.closets || ''}
                  onChange={(e) => updateRoomAddon(room.id, 'closets', parseInt(e.target.value) || 0)}
                  min="0"
                />
                <span className="addon-price">$150 each</span>
              </div>
            </div>
          </div>

          <div className="room-cost">
            <strong>Room Total: ${calculateRoomCost(room).toFixed(2)}</strong>
          </div>
        </div>
      ))}
    </div>
  )

  const renderAccentWallForm = () => (
    <div className="simple-form">
      <h3>Accent Wall Details</h3>
      <div className="form-grid">
        <div className="form-group">
          <label>Wall Length (feet)</label>
          <input type="number" min="1" step="0.5" placeholder="e.g. 12" />
        </div>
        <div className="form-group">
          <label>Wall Height (feet)</label>
          <input type="number" min="7" step="0.5" placeholder="e.g. 9" />
        </div>
        <div className="form-group full-width">
          <label>Special Requirements or Notes</label>
          <textarea rows={3} placeholder="Any special requirements, color preferences, or additional details..."></textarea>
        </div>
      </div>
    </div>
  )

  const renderTouchUpForm = () => (
    <div className="simple-form">
      <h3>Touch-Up Details</h3>
      <div className="form-grid">
        <div className="form-group">
          <label>Number of Areas</label>
          <input type="number" min="1" placeholder="e.g. 3" />
        </div>
        <div className="form-group">
          <label>Estimated Total Area</label>
          <select>
            <option value="">Select area size</option>
            <option value="small">Small (under 10 sq ft)</option>
            <option value="medium">Medium (10-50 sq ft)</option>
            <option value="large">Large (50+ sq ft)</option>
          </select>
        </div>
        <div className="form-group full-width">
          <label>Describe Areas Needing Touch-Up</label>
          <textarea rows={4} placeholder="Describe the areas that need touch-up work (scuffs, holes, scratches, etc.)..."></textarea>
        </div>
      </div>
    </div>
  )

  const renderCabinetForm = () => (
    <div className="simple-form">
      <h3>Cabinet Painting Details</h3>
      <div className="form-grid">
        <div className="form-group">
          <label>Number of Cabinet Doors</label>
          <input type="number" min="1" placeholder="e.g. 15" />
        </div>
        <div className="form-group">
          <label>Number of Drawers</label>
          <input type="number" min="0" placeholder="e.g. 8" />
        </div>
        <div className="form-group full-width">
          <label>Additional Details</label>
          <textarea rows={3} placeholder="Any additional details about the cabinets or special requirements..."></textarea>
        </div>
      </div>
    </div>
  )

  const renderWindowTrimForm = () => (
    <div className="simple-form">
      <h3>Window & Trim Details</h3>
      <div className="form-grid">
        <div className="form-group">
          <label>Number of Windows</label>
          <input type="number" min="1" placeholder="e.g. 5" />
        </div>
        <div className="form-group">
          <label>Linear Feet of Trim</label>
          <input type="number" min="1" step="0.5" placeholder="e.g. 50" />
        </div>
        <div className="form-group full-width">
          <label>Additional Details</label>
          <textarea rows={3} placeholder="Any specific requirements or areas of focus..."></textarea>
        </div>
      </div>
    </div>
  )

  const renderExteriorForm = () => (
    <div className="simple-form">
      <h3>Exterior Project Details</h3>
      <div className="form-grid">
        <div className="form-group full-width">
          <label>Project Description</label>
          <textarea rows={4} placeholder="Describe your exterior painting project in detail..."></textarea>
        </div>
      </div>
    </div>
  )

  const renderSpecialtyForm = () => (
    <div className="simple-form">
      <h3>Specialty Service Details</h3>
      <div className="form-grid">
        <div className="form-group full-width">
          <label>Service Description</label>
          <textarea rows={4} placeholder="Describe the specialty service you need..."></textarea>
        </div>
      </div>
    </div>
  )

  return (
    <div className="quote-calculator">
      <div className="quote-hero">
        <div className="container">
          <div className="quote-header">
            <h1>Get Your Free Quote</h1>
            <p>Tell us about your project and get an instant estimate</p>
          </div>
        </div>
      </div>

      <div className="quote-content">
        <form onSubmit={handleSubmitQuote} className="quote-form">
        {/* Customer Information */}
        <section className="customer-info">
          <h2>Contact Information</h2>
          <div className="form-grid">
            <input
              type="text"
              placeholder="Full Name"
              value={customerInfo.name}
              onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
              required
            />
            <input
              type="email"
              placeholder="Email Address"
              value={customerInfo.email}
              onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
              required
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={customerInfo.phone}
              onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Property Address"
              value={customerInfo.address}
              onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
              required
            />
          </div>
        </section>

        {/* Service Selection Flow */}
        {!selectedCategory && renderServiceCategorySelection()}
        {selectedCategory && !selectedService && renderServiceSelection()}
        {selectedService && renderServiceForm()}

        {/* Date Selection */}
        {selectedService && (
          <section className="date-selection-section">
            <div className="date-selection-card">
              <h3>Select Your Preferred Date</h3>
              <p>When would you like your painting project to begin? This field is required.</p>
              
              <div className="calendar-input">
                <label htmlFor="preferred-date">Choose Date: *</label>
                <input
                  id="preferred-date"
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>
          </section>
        )}

        {/* Quote Summary */}
        {selectedService && (
          <section className="quote-summary">
            <h2>Quote Summary</h2>
            <div className="summary-details">
              {preferredDate && (
                <div className="summary-line">
                  <span>Preferred Start Date:</span>
                  <span>{new Date(preferredDate).toLocaleDateString()}</span>
                </div>
              )}
              <div className="summary-line">
                <span>Service:</span>
                <span>{serviceCategories[selectedCategory!]?.services.find(s => s.id === selectedService)?.name}</span>
              </div>
              {rooms.length > 0 && (
                <>
                  <div className="summary-line">
                    <span>Total Rooms:</span>
                    <span>{rooms.length}</span>
                  </div>
                  <div className="summary-line">
                    <span>Total Square Footage (walls):</span>
                    <span>
                      {rooms.reduce((total, room) => 
                        total + (2 * (room.length * room.height + room.width * room.height)), 0
                      ).toFixed(0)} sq ft
                    </span>
                  </div>
                  <div className="summary-line total">
                    <span>Estimated Total:</span>
                    <span>${getTotalCost().toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>
            <div className="summary-note">
              <p><strong>Note:</strong> This is an estimate based on standard conditions. Final pricing may vary based on surface preparation needs, paint quality selection, and site conditions.</p>
            </div>
          </section>
        )}

        {/* Submit Button */}
        <div className="quote-submit">
          <button 
            type="submit" 
            className="btn-submit-quote" 
            disabled={!selectedService || !preferredDate}
          >
            Get Official Quote
          </button>
          <p>We'll review your request and contact you within 24 hours with a detailed quote.</p>
        </div>
      </form>
      </div>
    </div>
  )
}

export default QuoteCalculator
