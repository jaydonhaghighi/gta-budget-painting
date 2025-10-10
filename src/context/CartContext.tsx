import { createContext, useContext, useEffect, useMemo, useState } from 'react'

export type CartItem = {
  id: string // unique line-item id
  serviceId: string
  serviceName: string
  serviceType: 'calculated' | 'flat-rate' | 'custom-quote'
  formData: any
  estimate: {
    totalCost: number
    laborHours: number
    totalHours: number
    setupCleanupHours: number
    paintGallons: number
    paintCost: number
    laborCost: number
    suppliesCost: number
    otherFees: number // includes travel (hidden)
    subtotal: number
  }
  createdAt: number
}

export type Cart = {
  items: CartItem[]
}

type CartContextValue = {
  cart: Cart
  addItem: (item: Omit<CartItem, 'id' | 'createdAt'>) => void
  removeItem: (id: string) => void
  updateItem: (id: string, updates: Partial<Omit<CartItem, 'id' | 'createdAt'>>) => void
  clear: () => void
  // totals
  totals: {
    itemsSubtotal: number // sum of item estimate.totalCost before discounts
    discount: number // 15% off if subtotal > $1000
    travelFeeMode: 'per-order' | 'per-item'
    travelFeeAdjustment: number // if >10h switch to per-item; else treat as already included in otherFees per-order baseline
    grandTotal: number
  }
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

const STORAGE_KEY = 'gbp_cart_v1'

function generateId(prefix = 'item'): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed && Array.isArray(parsed.items)) {
          return { items: parsed.items }
        }
      }
    } catch {}
    return { items: [] }
  })

  // persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
    } catch {}
  }, [cart])

  const addItem: CartContextValue['addItem'] = (item) => {
    setCart((prev) => ({
      items: [
        ...prev.items,
        {
          ...item,
          id: generateId('line'),
          createdAt: Date.now(),
        },
      ],
    }))
  }

  const removeItem = (id: string) => {
    setCart((prev) => ({ items: prev.items.filter((i) => i.id !== id) }))
  }

  const updateItem: CartContextValue['updateItem'] = (id, updates) => {
    setCart((prev) => ({
      items: prev.items.map((i) => (i.id === id ? { ...i, ...updates } : i)),
    }))
  }

  const clear = () => setCart({ items: [] })

  const totals = useMemo(() => {
    const itemsSubtotal = cart.items.reduce((sum, it) => sum + (it.estimate?.totalCost ?? 0), 0)

    // Determine travel fee handling rule:
    // - Default: once per order (assumed already included within item.otherFees baseline)
    // - If any item totalHours > 10, apply per-item travel: compute adjustment so we effectively count per-item travel
    // We assume each item.otherFees already includes a single travel portion; for per-item mode, we add extra travel for remaining items
    const anyLongJob = cart.items.some((it) => (it.estimate?.totalHours ?? 0) > 10)
    let travelFeeMode: 'per-order' | 'per-item' = 'per-order'
    let travelFeeAdjustment = 0
    if (anyLongJob) {
      travelFeeMode = 'per-item'
      // naive adjustment: add an extra travel share for each additional item beyond the first
      // Estimate otherFees already includes travel once; so add average per-item travel for (n - 1)
      const travelShares = cart.items.map((it) => Math.max(0, (it.estimate?.otherFees ?? 0) * 0.5)) // heuristic 50% of otherFees as travel
      if (travelShares.length > 1) {
        // add all travel shares except one baseline
        const sorted = travelShares.sort((a, b) => b - a)
        travelFeeAdjustment = sorted.slice(0, Math.max(0, sorted.length - 1)).reduce((s, v) => s + v, 0)
      }
    }

    // Discount: 15% off if subtotal > $1000
    const discount = itemsSubtotal > 1000 ? itemsSubtotal * 0.15 : 0

    const grandTotal = Math.max(0, itemsSubtotal + travelFeeAdjustment - discount)

    return { itemsSubtotal, discount, travelFeeMode, travelFeeAdjustment, grandTotal }
  }, [cart.items])

  const value: CartContextValue = { cart, addItem, removeItem, updateItem, clear, totals }
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}


