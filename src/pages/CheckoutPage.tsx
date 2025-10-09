import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const CheckoutPage = () => {
  const { cart, totals } = useCart()
  const navigate = useNavigate()

  return (
    <main className="checkout-page" style={{ padding: '2rem 0' }}>
      <div className="container">
        <h1>Checkout</h1>
        {cart.items.length === 0 ? (
          <p>No items in cart. <a href="/">Go back</a>.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px' }}>
            <form onSubmit={(e) => { e.preventDefault(); /* will submit later */ }}>
              <h3>Preferred Date Range</h3>
              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label>Earliest Start</label>
                  <input type="date" required />
                </div>
                <div className="form-group">
                  <label>Latest Finish</label>
                  <input type="date" required />
                </div>
              </div>

              <h3 style={{ marginTop: 16 }}>Contact Information</h3>
              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label>First Name</label>
                  <input type="text" required />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input type="text" required />
                </div>
              </div>
              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" required />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input type="tel" required />
                </div>
              </div>
              <div className="form-group">
                <label>Address</label>
                <input type="text" required />
              </div>

              <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                <button className="btn-secondary" type="button" onClick={() => navigate('/cart')}>Back to Cart</button>
                <button className="btn-primary" type="submit">Submit Request</button>
              </div>
            </form>
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
            </aside>
          </div>
        )}
      </div>
    </main>
  )
}

export default CheckoutPage


