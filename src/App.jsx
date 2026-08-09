import { Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import DiscordBanner from './components/DiscordBanner.jsx'
import Home from './pages/Home.jsx'
import Shop from './pages/Shop.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import About from './pages/About.jsx'
import OrderTracking from './pages/OrderTracking.jsx'
import Terms from './pages/Terms.jsx'
import Privacy from './pages/Privacy.jsx'
import RefundPolicy from './pages/RefundPolicy.jsx'

export default function App() {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/about" element={<About />} />
            <Route path="/order/:orderId" element={<OrderTracking />} />
            <Route path="/track" element={<OrderTracking />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
          </Routes>
        </main>
        <Footer />
        <DiscordBanner />
      </div>
    </CartProvider>
  )
}
