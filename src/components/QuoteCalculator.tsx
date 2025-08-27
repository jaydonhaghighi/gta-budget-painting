import React, { useState, useEffect, useRef } from 'react'
import './QuoteCalculator.css'

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
      rooms: rooms,
      totalCost: getTotalCost(),
      date: new Date().toISOString()
    }
    console.log('Quote submitted:', quoteData)
    alert(`Quote calculated! Total: $${getTotalCost().toFixed(2)}\nWe'll contact you within 24 hours.`)
  }

  return (
    <div className="quote-calculator">
      <div className="quote-hero">
        <div className="container">
          <div className="quote-header">
            <h1>Get Your Free Quote</h1>
            <p>Add your rooms and select painting options to get an instant estimate</p>
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

        {/* Rooms Section */}
        <section className="rooms-section">
          <div className="rooms-header">
            <h2>Rooms to Paint</h2>
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
                <h3>Room Dimensions (feet)</h3>
                <div className="dimensions-grid">
                  <div className="dimension-input">
                    <label>Length</label>
                    <input
                      type="number"
                      value={room.length}
                      onChange={(e) => updateRoom(room.id, { length: parseFloat(e.target.value) || 0 })}
                      min="1"
                      step="0.5"
                    />
                  </div>
                  <div className="dimension-input">
                    <label>Width</label>
                    <input
                      type="number"
                      value={room.width}
                      onChange={(e) => updateRoom(room.id, { width: parseFloat(e.target.value) || 0 })}
                      min="1"
                      step="0.5"
                    />
                  </div>
                  <div className="dimension-input">
                    <label>Height</label>
                    <input
                      type="number"
                      value={room.height}
                      onChange={(e) => updateRoom(room.id, { height: parseFloat(e.target.value) || 0 })}
                      min="7"
                      step="0.5"
                    />
                  </div>
                </div>
              </div>

              <div className="room-addons">
                <h3>Additional Services</h3>
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
                      value={room.addons.doors}
                      onChange={(e) => updateRoomAddon(room.id, 'doors', parseInt(e.target.value) || 0)}
                      min="0"
                    />
                    <span className="addon-price">$75 each</span>
                  </div>

                  <div className="addon-number">
                    <label>Windows (trim only)</label>
                    <input
                      type="number"
                      value={room.addons.windows}
                      onChange={(e) => updateRoomAddon(room.id, 'windows', parseInt(e.target.value) || 0)}
                      min="0"
                    />
                    <span className="addon-price">$25 each</span>
                  </div>

                  <div className="addon-number">
                    <label>Closets (interior)</label>
                    <input
                      type="number"
                      value={room.addons.closets}
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
        </section>

        {/* Date Selection */}
        {rooms.length > 0 && (
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
                          min={new Date().toISOString().split('T')[0]} // Today or later
                          required
                        />
                      </div>
                    </div>
                  </section>
                )}

        {/* Quote Summary */}
        {rooms.length > 0 && (
          <section className="quote-summary">
            <div className="summary-card">
              <h2>Quote Summary</h2>
              <div className="summary-details">
                {preferredDate && (
                  <div className="summary-line">
                    <span>Preferred Start Date:</span>
                    <span>{new Date(preferredDate).toLocaleDateString()}</span>
                  </div>
                )}
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
              </div>
              <div className="summary-note">
                <p><strong>Note:</strong> This is an estimate based on standard conditions. Final pricing may vary based on surface preparation needs, paint quality selection, and site conditions.</p>
              </div>
            </div>
          </section>
        )}

        {/* Submit Button */}
        <div className="quote-submit">
          <button type="submit" className="btn-submit-quote" disabled={rooms.length === 0 || !preferredDate}>
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
