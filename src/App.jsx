import React, { useState } from 'react'
import { Search, Bike, Car, Home, Map, MessageSquare, Plus, User, Heart, MapPin, Calendar, ArrowRight, X, LayoutGrid, ShoppingBag, Key, Briefcase, ChevronRight, Filter, SlidersHorizontal, ArrowLeft, Phone } from 'lucide-react'
import './App.css'

// Custom WhatsApp Icon for Premium Look
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

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
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=800',
    details: { model: 'Model 3', year: '2023', condition: 'Like New', brand: 'Tesla', speed: '0-60 in 3.1s' },
    phone: '+977 9801234567'
  },
  {
    id: 2,
    category: 'bikes',
    title: 'Ducati Panigale V4 S Speciale',
    price: '$28,500',
    location: 'Pokhara',
    time: '5h ago',
    image: 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&q=80&w=800',
    details: { model: 'V4 S', year: '2022', cc: '1103cc', mileage: '15 km/l', condition: 'Brand New' },
    phone: '+977 9812345678'
  },
  {
    id: 3,
    category: 'house',
    title: 'Modern Villa with Private Pool',
    price: '$1,200/mo',
    location: 'Lalitpur',
    time: '1d ago',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
    details: { area: '3500 sq. ft.', bedrooms: '4', bathrooms: '5', parking: 'Yes', floor: '2.5 Storey' },
    phone: '+977 9841234567'
  },
  {
    id: 4,
    category: 'office',
    title: 'Premium Corporate Hub - Floor 12',
    price: '$3,500/mo',
    location: 'Kathmandu',
    time: '3h ago',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
    details: { area: '2500 sq. ft.', partition: '8 Rooms', parking: 'Shared', elevator: 'Yes' },
    phone: '+977 9851234567'
  },
  {
    id: 5,
    category: 'land',
    title: 'Residential Plot - 5 Aana',
    price: '$95,000',
    location: 'Bhaktapur',
    time: '12h ago',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800',
    details: { area: '5 Aana', road: '12 ft', face: 'South', type: 'Residential' },
    phone: '+977 9861234567'
  }
]

function App() {
  const [activeOverlay, setActiveOverlay] = useState(null) // 'category' | 'postAd' | 'form' | 'results' | 'filters' | 'detail'
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [adAction, setAdAction] = useState(null) // 'buy' | 'rent' | 'sell' | 'rentOut'
  const [selectedProduct, setSelectedProduct] = useState(null)

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat)
    setActiveOverlay('category')
  }

  const handlePostAdClick = () => {
    setActiveOverlay('postAd')
  }

  const handleProductClick = (product) => {
    setSelectedProduct(product)
    setActiveOverlay('detail')
  }

  const startForm = (action, cat = null) => {
    setAdAction(action)
    if (cat) setSelectedCategory(cat)
    setActiveOverlay('form')
  }

  const showResults = (action) => {
    setAdAction(action)
    setActiveOverlay('results')
  }

  const toggleFilters = () => {
    setActiveOverlay(activeOverlay === 'filters' ? 'results' : 'filters')
  }

  const closeOverlay = () => {
    setActiveOverlay(null)
    setSelectedCategory(null)
    setAdAction(null)
    setSelectedProduct(null)
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
                  <div className="option-card glass-morphism" onClick={() => showResults('buy')}>
                    <ShoppingBag size={48} className="gradient-text" />
                    <h3>Buy</h3>
                    <p>Browse listings for sale.</p>
                  </div>
                  <div className="option-card glass-morphism" onClick={() => showResults('rent')}>
                    <Key size={48} className="gradient-text" />
                    <h3>Rent</h3>
                    <p>Browse listings for rent.</p>
                  </div>
                </div>
              </div>
            )}

            {activeOverlay === 'results' && (
              <div className="selection-screen">
                <div className="selection-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left', marginBottom: '2rem' }}>
                  <div>
                    <h2 style={{ margin: 0 }}>Showing <span className="gradient-text">{selectedCategory.name}</span></h2>
                    <p style={{ color: 'var(--text-secondary)' }}>{adAction === 'buy' ? 'Available for Purchase' : 'Available for Rent'}</p>
                  </div>
                  <button className="btn glass-morphism" onClick={toggleFilters} style={{ display: 'flex', gap: '0.5rem' }}>
                    <SlidersHorizontal size={20} /> Filter
                  </button>
                </div>

                <div className="product-grid">
                  {featuredListings.filter(item => item.category === selectedCategory.id).length > 0 ? (
                    featuredListings.filter(item => item.category === selectedCategory.id).map(item => (
                      <div key={item.id} className="product-card glass-morphism" onClick={() => handleProductClick(item)}>
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
                    ))
                  ) : (
                    <div style={{ padding: '4rem', gridColumn: '1/-1', color: 'var(--text-secondary)' }}>
                      No specific listings found for this category yet.
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeOverlay === 'filters' && (
              <div className="form-screen glass-morphism">
                <div className="form-header">
                  <button className="btn" onClick={() => setActiveOverlay('results')} style={{ position: 'absolute', left: '1.5rem', top: '1.5rem', color: 'var(--text-secondary)' }}><ArrowLeft size={24} /></button>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center', marginBottom: '1rem' }}>
                    <span className="gradient-text">{selectedCategory.icon}</span>
                    <h2 style={{ margin: 0 }}>Advanced <span className="gradient-text">Filters</span></h2>
                  </div>
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
                  <button className="btn btn-primary btn-block" onClick={() => setActiveOverlay('results')}>Apply Filters</button>
                </div>
              </div>
            )}

            {activeOverlay === 'detail' && selectedProduct && (
              <div className="detail-screen glass-morphism">
                <div className="detail-header" style={{ position: 'relative', marginBottom: '2rem' }}>
                  <button className="btn" onClick={() => setActiveOverlay('results')} style={{ position: 'absolute', left: '0', top: '0', background: 'var(--surface)', borderRadius: '50%', padding: '0.8rem' }}><ArrowLeft size={24} /></button>
                  <div className="detail-image-container">
                    <img src={selectedProduct.image} alt={selectedProduct.title} />
                  </div>
                </div>
                <div className="detail-info">
                  <div className="detail-price gradient-text">{selectedProduct.price}</div>
                  <h2>{selectedProduct.title}</h2>
                  <div className="detail-meta">
                    <span><MapPin size={18} /> {selectedProduct.location}</span>
                    <span><Calendar size={18} /> {selectedProduct.time}</span>
                  </div>

                  <div className="detail-section">
                    <h3>Specifications</h3>
                    <div className="specs-grid">
                      {Object.entries(selectedProduct.details).map(([key, value]) => (
                        <div key={key} className="spec-item">
                          <label style={{ textTransform: 'capitalize' }}>{key}</label>
                          <p>{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="contact-actions">
                    <a href={`tel:${selectedProduct.phone}`} className="btn btn-primary contact-btn">
                      <Phone size={20} /> Call Now
                    </a>
                    <a href={`https://wa.me/${selectedProduct.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="btn whatsapp-btn contact-btn">
                      <WhatsAppIcon /> WhatsApp
                    </a>
                  </div>
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
              <div key={item.id} className="product-card glass-morphism" onClick={() => handleProductClick(item)}>
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
