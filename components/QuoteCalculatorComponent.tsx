import React, { useState, useEffect, useRef, useCallback } from 'react'

// Service types matching the services page
type ServiceCategory = 'interior' | 'exterior' | 'specialty' | null
type ServiceType = string

// Step types for the wizard flow
type WizardStep = 'service-category' | 'service-type' | 'project-details' | 'contact-info' | 'summary'

// Room interface for interior services
interface Room {
  id: string
  type: string
  name: string
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
    accentWalls: boolean
    crownMolding: boolean
    stuccoCeiling: boolean
    ensuiteBathroom: boolean
  }
}

// Quick room presets for faster selection
interface RoomPreset {
  id: string
  name: string
  displayName: string
  dimensions: { length: number; width: number; height: number }
}

interface QuoteCalculatorProps {
  preSelectedCategory?: string | null
  preSelectedService?: string | null
}

// Quote data interface for email functionality
interface QuoteData {
  customer: {
    name: string
    email: string
    phone: string
    address?: string
    city?: string
  }
  service: {
    category: ServiceCategory
    type: ServiceType
    details: { rooms: Room[] } | { description: string }
  }
  totalCost: number
  projectDetails: {
    description: string
    urgency: string
    budget: string
    additionalNotes: string
  }
  preferredDate: string
  date: string
  quoteId: string
}

// Room Card Component with collapsible addons (moved outside main component)
const RoomCard: React.FC<{
  room: Room;
  onUpdate: (roomId: string, updates: Partial<Room>) => void;
  onUpdateAddon: (roomId: string, addon: keyof Room['addons'], value: boolean | number) => void;
  onRemove: (roomId: string) => void;
  calculateCost: (room: Room) => number;
}> = React.memo(({ room, onUpdate, onUpdateAddon, onRemove, calculateCost }) => {
  const [showBasicAddons, setShowBasicAddons] = useState(false)
  const [showSpecialAddons, setShowSpecialAddons] = useState(false)
  const [showElementAddons, setShowElementAddons] = useState(false)

  // Basic Services - Available for all room types
  const basicAddons = [
    { key: 'ceilings', label: 'Paint Ceilings', price: '+$2.50/sq ft', type: 'checkbox' },
    { key: 'trims', label: 'Paint Trims & Moldings', price: '+$4/linear ft', type: 'checkbox' },
    { key: 'baseboards', label: 'Paint Baseboards', price: '+$3/linear ft', type: 'checkbox' }
  ]

  // Special Features - Room-specific options
  const getSpecialAddons = () => {
    const common = [
      { key: 'accentWalls', label: 'Accent Walls', price: '+$1.50/sq ft', type: 'checkbox' }
    ]

    switch (room.type) {
      case 'room': // General rooms (living, dining, office, hallway)
        return [
          ...common,
          { key: 'crownMolding', label: 'Crown Molding', price: '+$6/linear ft', type: 'checkbox' },
          { key: 'stuccoCeiling', label: 'Stucco Ceiling', price: '+$4.50/sq ft', type: 'checkbox' },
          { key: 'ensuiteBathroom', label: 'Ensuite Bathroom', price: '+$200', type: 'checkbox' }
        ]
      
      case 'bedroom': // Bedrooms
        return [
          ...common,
          { key: 'crownMolding', label: 'Crown Molding', price: '+$6/linear ft', type: 'checkbox' },
          { key: 'ensuiteBathroom', label: 'Ensuite Bathroom', price: '+$200', type: 'checkbox' }
        ]
      
      case 'kitchen': // Kitchen
        return [
          ...common,
          { key: 'crownMolding', label: 'Crown Molding', price: '+$6/linear ft', type: 'checkbox' }
        ]
      
      case 'bathroom': // Bathroom
        return [
          ...common
          // No crown molding or stucco ceiling in bathrooms typically
        ]
      
      default:
        return common
    }
  }

  const specialAddons = getSpecialAddons()

  // Elements & Features - Room-specific counts
  const getElementAddons = () => {
    const common = [
      { key: 'doors', label: 'Doors to Paint', price: '$75 each', type: 'number' },
      { key: 'windows', label: 'Windows (trim only)', price: '$25 each', type: 'number' }
    ]

    switch (room.type) {
      case 'room': // General rooms
      case 'bedroom': // Bedrooms
        return [
          ...common,
          { key: 'closets', label: 'Closets (interior)', price: '$150 each', type: 'number' }
        ]
      
      case 'bathroom': // Bathrooms
        return [
          ...common,
          { key: 'closets', label: 'Linen Closets', price: '$150 each', type: 'number' }
        ]
      
      case 'kitchen': // Kitchen
        return common // No closets typically
      
      default:
        return common
    }
  }

  const elementAddons = getElementAddons()

  return (
    <div className="room-summary-card">
      <div className="room-summary-header">
        <input
          type="text"
          value={room.name}
          onChange={(e) => onUpdate(room.id, { name: e.target.value })}
          className="room-name-input"
          placeholder="Room name"
        />
        <span className="room-summary-cost">${calculateCost(room).toFixed(2)}</span>
        <button 
          type="button" 
          className="btn-remove-small"
          onClick={() => onRemove(room.id)}
        >
          ×
        </button>
      </div>

      <div className="room-dimensions">
        <div className="dimensions-row">
          <div className="dimension-input">
            <label>Length</label>
            <input
              type="number"
              value={room.length || ''}
              onChange={(e) => onUpdate(room.id, { length: parseFloat(e.target.value) || 0 })}
              min="1"
              step="0.5"
            />
          </div>
          <div className="dimension-input">
            <label>Width</label>
            <input
              type="number"
              value={room.width || ''}
              onChange={(e) => onUpdate(room.id, { width: parseFloat(e.target.value) || 0 })}
              min="1"
              step="0.5"
            />
          </div>
          <div className="dimension-input">
            <label>Height</label>
            <input
              type="number"
              value={room.height || ''}
              onChange={(e) => onUpdate(room.id, { height: parseFloat(e.target.value) || 0 })}
              min="7"
              step="0.5"
            />
          </div>
        </div>
      </div>

      <div className="room-addons">
        {/* Basic Services Collapsible */}
        <div className="addon-section">
          <button
            type="button"
            className={`addon-toggle ${showBasicAddons ? 'expanded' : ''}`}
            onClick={() => setShowBasicAddons(!showBasicAddons)}
          >
            <span>Basic Services</span>
            <span className="toggle-icon">{showBasicAddons ? '−' : '+'}</span>
          </button>
          
          {showBasicAddons && (
            <div className="addon-content">
              {basicAddons.map((addon) => (
                <label key={addon.key} className="addon-option">
                  <input
                    type="checkbox"
                    checked={room.addons[addon.key as keyof Room['addons']] as boolean}
                    onChange={(e) => onUpdateAddon(room.id, addon.key as keyof Room['addons'], e.target.checked)}
                  />
                  <span className="addon-label">{addon.label}</span>
                  <span className="addon-price">{addon.price}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Special Features Collapsible */}
        {specialAddons.length > 0 && (
          <div className="addon-section">
            <button
              type="button"
              className={`addon-toggle ${showSpecialAddons ? 'expanded' : ''}`}
              onClick={() => setShowSpecialAddons(!showSpecialAddons)}
            >
              <span>Special Features</span>
              <span className="toggle-icon">{showSpecialAddons ? '−' : '+'}</span>
            </button>
            
            {showSpecialAddons && (
              <div className="addon-content">
                {specialAddons.map((addon) => (
                  <label key={addon.key} className="addon-option">
                    <input
                      type="checkbox"
                      checked={room.addons[addon.key as keyof Room['addons']] as boolean}
                      onChange={(e) => onUpdateAddon(room.id, addon.key as keyof Room['addons'], e.target.checked)}
                    />
                    <span className="addon-label">{addon.label}</span>
                    <span className="addon-price">{addon.price}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Elements & Features - Collapsible with plus/minus controls */}
        {elementAddons.length > 0 && (
          <div className="addon-section">
            <button
              type="button"
              className={`addon-toggle ${showElementAddons ? 'expanded' : ''}`}
              onClick={() => setShowElementAddons(!showElementAddons)}
            >
              <span>Elements & Features</span>
              <span className="toggle-icon">{showElementAddons ? '−' : '+'}</span>
            </button>
            
            {showElementAddons && (
              <div className="addon-content">
                {elementAddons.map((addon) => (
                  <div key={addon.key} className="addon-counter">
                    <div className="counter-info">
                      <span className="counter-label">{addon.label}</span>
                      <span className="addon-price">{addon.price}</span>
                    </div>
                    <div className="counter-controls">
                      <button
                        type="button"
                        className="counter-btn minus"
                        onClick={() => {
                          const currentValue = room.addons[addon.key as keyof Room['addons']] as number || 0;
                          if (currentValue > 0) {
                            onUpdateAddon(room.id, addon.key as keyof Room['addons'], currentValue - 1);
                          }
                        }}
                        disabled={(room.addons[addon.key as keyof Room['addons']] as number || 0) <= 0}
                      >
                        −
                      </button>
                      <span className="counter-value">
                        {room.addons[addon.key as keyof Room['addons']] as number || 0}
                      </span>
                      <button
                        type="button"
                        className="counter-btn plus"
                        onClick={() => {
                          const currentValue = room.addons[addon.key as keyof Room['addons']] as number || 0;
                          onUpdateAddon(room.id, addon.key as keyof Room['addons'], currentValue + 1);
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
})

const QuoteCalculatorComponent: React.FC<QuoteCalculatorProps> = ({ preSelectedCategory, preSelectedService }) => {
  // Wizard flow state
  const [currentStep, setCurrentStep] = useState<WizardStep>('service-category')
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>(
    (preSelectedCategory as ServiceCategory) || null
  )
  const [selectedService, setSelectedService] = useState<ServiceType>(preSelectedService || '')
  
  // Project details state
  const [rooms, setRooms] = useState<Room[]>([])
  const [projectDetails, setProjectDetails] = useState({
    description: '',
    urgency: 'flexible', // flexible, soon, urgent
    budget: '', // under-500, 500-1500, 1500-3000, 3000-plus
    additionalNotes: ''
  })
  
  // Customer info (moved to later step)
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    country: ''
  })
  const [preferredDate, setPreferredDate] = useState('')
  
  // UI state
  const [lastAddedRoomId, setLastAddedRoomId] = useState<string | null>(null)
  const [estimatedPrice, setEstimatedPrice] = useState(0)
  const roomRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  // Room presets for quick selection
  const roomPresets: RoomPreset[] = [
    { id: 'small-bedroom', name: 'bedroom', displayName: 'Small Bedroom', dimensions: { length: 10, width: 10, height: 8 } },
    { id: 'large-bedroom', name: 'bedroom', displayName: 'Large Bedroom', dimensions: { length: 14, width: 12, height: 9 } },
    { id: 'living-room', name: 'room', displayName: 'Living Room', dimensions: { length: 16, width: 14, height: 9 } },
    { id: 'kitchen', name: 'kitchen', displayName: 'Kitchen', dimensions: { length: 12, width: 10, height: 9 } },
    { id: 'bathroom', name: 'bathroom', displayName: 'Bathroom', dimensions: { length: 8, width: 6, height: 8 } },
    { id: 'dining-room', name: 'room', displayName: 'Dining Room', dimensions: { length: 12, width: 10, height: 9 } },
    { id: 'home-office', name: 'room', displayName: 'Home Office', dimensions: { length: 10, width: 8, height: 8 } },
    { id: 'hallway', name: 'room', displayName: 'Hallway', dimensions: { length: 12, width: 4, height: 8 } }
  ]

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
    closetPainting: 150, // per closet
    accentWalls: 1.50, // additional per sq ft
    crownMolding: 6, // per linear foot
    stuccoCeiling: 4.50, // per sq ft
    ensuiteBathroom: 200 // flat fee for ensuite bathroom features
  }

  // Removed unused getRoomName function

  // Add room from preset for quick selection
  const addRoomFromPreset = (preset: RoomPreset) => {
    const newRoomId = Date.now().toString()
    const addons = {
      ceilings: false,
      doors: 0,
      windows: 0,
      trims: false,
      baseboards: false,
      closets: 0,
      accentWalls: false,
      crownMolding: false,
      stuccoCeiling: false,
      ensuiteBathroom: false
    }
    
    const newRoom: Room = {
      id: newRoomId,
      type: preset.name,
      name: preset.displayName,
      ...preset.dimensions,
      addons
    }
    
    const updatedRooms = [...rooms, newRoom]
    setRooms(updatedRooms)
    setLastAddedRoomId(newRoomId)
    updateEstimatedPrice(updatedRooms)
  }

  const addCustomRoom = () => {
    const newRoomId = Date.now().toString()
    const newRoom: Room = {
      id: newRoomId,
      type: 'room',
      name: `Room ${rooms.length + 1}`,
      length: 0,
      width: 0,
      height: 0,
      addons: {
        ceilings: false,
        doors: 0,
        windows: 0,
        trims: false,
        baseboards: false,
        closets: 0,
        accentWalls: false,
        crownMolding: false,
        stuccoCeiling: false,
        ensuiteBathroom: false
      }
    }
    const updatedRooms = [...rooms, newRoom]
    setRooms(updatedRooms)
    setLastAddedRoomId(newRoomId)
    updateEstimatedPrice(updatedRooms)
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

  // Room cost calculation function
  const calculateRoomCost = useCallback((room: Room) => {
    const wallArea = 2 * (room.length * room.height + room.width * room.height)
    const ceilingArea = room.length * room.width
    const perimeter = 2 * (room.length + room.width)
    
    let cost = wallArea * PRICING.wallPainting
    
    // Additional cost for accent walls
    if (room.addons.accentWalls) {
      cost += wallArea * PRICING.accentWalls
    }
    
    if (room.addons.ceilings) {
      cost += ceilingArea * PRICING.ceilingPainting
    }
    
    // Stucco ceiling additional cost
    if (room.addons.stuccoCeiling) {
      cost += ceilingArea * PRICING.stuccoCeiling
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
    
    if (room.addons.crownMolding) {
      cost += perimeter * PRICING.crownMolding
    }
    
    // Ensuite bathroom flat fee
    if (room.addons.ensuiteBathroom) {
      cost += PRICING.ensuiteBathroom
    }
    
    return cost
  }, [PRICING.wallPainting, PRICING.accentWalls, PRICING.ceilingPainting, PRICING.stuccoCeiling, PRICING.doorPainting, PRICING.windowTrim, PRICING.closetPainting, PRICING.trimPainting, PRICING.baseboardPainting, PRICING.crownMolding, PRICING.ensuiteBathroom])

  // Real-time price calculation
  const updateEstimatedPrice = useCallback((roomsToCalculate: Room[]) => {
    const total = roomsToCalculate.reduce((sum, room) => sum + calculateRoomCost(room), 0)
    setEstimatedPrice(total)
  }, [calculateRoomCost])

  const removeRoom = useCallback((roomId: string) => {
    const updatedRooms = rooms.filter(room => room.id !== roomId)
    setRooms(updatedRooms)
    updateEstimatedPrice(updatedRooms)
  }, [rooms, updateEstimatedPrice])

  const updateRoom = useCallback((roomId: string, updates: Partial<Room>) => {
    const updatedRooms = rooms.map(room => 
      room.id === roomId ? { ...room, ...updates } : room
    )
    setRooms(updatedRooms)
    updateEstimatedPrice(updatedRooms)
  }, [rooms, updateEstimatedPrice])

  const updateRoomAddon = useCallback((roomId: string, addon: keyof Room['addons'], value: boolean | number) => {
    const updatedRooms = rooms.map(room => 
      room.id === roomId 
        ? { ...room, addons: { ...room.addons, [addon]: value } }
        : room
    )
    setRooms(updatedRooms)
    updateEstimatedPrice(updatedRooms)
  }, [rooms, updateEstimatedPrice])

  // Initialize price calculation when rooms change
  useEffect(() => {
    updateEstimatedPrice(rooms)
  }, [rooms, updateEstimatedPrice])

  // Save progress to localStorage
  const saveProgress = useCallback(() => {
    const progressData = {
      currentStep,
      selectedCategory,
      selectedService,
      rooms,
      projectDetails,
      customerInfo,
      preferredDate,
      timestamp: new Date().toISOString()
    }
    localStorage.setItem('gta-painting-quote-progress', JSON.stringify(progressData))
  }, [currentStep, selectedCategory, selectedService, rooms, projectDetails, customerInfo, preferredDate])

  // Load progress from localStorage
  const loadProgress = () => {
    try {
      const saved = localStorage.getItem('gta-painting-quote-progress')
      if (saved) {
        const progressData = JSON.parse(saved)
        // Only load if saved within last 7 days
        const savedTime = new Date(progressData.timestamp)
        const now = new Date()
        const daysDiff = (now.getTime() - savedTime.getTime()) / (1000 * 60 * 60 * 24)
        
        if (daysDiff <= 7) {
          setCurrentStep(progressData.currentStep || 'service-category')
          setSelectedCategory(progressData.selectedCategory || null)
          setSelectedService(progressData.selectedService || '')
          setRooms(progressData.rooms || [])
          setProjectDetails(progressData.projectDetails || {
            description: '',
            urgency: 'flexible',
            budget: '',
            additionalNotes: ''
          })
          setCustomerInfo(progressData.customerInfo || {
            name: '',
            email: '',
            phone: '',
            address: '',
            city: '',
            province: '',
            country: ''
          })
          setPreferredDate(progressData.preferredDate || '')
          return true
        }
      }
    } catch (error) {
      console.error('Error loading progress:', error)
    }
    return false
  }

  // Clear saved progress
  const clearProgress = () => {
    localStorage.removeItem('gta-painting-quote-progress')
  }

  // Auto-save progress when key state changes
  useEffect(() => {
    if (selectedCategory || selectedService || rooms.length > 0 || customerInfo.name || customerInfo.email) {
      saveProgress()
    }
  }, [currentStep, selectedCategory, selectedService, rooms, projectDetails, customerInfo, preferredDate, saveProgress])

  // Load progress on component mount
  useEffect(() => {
    const hasPreSelected = preSelectedCategory || preSelectedService
    if (!hasPreSelected) {
      loadProgress()
    }
  }, [preSelectedCategory, preSelectedService])

  // Moved calculateRoomCost function before updateEstimatedPrice

  // Removed unused getTotalCost function

  const handleSubmitQuote = async () => {
    try {
      // Prepare quote data
      const quoteData = {
        customer: customerInfo,
        service: {
          category: selectedCategory,
          type: selectedService,
          details: rooms.length > 0 ? { rooms } : { description: projectDetails.description }
        },
        totalCost: rooms.length > 0 ? estimatedPrice : 0,
        projectDetails,
        preferredDate,
        date: new Date().toISOString(),
        quoteId: `GTA-${Date.now()}`
      }
      
      console.log('Quote submitted:', quoteData)
      
      const serviceName = selectedCategory === 'interior' 
        ? 'Interior Painting' 
        : serviceCategories[selectedCategory!]?.services.find(s => s.id === selectedService)?.name

      // Send email receipt
      await sendEmailReceipt(quoteData, serviceName!)
      
      const message = rooms.length > 0 
        ? `Quote request submitted for ${serviceName}! Estimated total: $${estimatedPrice.toFixed(2)}\n\nA receipt has been sent to ${customerInfo.email}. We'll contact you within 24 hours with a detailed quote.`
        : `Quote request for ${serviceName} submitted!\n\nA receipt has been sent to ${customerInfo.email}. We'll contact you within 24 hours with pricing details.`
      
      // Clear saved progress after successful submission
      clearProgress()
      
      alert(message)
      
      // Optionally redirect to a thank you page
      // window.location.href = '/thank-you'
      
    } catch (error) {
      console.error('Error submitting quote:', error)
      alert('There was an error submitting your quote. Please try again or contact us directly.')
    }
  }

  // Email receipt function
  const sendEmailReceipt = async (quoteData: QuoteData, serviceName: string) => {
    const emailContent = generateEmailContent(quoteData, serviceName)
    
    // Option 1: Using EmailJS (requires EmailJS setup)
    // You'll need to install emailjs: npm install @emailjs/browser
    // and configure your EmailJS account
    
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: quoteData.customer.email,
          subject: `Quote Request Receipt - ${serviceName} (${quoteData.quoteId})`,
          html: emailContent,
          customerName: quoteData.customer.name
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send email')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Email sending failed:', error)
      // Don't throw error to prevent quote submission failure
      // Just log it and continue
    }
  }

  // Generate HTML email content
  const generateEmailContent = (quoteData: QuoteData, serviceName: string) => {
    const roomsHtml = ('rooms' in quoteData.service.details) ? 
      quoteData.service.details.rooms.map((room: Room) => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">
            <strong>${room.name}</strong><br>
            ${room.length}' × ${room.width}' × ${room.height}'
          </td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">
            $${calculateRoomCost(room).toFixed(2)}
          </td>
        </tr>
      `).join('') : ''

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Quote Request Receipt</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
          <h1 style="color: #000; margin: 0 0 10px 0;">GTA Budget Painting</h1>
          <h2 style="color: #666; margin: 0; font-weight: normal;">Quote Request Receipt</h2>
        </div>

        <div style="background: white; padding: 30px; border-radius: 10px; border: 1px solid #ddd;">
          <p>Dear ${quoteData.customer.name},</p>
          
          <p>Thank you for your quote request! We've received your information and will contact you within 24 hours with a detailed quote.</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 15px 0; color: #000;">Quote Details</h3>
            <p><strong>Quote ID:</strong> ${quoteData.quoteId}</p>
            <p><strong>Service:</strong> ${serviceName}</p>
            <p><strong>Date Requested:</strong> ${new Date(quoteData.date).toLocaleDateString()}</p>
            ${quoteData.preferredDate ? `<p><strong>Preferred Start Date:</strong> ${new Date(quoteData.preferredDate).toLocaleDateString()}</p>` : ''}
            ${quoteData.totalCost > 0 ? `<p><strong>Estimated Total:</strong> $${quoteData.totalCost.toFixed(2)}</p>` : ''}
          </div>

          ${roomsHtml ? `
          <div style="margin: 20px 0;">
            <h3 style="margin: 0 0 15px 0; color: #000;">Room Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background: #f8f9fa;">
                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Room</th>
                  <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Estimated Cost</th>
                </tr>
              </thead>
              <tbody>
                ${roomsHtml}
              </tbody>
            </table>
          </div>
          ` : ''}

          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 15px 0; color: #000;">Contact Information</h3>
            <p><strong>Name:</strong> ${quoteData.customer.name}</p>
            <p><strong>Email:</strong> ${quoteData.customer.email}</p>
            <p><strong>Phone:</strong> ${quoteData.customer.phone}</p>
            ${quoteData.customer.address ? `<p><strong>Project Address:</strong> ${quoteData.customer.address}, ${quoteData.customer.city}</p>` : ''}
          </div>

          <div style="border-top: 2px solid #000; padding-top: 20px; margin-top: 30px;">
            <p><strong>Next Steps:</strong></p>
            <ul>
              <li>We'll review your request and contact you within 24 hours</li>
              <li>Our team will discuss any questions and finalize the quote</li>
              <li>We'll schedule a convenient time for the work if you proceed</li>
            </ul>
          </div>

          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <p style="margin: 0;"><strong>Questions? Contact us:</strong></p>
            <p style="margin: 5px 0;">Email: info@gtabudgetpainting.com</p>
            <p style="margin: 5px 0;">Phone: (416) XXX-XXXX</p>
          </div>

          <p>Thank you for choosing GTA Budget Painting!</p>
          
          <p style="color: #666; font-size: 0.9em; margin-top: 30px;">
            <em>This is an automated receipt. Please keep this email for your records.</em>
          </p>
        </div>
      </body>
      </html>
    `
  }

  // Wizard navigation functions
  const goToNextStep = () => {
    switch (currentStep) {
      case 'service-category':
        setCurrentStep(selectedCategory === 'interior' ? 'project-details' : 'service-type')
        break
      case 'service-type':
        setCurrentStep('project-details')
        break
      case 'project-details':
        setCurrentStep('contact-info')
        break
      case 'contact-info':
        setCurrentStep('summary')
        break
    }
  }

  const goToPreviousStep = () => {
    switch (currentStep) {
      case 'service-type':
        setCurrentStep('service-category')
        break
      case 'project-details':
        setCurrentStep(selectedCategory === 'interior' ? 'service-category' : 'service-type')
        break
      case 'contact-info':
        setCurrentStep('project-details')
        break
      case 'summary':
        setCurrentStep('contact-info')
        break
    }
  }

  // Removed unused goToStep function

  // Handle category selection and auto-advance
  const handleCategorySelect = (category: ServiceCategory) => {
    setSelectedCategory(category)
    if (category === 'interior') {
      setSelectedService('small-room')
      setCurrentStep('project-details')
    } else {
      setSelectedService('')
      setCurrentStep('service-type')
    }
    setRooms([])
  }

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId)
    setCurrentStep('project-details')
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

  // Old renderServiceForm function content removed - replaced by wizard flow

  // All old render form functions removed - replaced by wizard flow

  // Progress indicator
  const renderProgressIndicator = () => {
    const steps = [
      { key: 'service-category', label: 'Service', completed: selectedCategory !== null },
      { key: 'service-type', label: 'Type', completed: selectedService !== '' },
      { key: 'project-details', label: 'Details', completed: selectedCategory === 'interior' ? rooms.length > 0 : projectDetails.description !== '' },
      { key: 'contact-info', label: 'Contact', completed: customerInfo.name !== '' && customerInfo.email !== '' && customerInfo.phone !== '' },
      { key: 'summary', label: 'Review', completed: false }
    ]

    const visibleSteps = selectedCategory === 'interior' 
      ? steps.filter(step => step.key !== 'service-type')
      : steps

    const currentStepIndex = visibleSteps.findIndex(step => step.key === currentStep)

    return (
      <div className="progress-indicator">
        {visibleSteps.map((step, index) => (
          <div key={step.key} className={`progress-step ${index === currentStepIndex ? 'active' : ''} ${step.completed ? 'completed' : ''}`}>
            <div className="step-circle">
              {step.completed ? '✓' : index + 1}
            </div>
            <div className="step-label">{step.label}</div>
            {index < visibleSteps.length - 1 && <div className="step-connector"></div>}
          </div>
        ))}
      </div>
    )
  }

  // Project details step
  const renderProjectDetailsStep = () => {
    if (selectedCategory === 'interior') {
      return (
        <div className="step-content">
          <div className="step-header">
            <h2>Room Details</h2>
            <p>Add the rooms you'd like painted</p>
          </div>

          {/* Quick Room Selection */}
          <div className="room-presets">
            <h3>Quick Room Selection</h3>
            <div className="preset-grid">
              {roomPresets.map(preset => (
                <div 
                  key={preset.id} 
                  className="preset-card"
                  onClick={() => addRoomFromPreset(preset)}
                >
                  <div className="preset-icon">🏠</div>
                  <div className="preset-name">{preset.displayName}</div>
                  <div className="preset-dimensions">
                    {preset.dimensions.length}' × {preset.dimensions.width}' × {preset.dimensions.height}'
                  </div>
                  <div className="preset-estimate">
                    ${calculateRoomCost({
                      id: 'temp',
                      type: preset.name,
                      name: preset.displayName,
                      ...preset.dimensions,
                      addons: {
                        ceilings: false, doors: 0, windows: 0, trims: false,
                        baseboards: false, closets: 0, accentWalls: false,
                        crownMolding: false, stuccoCeiling: false, ensuiteBathroom: false
                      }
                    }).toFixed(0)}
                  </div>
                </div>
              ))}
            </div>
            
            <button type="button" onClick={addCustomRoom} className="btn-add-custom">
              + Add Custom Room
            </button>
          </div>

          {/* Selected Rooms */}
          {rooms.length > 0 && (
            <div className="selected-rooms">
              <h3>Selected Rooms ({rooms.length})</h3>
              <div className="room-list">
                {rooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    onUpdate={updateRoom}
                    onUpdateAddon={updateRoomAddon}
                    onRemove={removeRoom}
                    calculateCost={calculateRoomCost}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )
    } else {
      // Non-interior services
      const category = serviceCategories[selectedCategory!]
      const service = category?.services.find(s => s.id === selectedService)
      
      return (
        <div className="step-content">
          <div className="step-header">
            <h2>Project Details</h2>
            <p>Tell us about your {service?.name.toLowerCase()} project</p>
          </div>

          <div className="project-form">
            <div className="form-group">
              <label htmlFor="description">Project Description</label>
              <textarea
                id="description"
                value={projectDetails.description}
                onChange={(e) => setProjectDetails({...projectDetails, description: e.target.value})}
                placeholder="Please describe your project in detail..."
                rows={4}
                required
              />
            </div>
          </div>
        </div>
      )
    }
  }

  // Contact info step
  const renderContactInfoStep = () => (
    <div className="step-content">
      <div className="step-header">
        <h2>Contact Information</h2>
        <p>How can we reach you with your quote?</p>
      </div>

      <div className="contact-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              value={customerInfo.name}
              onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              value={customerInfo.email}
              onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <input
              type="tel"
              id="phone"
              value={customerInfo.phone}
              onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="address">Project Address</label>
            <input
              type="text"
              id="address"
              value={customerInfo.address}
              onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
              placeholder="Street address"
            />
          </div>

          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              value={customerInfo.city}
              onChange={(e) => setCustomerInfo({...customerInfo, city: e.target.value})}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="preferred-date">Preferred Start Date</label>
          <input
            type="date"
            id="preferred-date"
            value={preferredDate}
            onChange={(e) => setPreferredDate(e.target.value)}
          />
        </div>
      </div>
    </div>
  )

  // Summary step
  const renderSummaryStep = () => {
    const serviceName = selectedCategory === 'interior' 
      ? 'Interior Painting' 
      : serviceCategories[selectedCategory!]?.services.find(s => s.id === selectedService)?.name

    return (
      <div className="step-content">
        <div className="step-header">
          <h2>Quote Summary</h2>
          <p>Please review your quote request</p>
        </div>

        <div className="summary-content">
          <div className="summary-section">
            <h3>Service Details</h3>
            <div className="summary-item">
              <span>Service:</span>
              <span>{serviceName}</span>
            </div>
            {rooms.length > 0 && (
              <div className="summary-item">
                <span>Total Area:</span>
                <span>{rooms.reduce((total, room) => total + (room.length * room.width), 0)} sq ft</span>
              </div>
            )}
            {projectDetails.description && (
              <div className="summary-item">
                <span>Description:</span>
                <span>{projectDetails.description}</span>
              </div>
            )}
            {preferredDate && (
              <div className="summary-item">
                <span>Preferred Start:</span>
                <span>{new Date(preferredDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          <div className="summary-section">
            <h3>Contact Information</h3>
            <div className="summary-item">
              <span>Name:</span>
              <span>{customerInfo.name}</span>
            </div>
            <div className="summary-item">
              <span>Email:</span>
              <span>{customerInfo.email}</span>
            </div>
            <div className="summary-item">
              <span>Phone:</span>
              <span>{customerInfo.phone}</span>
            </div>
            {customerInfo.address && (
              <div className="summary-item">
                <span>Address:</span>
                <span>{customerInfo.address}, {customerInfo.city}</span>
              </div>
            )}
          </div>

          {rooms.length > 0 && (
            <div className="summary-section">
              <h3>Room Summary</h3>
              {rooms.map((room) => (
                <div key={room.id} className="room-summary">
                  <div className="room-summary-header">
                    <span className="room-summary-name">{room.name}</span>
                    <span className="room-summary-cost">${calculateRoomCost(room).toFixed(2)}</span>
                  </div>
                  <div className="room-summary-specs">
                    {room.length}' × {room.width}' × {room.height}'
                  </div>
                </div>
              ))}
              
              <div className="cost-highlight">
                <span>Estimated Total: ${estimatedPrice.toFixed(2)}</span>
              </div>
            </div>
          )}

          <div className="summary-note">
            <p><strong>Note:</strong> This is a preliminary estimate. Final pricing may vary based on site conditions, paint selection, and other factors. We'll provide a detailed quote within 24 hours.</p>
          </div>
        </div>
      </div>
    )
  }

  // Wizard step rendering
  const renderStepContent = () => {
    switch (currentStep) {
      case 'service-category':
        return renderServiceCategorySelection()
      case 'service-type':
        return renderServiceSelection()
      case 'project-details':
        return renderProjectDetailsStep()
      case 'contact-info':
        return renderContactInfoStep()
      case 'summary':
        return renderSummaryStep()
      default:
        return renderServiceCategorySelection()
    }
  }

  return (
    <div className="quote-calculator">
      <div className="quote-hero">
        <div className="container">
          <div className="quote-header">
            <h1>Get Your Free Quote</h1>
            <p>Get a detailed estimate in just a few quick steps</p>
            {estimatedPrice > 0 && currentStep === 'service-category' && (
              <div className="live-estimate">
                <span className="estimate-label">Current Estimate:</span>
                <span className="estimate-amount">${estimatedPrice.toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={`quote-content ${estimatedPrice > 0 && currentStep !== 'service-category' ? 'has-sticky-estimate' : ''}`}>
        <div className="container">
          <div className="quote-wizard">
            {renderProgressIndicator()}
            {renderStepContent()}
            
            {/* Navigation */}
            <div className="wizard-navigation">
              {currentStep !== 'service-category' && (
                <button 
                  type="button" 
                  className="btn-previous" 
                  onClick={goToPreviousStep}
                >
                  Previous
                </button>
              )}
              
              {currentStep !== 'summary' && (
                <button 
                  type="button" 
                  className="btn-next" 
                  onClick={goToNextStep}
                  disabled={
                    (currentStep === 'service-category' && !selectedCategory) ||
                    (currentStep === 'service-type' && !selectedService) ||
                    (currentStep === 'project-details' && selectedCategory === 'interior' && rooms.length === 0) ||
                    (currentStep === 'contact-info' && (!customerInfo.name || !customerInfo.email || !customerInfo.phone))
                  }
                >
                  Next
                </button>
              )}
              
              {currentStep === 'summary' && (
                <button 
                  type="button" 
              className="btn-submit-quote" 
                  onClick={handleSubmitQuote}
            >
                  Submit Quote Request
            </button>
              )}
          </div>
          </div>

          {/* Sticky Estimate Panel - Show on all steps except service-category */}
          {estimatedPrice > 0 && currentStep !== 'service-category' && (
            <div className="sticky-estimate">
              <div className="sticky-estimate-content">
                <div className="estimate-info">
                  <span className="estimate-label">Current Estimate</span>
                  <span className="estimate-amount">${estimatedPrice.toFixed(2)}</span>
                </div>
                <div className="estimate-details">
                  <span className="room-count">{rooms.length} room{rooms.length !== 1 ? 's' : ''}</span>
                  <span className="square-footage">
                    {rooms.reduce((total, room) => total + (room.length * room.width), 0)} sq ft
                  </span>
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
    </div>
  )
}

export default QuoteCalculatorComponent 
