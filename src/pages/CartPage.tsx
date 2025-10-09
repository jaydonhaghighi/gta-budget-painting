import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const CartPage = () => {
  const { cart, totals, removeItem, clear } = useCart()
  return (
    <main className="cart-page" style={{ padding: '2rem 0' }}>
      <div className="container">
        <h1>Your Cart</h1>
        {cart.items.length === 0 ? (
          <p>Your cart is empty. <Link to="/">Browse services</Link>.</p>
        ) : (
          <div className="cart-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px' }}>
            <div>
              {cart.items.map((it) => (
                <div key={it.id} className="cart-line" style={{ border: '1px solid var(--color-background-dark)', borderRadius: 12, padding: 16, marginBottom: 12, background: 'white' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 800, color: 'var(--color-text-dark)' }}>{it.serviceName}</div>
                      <div style={{ fontSize: '.9rem', color: 'var(--color-text-medium)' }}>{it.serviceType}</div>
                    </div>
                    <div style={{ fontWeight: 800 }}>${it.estimate.totalCost.toFixed(2)}</div>
                  </div>
                  <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                    <button className="btn-secondary" onClick={() => removeItem(it.id)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
            <aside style={{ border: '1px solid var(--color-background-dark)', borderRadius: 12, background: 'white', padding: 16, height: 'fit-content' }}>
              <h3>Order Summary</h3>
              <div className="row" style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                <span>Subtotal</span><span>${totals.itemsSubtotal.toFixed(2)}</span>
              </div>
              {totals.travelFeeAdjustment > 0 && (
                <div className="row" style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                  <span>Travel Adjustment</span><span>+${totals.travelFeeAdjustment.toFixed(2)}</span>
                </div>
              )}
              {totals.discount > 0 && (
                <div className="row" style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, color: '#166534' }}>
                  <span>Discount (15%)</span><span>- ${totals.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="row" style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontWeight: 800 }}>
                <span>Total</span><span>${totals.grandTotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                <button className="btn-secondary" onClick={clear}>Clear Cart</button>
                <Link to="/checkout" className="btn-primary" style={{ textAlign: 'center', flex: 1 }}>Checkout</Link>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  )
}

export default CartPage


