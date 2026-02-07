import React, { useState } from 'react'
import { Search, Bike, Car, Home, Map, MessageSquare, Plus, User, Heart, MapPin, Calendar, ArrowRight, X, LayoutGrid, ShoppingBag, Key } from 'lucide-react'
import './App.css'

const categories = [
  { id: 'bikes', name: 'Bikes', icon: <Bike />, count: '1.2k' },
  { id: 'cars', name: 'Cars', icon: <Car />, count: '850' },
  { id: 'house', name: 'Houses', icon: <Home />, count: '420' },
  { id: 'land', name: 'Land', icon: <Map />, count: '310' },
]

const featuredListings = [
  {
    id: 1,
    category: 'cars',
    title: 'Tesla Model 3 Performance 2023',
    price: '$45,000',
    location: 'Kathmandu',
    time: '2h ago',
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 2,
    category: 'bikes',
    title: 'Ducati Panigale V4 S Speciale',
    price: '$28,500',
    location: 'Pokhara',
    time: '5h ago',
    image: 'https://images.unsplash.com/photo-1568772585407-43c190b398bb?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 3,
    category: 'house',
    title: 'Modern Villa with Private Pool',
    price: '$1,200/mo',
    location: 'Lalitpur',
    time: '1d ago',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800'
  }
]

function App() {
  const [activeOverlay, setActiveOverlay] = useState(null) // 'category' | 'postAd'
  const [selectedCategory, setSelectedCategory] = useState(null)

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat)
    setActiveOverlay('category')
  }

  const handlePostAdClick = () => {
    setActiveOverlay('postAd')
  }

  const closeOverlay = () => {
    setActiveOverlay(null)
    setSelectedCategory(null)
  }

  return (
    <div className="app">
      {/* Overlay Screens */}
      {activeOverlay && (
        <div className="overlay-container animate-fade-in">
          <button className="close-btn" onClick={closeOverlay}><X size={32} /></button>
          <div className="overlay-content">
            {activeOverlay === 'category' && (
              <div className="selection-screen">
                <div className="selection-header">
                  <div className="icon-badge gradient-text">{selectedCategory.icon}</div>
                  <h2>Explore <span className="gradient-text">{selectedCategory.name}</span></h2>
                  <p>Choose how you want to browse our premium collection.</p>
                </div>
                <div className="options-grid">
                  <div className="option-card glass-morphism">
                    <ShoppingBag size={48} className="gradient-text" />
                    <h3>Buy</h3>
                    <p>Find your next permanent investment.</p>
                    <button className="btn btn-primary">Browse for Sale</button>
                  </div>
                  <div className="option-card glass-morphism">
                    <Key size={48} className="gradient-text" />
                    <h3>Rent</h3>
                    <p>Experience luxury on your own terms.</p>
                    <button className="btn btn-primary">Browse for Rent</button>
                  </div>
                </div>
              </div>
            )}

            {activeOverlay === 'postAd' && (
              <div className="selection-screen">
                <div className="selection-header">
                  <div className="icon-badge gradient-text"><Plus size={32} /></div>
                  <h2>Create <span className="gradient-text">New Ad</span></h2>
                  <p>What would you like to do with your item?</p>
                </div>
                <div className="options-grid">
                  <div className="option-card glass-morphism">
                    <ShoppingBag size={48} className="gradient-text" />
                    <h3>Sell Item</h3>
                    <p>Reach thousands of buyers instantly.</p>
                    <button className="btn btn-primary">Start Selling</button>
                  </div>
                  <div className="option-card glass-morphism">
                    <Key size={48} className="gradient-text" />
                    <h3>Rent Out</h3>
                    <p>Earn passive income from your assets.</p>
                    <button className="btn btn-primary">Start Renting</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <nav className="navbar glass-morphism">
        <div className="nav-logo gradient-text" onClick={() => window.location.reload()} style={{ cursor: 'pointer' }}>CELESTIAL.</div>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <button className="btn" style={{ color: 'var(--text-secondary)' }}><Heart size={20} /></button>
          <button className="btn" style={{ color: 'var(--text-secondary)' }}><MessageSquare size={20} /></button>
          <button className="btn glass-morphism" style={{ borderRadius: '50%', padding: '0.6rem' }}><User size={20} /></button>
          <button className="btn btn-primary" onClick={handlePostAdClick}><Plus size={20} /> Post Ad</button>
        </div>
      </nav>

      <main className={activeOverlay ? 'blur-content' : ''}>
        <section className="hero">
          <div className="hero-bg-glow"></div>
          <div className="container animate-fade-in">
            <h1>Find Everything You <br /><span className="gradient-text">Need in Orbit.</span></h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
              The premium marketplace for selling, renting, and trading. Bikes, Cars, Houses, and Land - all in one place.
            </p>

            <div className="search-container glass-morphism">
              <Search style={{ marginLeft: '1.5rem', color: 'var(--text-secondary)' }} />
              <input type="text" placeholder="Search for bikes, cars, properties..." />
              <button className="btn btn-primary" style={{ borderRadius: '14px' }}>Search</button>
            </div>

            <div className="categories-grid">
              {categories.map((cat) => (
                <div key={cat.id} className="category-card glass-morphism" onClick={() => handleCategoryClick(cat)}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }} className="gradient-text">{cat.icon}</div>
                  <h3>{cat.name}</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>{cat.count} Listings</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="listings-section container">
          <div className="section-header">
            <div>
              <h2 style={{ fontSize: '2rem' }}>Featured <span className="gradient-text">Listings</span></h2>
              <p style={{ color: 'var(--text-secondary)' }}>Handpicked selections just for you</p>
            </div>
            <button className="btn" style={{ color: 'var(--primary)' }}>View All <ArrowRight size={18} /></button>
          </div>

          <div className="product-grid">
            {featuredListings.map(item => (
              <div key={item.id} className="product-card glass-morphism">
                <img src={item.image} alt={item.title} className="product-image" />
                <div className="product-info">
                  <div className="product-price">{item.price}</div>
                  <h3 className="product-title">{item.title}</h3>
                  <div className="product-meta">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} /> {item.location}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={14} /> {item.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="container" style={{ padding: '4rem 0', borderTop: '1px solid var(--glass-border)', marginTop: '4rem', display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
        <div>© 2026 Celestial Marketplace. All rights reserved.</div>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Contact Us</span>
        </div>
      </footer>
    </div>
  )
}

export default App
