import React, { useState } from 'react'
import { Search, Bike, Car, Home, Map, MessageSquare, Plus, User, Heart, MapPin, Calendar, ArrowRight, X, LayoutGrid, ShoppingBag, Key, Briefcase, ChevronRight, Filter, SlidersHorizontal } from 'lucide-react'
import './App.css'

const categories = [
  { id: 'bikes', name: 'Bikes', icon: <Bike />, count: '1.2k' },
  { id: 'cars', name: 'Cars', icon: <Car />, count: '850' },
  { id: 'house', name: 'Houses', icon: <Home />, count: '420' },
  { id: 'office', name: 'Office Space', icon: <Briefcase />, count: '150' },
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
  }
]

function App() {
  const [activeOverlay, setActiveOverlay] = useState(null) // 'category' | 'postAd' | 'form' | 'filters'
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [adAction, setAdAction] = useState(null) // 'buy' | 'rent' | 'sell' | 'rentOut'

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat)
    setActiveOverlay('category')
  }

  const handlePostAdClick = () => {
    setActiveOverlay('postAd')
  }

  const startForm = (action, cat = null) => {
    setAdAction(action)
    if (cat) setSelectedCategory(cat)
    setActiveOverlay('form')
  }

  const openFilters = (action) => {
    setAdAction(action)
    setActiveOverlay('filters')
  }

  const closeOverlay = () => {
    setActiveOverlay(null)
    setSelectedCategory(null)
    setAdAction(null)
  }

  return (
    <div className="app">
      {/* Overlay Screens */}
      {activeOverlay && (
        <div className="overlay-container animate-fade-in">
          <button className="close-btn" onClick={closeOverlay}><X size={32} /></button>

          <div className="overlay-content scrollable-overlay">
            {activeOverlay === 'category' && (
              <div className="selection-screen">
                <div className="selection-header">
                  <div className="icon-badge gradient-text">{selectedCategory.icon}</div>
                  <h2>Search in <span className="gradient-text">{selectedCategory.name}</span></h2>
                </div>
                <div className="options-grid">
                  <div className="option-card glass-morphism" onClick={() => openFilters('buy')}>
                    <ShoppingBag size={48} className="gradient-text" />
                    <h3>Buy</h3>
                    <p>Browse listings for sale.</p>
                  </div>
                  <div className="option-card glass-morphism" onClick={() => openFilters('rent')}>
                    <Key size={48} className="gradient-text" />
                    <h3>Rent</h3>
                    <p>Browse listings for rent.</p>
                  </div>
                </div>
              </div>
            )}

            {activeOverlay === 'filters' && (
              <div className="form-screen glass-morphism">
                <div className="form-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center', marginBottom: '1rem' }}>
                    <span className="gradient-text">{selectedCategory.icon}</span>
                    <h2 style={{ margin: 0 }}>Filter <span className="gradient-text">{selectedCategory.name}</span></h2>
                  </div>
                  <p style={{ color: 'var(--text-secondary)' }}>Showing results for {adAction === 'buy' ? 'Sale' : 'Rent'}</p>
                </div>

                <div className="complex-form">
                  <div className="form-grid">
                    <div className="input-field">
                      <label>Min Price</label>
                      <input type="text" placeholder="0" />
                    </div>
                    <div className="input-field">
                      <label>Max Price</label>
                      <input type="text" placeholder="Any" />
                    </div>
                  </div>

                  {(selectedCategory.id === 'bikes' || selectedCategory.id === 'cars') && (
                    <div className="form-grid">
                      <div className="input-field">
                        <label>Year / Model</label>
                        <input type="text" placeholder="e.g. 2023" />
                      </div>
                      <div className="input-field">
                        <label>Brand</label>
                        <input type="text" placeholder="e.g. Tesla" />
                      </div>
                      <div className="input-field">
                        <label>Condition</label>
                        <select className="glass-morphism">
                          <option>All Conditions</option>
                          <option>New</option>
                          <option>Used</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {(selectedCategory.id === 'house' || selectedCategory.id === 'office' || selectedCategory.id === 'land') && (
                    <div className="form-grid">
                      <div className="input-field">
                        <label>Location</label>
                        <input type="text" placeholder="Search city..." />
                      </div>
                      <div className="input-field">
                        <label>Area (sq. ft)</label>
                        <input type="text" placeholder="Min area" />
                      </div>
                    </div>
                  )}

                  {(selectedCategory.id === 'house' || selectedCategory.id === 'office') && (
                    <div className="form-grid">
                      <div className="input-field">
                        <label>Bedrooms</label>
                        <select className="glass-morphism">
                          <option>Any</option>
                          <option>1+</option>
                          <option>2+</option>
                          <option>3+</option>
                        </select>
                      </div>
                      <div className="input-field">
                        <label>Parking</label>
                        <select className="glass-morphism">
                          <option>Any</option>
                          <option>Needed</option>
                        </select>
                      </div>
                    </div>
                  )}

                  <button className="btn btn-primary btn-block" onClick={closeOverlay}>Apply Filters</button>
                </div>
              </div>
            )}

            {activeOverlay === 'postAd' && (
              <div className="selection-screen">
                <div className="selection-header">
                  <div className="icon-badge gradient-text"><Plus size={32} /></div>
                  <h2>Post <span className="gradient-text">New Ad</span></h2>
                </div>
                {!adAction ? (
                  <div className="options-grid">
                    <div className="option-card glass-morphism" onClick={() => setAdAction('sell')}>
                      <ShoppingBag size={48} className="gradient-text" />
                      <h3>Sell</h3>
                      <p>List your item for sale.</p>
                    </div>
                    <div className="option-card glass-morphism" onClick={() => setAdAction('rentOut')}>
                      <Key size={48} className="gradient-text" />
                      <h3>Rent Out</h3>
                      <p>List your item for rent.</p>
                    </div>
                  </div>
                ) : (
                  <div className="category-selection-grid">
                    <h3>Select Category</h3>
                    {categories.map(cat => (
                      <div key={cat.id} className="cat-item glass-morphism" onClick={() => startForm(adAction, cat)}>
                        <span className="gradient-text">{cat.icon}</span>
                        <span>{cat.name}</span>
                        <ChevronRight size={18} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeOverlay === 'form' && (
              <div className="form-screen glass-morphism">
                <div className="form-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center', marginBottom: '1rem' }}>
                    <span className="gradient-text">{selectedCategory.icon}</span>
                    <h2 style={{ margin: 0 }}>{adAction === 'sell' ? 'Sell' : 'Rent Out'} <span className="gradient-text">{selectedCategory.name}</span></h2>
                  </div>
                </div>

                <form className="complex-form" onSubmit={(e) => e.preventDefault()}>
                  <div className="input-group">
                    <label>Description</label>
                    <textarea placeholder="Tell us more about it..."></textarea>
                  </div>

                  {(selectedCategory.id === 'bikes' || selectedCategory.id === 'cars') && (
                    <div className="form-grid">
                      <div className="input-field">
                        <label>Year / Model</label>
                        <input type="text" placeholder="e.g. 2023" />
                      </div>
                      <div className="input-field">
                        <label>CC</label>
                        <input type="text" placeholder="e.g. 1500" />
                      </div>
                      <div className="input-field">
                        <label>Mileage</label>
                        <input type="text" placeholder="e.g. 15 km/l" />
                      </div>
                      <div className="input-field">
                        <label>Condition</label>
                        <select className="glass-morphism">
                          <option>Brand New</option>
                          <option>Like New</option>
                          <option>Used - Good</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {(selectedCategory.id === 'house' || selectedCategory.id === 'office' || selectedCategory.id === 'land') && (
                    <div className="form-grid">
                      <div className="input-field">
                        <label>Location</label>
                        <input type="text" placeholder="e.g. Kathmandu" />
                      </div>
                      <div className="input-field">
                        <label>Build up area</label>
                        <input type="text" placeholder="e.g. 1200 sq. ft." />
                      </div>
                    </div>
                  )}

                  {(selectedCategory.id === 'house' || selectedCategory.id === 'office') && (
                    <div className="form-grid">
                      <div className="input-field">
                        <label>No. of Bedrooms</label>
                        <input type="number" placeholder="0" />
                      </div>
                      <div className="input-field">
                        <label>No. of Bathrooms</label>
                        <input type="number" placeholder="0" />
                      </div>
                      <div className="input-field">
                        <label>Parking Space</label>
                        <select className="glass-morphism">
                          <option>No</option>
                          <option>Yes</option>
                        </select>
                      </div>
                    </div>
                  )}

                  <div className="input-group">
                    <label>Price ($)</label>
                    <input type="text" placeholder="Enter amount" className="price-input" />
                  </div>

                  <button className="btn btn-primary btn-block" onClick={closeOverlay}>Submit Listing</button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      <nav className="navbar glass-morphism">
        <div className="nav-logo gradient-text" onClick={() => window.location.reload()} style={{ cursor: 'pointer' }}>CELESTIAL.</div>
        <div className="nav-actions">
          <button className="btn nav-icon-btn"><Heart size={20} /></button>
          <button className="btn nav-icon-btn"><MessageSquare size={20} /></button>
          <button className="btn glass-morphism profile-btn"><User size={20} /></button>
          <button className="btn btn-primary post-ad-btn" onClick={handlePostAdClick}><Plus size={20} /> <span className="btn-text">Post Ad</span></button>
        </div>
      </nav>

      <main className={activeOverlay ? 'blur-content' : ''}>
        <section className="hero">
          <div className="hero-bg-glow"></div>
          <div className="container animate-fade-in">
            <h1>Find Everything You <br /><span className="gradient-text">Need in Orbit.</span></h1>
            <p className="hero-desc">
              The premium marketplace for selling, renting, and trading. All categories in one place.
            </p>

            <div className="search-container glass-morphism">
              <Search className="search-icon" />
              <input type="text" placeholder="Search..." />
              <button className="btn btn-primary search-btn">Search</button>
            </div>

            <div className="categories-grid">
              {categories.map((cat) => (
                <div key={cat.id} className="category-card glass-morphism" onClick={() => handleCategoryClick(cat)}>
                  <div className="cat-icon-container gradient-text">{cat.icon}</div>
                  <h3>{cat.name}</h3>
                  <p className="listing-count">{cat.count} Listings</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="listings-section container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Featured <span className="gradient-text">Listings</span></h2>
              <p className="section-subtitle">Handpicked selections just for you</p>
            </div>
            <button className="btn view-all-btn">View All <ArrowRight size={18} /></button>
          </div>

          <div className="product-grid">
            {featuredListings.map(item => (
              <div key={item.id} className="product-card glass-morphism">
                <div className="image-wrapper">
                  <img src={item.image} alt={item.title} className="product-image" />
                </div>
                <div className="product-info">
                  <div className="product-price">{item.price}</div>
                  <h3 className="product-title">{item.title}</h3>
                  <div className="product-meta">
                    <span><MapPin size={14} /> {item.location}</span>
                    <span><Calendar size={14} /> {item.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer glass-morphism">
        <div className="container footer-content">
          <div className="footer-copyright">© 2026 Celestial Marketplace.</div>
          <div className="footer-links">
            <span>Privacy Policy</span>
            <span>Terms</span>
            <span>Contact</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
