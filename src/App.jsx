import React, { useState, useEffect, useRef } from 'react'
import { Search, Bike, Car, Home, Map, MessageSquare, Plus, User, Heart, MapPin, Calendar, ArrowRight, X, LayoutGrid, ShoppingBag, Key, Briefcase, ChevronRight, Filter, SlidersHorizontal, ArrowLeft, Phone, ChevronLeft, Send } from 'lucide-react'
import { io } from 'socket.io-client'
import './App.css'

const API_BASE_URL = 'http://localhost:5000/api'

// Icon mapping for categories
const iconMap = {
  Bike: <Bike />,
  Car: <Car />,
  Home: <Home />,
  Briefcase: <Briefcase />,
  Map: <Map />,
  LayoutGrid: <LayoutGrid />
}

// Custom WhatsApp Icon
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)



function App() {
  const [categories, setCategories] = useState([])
  const [listings, setListings] = useState([])
  const [activeOverlay, setActiveOverlay] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [adAction, setAdAction] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [currentImgIndex, setCurrentImgIndex] = useState(0)
  const [chatMessage, setChatMessage] = useState('')
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const socketRef = useRef()

  useEffect(() => {
    fetch(`${API_BASE_URL}/categories`)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error('Error fetching categories:', err))

    fetch(`${API_BASE_URL}/listings`)
      .then(res => res.json())
      .then(data => setListings(data))
      .catch(err => console.error('Error fetching listings:', err))
  }, [])

  useEffect(() => {
    socketRef.current = io('http://localhost:5000')

    socketRef.current.on('receive_message', (message) => {
      setMessages((prev) => [...prev, message])
    })

    return () => {
      socketRef.current.disconnect()
    }
  }, [])

  useEffect(() => {
    if (isChatOpen && selectedProduct) {
      socketRef.current.emit('join_chat', selectedProduct.id)
      // Reset messages when opening a new chat for now (or fetch from API)
      setMessages([])
    }
  }, [isChatOpen, selectedProduct])

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat)
    setActiveOverlay('category')
  }

  const handlePostAdClick = () => {
    setActiveOverlay('postAd')
  }

  const handleProductClick = (product) => {
    setSelectedProduct(product)
    // Find and set the selected category based on product.category slug
    const cat = categories.find(c => c.slug === product.category)
    if (cat) setSelectedCategory(cat)

    setCurrentImgIndex(0)
    setIsChatOpen(false)
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

  const handleSendMessage = () => {
    if (!chatMessage.trim() || !selectedProduct) return

    const data = {
      content: chatMessage,
      senderId: 1, // Default user ID from seeding
      receiverId: selectedProduct.sellerId,
      listingId: selectedProduct.id
    }

    socketRef.current.emit('send_message', data)
    setChatMessage('')
  }

  const nextImg = () => {
    if (selectedProduct && selectedProduct.images.length > 1) {
      setCurrentImgIndex((prev) => (prev + 1) % selectedProduct.images.length)
    }
  }

  const prevImg = () => {
    if (selectedProduct && selectedProduct.images.length > 1) {
      setCurrentImgIndex((prev) => (prev - 1 + selectedProduct.images.length) % selectedProduct.images.length)
    }
  }

  return (
    <div className="app">
      {/* Overlay Screens */}
      {activeOverlay && (
        <div className="overlay-container animate-fade-in">
          <button className="close-btn" onClick={closeOverlay}><X size={32} /></button>

          <div className="overlay-content">
            {activeOverlay === 'category' && selectedCategory && (
              <div className="selection-screen">
                <div className="selection-header">
                  <div className="icon-badge gradient-text">{iconMap[selectedCategory.icon] || <LayoutGrid />}</div>
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

            {activeOverlay === 'results' && selectedCategory && (
              <div className="selection-screen">
                <div className="selection-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left', marginBottom: '2rem' }}>
                  <div>
                    <h2 style={{ margin: 0 }}>Showing <span className="gradient-text">{selectedCategory.name}</span></h2>
                    <p style={{ color: 'var(--text-secondary)' }}>{adAction === 'buy' ? 'Available for Purchase' : 'Available for Rent'}</p>
                  </div>
                  <button className="btn btn-filter-visible" onClick={toggleFilters} style={{ display: 'flex', gap: '0.5rem' }}>
                    <SlidersHorizontal size={20} /> Advanced Filter
                  </button>
                </div>

                <div className="product-grid">
                  {listings.filter(item => item.category === selectedCategory.slug).map(item => (
                    <div key={item.id} className="product-card glass-morphism" onClick={() => handleProductClick(item)}>
                      <div className="image-wrapper">
                        <img src={item.images[0]} alt={item.title} className="product-image" />
                      </div>
                      <div className="product-info">
                        <div className="product-price">{item.price}</div>
                        <h3 className="product-title">{item.title}</h3>
                        <div className="product-meta">
                          <span><MapPin size={14} /> {item.location}</span>
                          <span><Calendar size={14} /> 2h ago</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeOverlay === 'filters' && selectedCategory && (
              <div className="form-screen glass-morphism">
                <div className="form-header">
                  <button className="btn" onClick={() => setActiveOverlay('results')} style={{ position: 'absolute', left: '1.5rem', top: '1.5rem', color: 'var(--text-secondary)' }}><ArrowLeft size={24} /></button>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center', marginBottom: '1rem' }}>
                    <span className="gradient-text">{iconMap[selectedCategory.icon] || <LayoutGrid />}</span>
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

            {activeOverlay === 'detail' && selectedProduct && selectedCategory && (
              <div className="detail-split-layout">
                <div className="detail-left-panel">
                  <div className="detail-gallery-landscape">
                    <button className="back-nav-btn" onClick={() => setActiveOverlay('results')}><ArrowLeft size={24} /></button>
                    <div className="gallery-main">
                      <img src={selectedProduct.images[currentImgIndex]} alt={selectedProduct.title} />
                      {selectedProduct.images.length > 1 && (
                        <>
                          <button className="gallery-nav prev" onClick={prevImg}><ChevronLeft size={24} /></button>
                          <button className="gallery-nav next" onClick={nextImg}><ChevronRight size={24} /></button>
                          <div className="gallery-dots">
                            {selectedProduct.images.map((_, i) => (
                              <div key={i} className={`dot ${i === currentImgIndex ? 'active' : ''}`}></div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="detail-info-content">
                    <div className="detail-main-header">
                      <div className="detail-price-text gradient-text">{selectedProduct.price}</div>
                      <h1 className="detail-title-text">{selectedProduct.title}</h1>
                      <div className="detail-meta-list">
                        <span><MapPin size={18} /> {selectedProduct.location}</span>
                        <span><Calendar size={18} /> 2h ago</span>
                      </div>
                    </div>

                    <div className="detail-section">
                      <h3>Description</h3>
                      <p className="description-text">{selectedProduct.description}</p>
                    </div>

                    <div className="detail-specs-section">
                      <h3>Specifications</h3>
                      <div className="specs-flex-grid">
                        {Object.entries(selectedProduct.details).map(([key, value]) => (
                          <div key={key} className="spec-tile">
                            <label>{key}</label>
                            <p>{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="detail-contact-strip">
                      <a href={`tel:${selectedProduct.phone || '+1234567890'}`} className="contact-action-btn call-primary">
                        <Phone size={20} /> <span>Call Seller</span>
                      </a>
                      <button className="contact-action-btn chat-secondary" onClick={() => setIsChatOpen(true)}>
                        <MessageSquare size={20} /> <span>Chat Now</span>
                      </button>
                      <a href={`https://wa.me/${(selectedProduct.phone || '+1234567890').replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="contact-action-btn whatsapp-green">
                        <WhatsAppIcon /> <span>WhatsApp</span>
                      </a>
                    </div>
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
                        <span className="gradient-text">{iconMap[cat.icon] || <LayoutGrid />}</span>
                        <span>{cat.name}</span>
                        <ChevronRight size={18} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeOverlay === 'form' && selectedCategory && (
              <div className="form-screen glass-morphism">
                <div className="form-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center', marginBottom: '1rem' }}>
                    <span className="gradient-text">{iconMap[selectedCategory.icon] || <LayoutGrid />}</span>
                    <h2 style={{ margin: 0 }}>{adAction === 'sell' ? 'Sell' : 'Rent Out'} <span className="gradient-text">{selectedCategory.name}</span></h2>
                  </div>
                </div>

                <form className="complex-form" onSubmit={(e) => e.preventDefault()}>
                  <div className="input-group">
                    <label>Description</label>
                    <textarea placeholder="Tell us more about it..."></textarea>
                  </div>

                  {(selectedCategory.slug === 'bikes' || selectedCategory.slug === 'cars') && (
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

                  {(selectedCategory.slug === 'house' || selectedCategory.slug === 'office' || selectedCategory.slug === 'land') && (
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

      {/* Chat Popup Modal */}
      {isChatOpen && selectedProduct && (
        <div className="chat-popup-overlay" onClick={() => setIsChatOpen(false)}>
          <div className="chat-popup glass-morphism animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="chat-header">
              <div className="seller-badge">
                <div className="seller-avatar">S</div>
                <div style={{ flex: 1 }}>
                  <div className="seller-name">Seller Online</div>
                  <div className="seller-status">Ready to help</div>
                </div>
                <button className="close-chat-btn" onClick={() => setIsChatOpen(false)}><X size={20} /></button>
              </div>
            </div>
            <div className="chat-messages animate-fade-in">
              {messages.length === 0 ? (
                <div className="chat-welcome">
                  <MessageSquare size={32} />
                  <p>Start a conversation with the seller</p>
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div key={idx} className={`chat-bubble ${msg.senderId === 1 ? 'sent' : 'received'}`}>
                    {msg.content}
                  </div>
                ))
              )}
            </div>
            <div className="chat-input-area glass-morphism">
              <input
                type="text"
                placeholder="Type a message..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button className="btn btn-primary send-btn" onClick={handleSendMessage}>
                <Send size={20} />
              </button>
            </div>
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
                  <div className="cat-icon-container gradient-text">{iconMap[cat.icon] || <LayoutGrid />}</div>
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
            {listings.map(item => (
              <div key={item.id} className="product-card glass-morphism" onClick={() => handleProductClick(item)}>
                <div className="image-wrapper">
                  <img src={item.images[0]} alt={item.title} className="product-image" />
                </div>
                <div className="product-info">
                  <div className="product-price">{item.price}</div>
                  <h3 className="product-title">{item.title}</h3>
                  <div className="product-meta">
                    <span><MapPin size={14} /> {item.location}</span>
                    <span><Calendar size={14} /> 2h ago</span>
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
