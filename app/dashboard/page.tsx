"use client"

import React, { useState } from "react"

// Mock data
const mockBurgers = [
  {
    id: 1,
    name: "The King Burger",
    restaurant: "Burger Palace",
    description: "Smash beef con queso fundido y bacon crujiente",
    rating: 4.8,
    reviews: 245,
    userRating: 5,
    type: "premium",
    position: 1,
    tags: ["Jugosa", "Carne Fresca", "Premium"],
    city: "Madrid",
  },
  {
    id: 2,
    name: "Smoky BBQ",
    restaurant: "Grill House",
    description: "Ternera con salsa BBQ y cebolla caramelizada",
    rating: 4.7,
    reviews: 186,
    userRating: 4,
    type: "premium",
    position: 2,
    tags: ["BBQ", "Ternera", "Salsa"],
    city: "Barcelona",
  },
  {
    id: 3,
    name: "Clásica Tradicional",
    restaurant: "Burger Artisan",
    description: "Simple pero perfecta, carne de calidad con queso",
    rating: 4.5,
    reviews: 312,
    userRating: 0,
    type: "clásica",
    position: 3,
    tags: ["Clásica", "Económica"],
    city: "Valencia",
  },
  {
    id: 4,
    name: "Doble Sabor",
    restaurant: "Fast Burger",
    description: "Dos carnes con doble queso y salsa especial",
    rating: 4.3,
    reviews: 198,
    userRating: 3,
    type: "doble",
    position: 4,
    tags: ["Doble", "Picante"],
    city: "Madrid",
  },
  {
    id: 5,
    name: "Veggie Supreme",
    restaurant: "Green Burger",
    description: "Lentejas y setas con aguacate y rúcula",
    rating: 4.2,
    reviews: 156,
    userRating: 0,
    type: "vegana",
    position: 5,
    tags: ["Vegana", "Sano"],
    city: "Barcelona",
  },
]

export default function BurgeRankDashboard() {
  const [currentPage, setCurrentPage] = useState<string>("ranking")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [rateStep, setRateStep] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [ratings, setRatings] = useState({
    pan: 0,
    carne: 0,
    toppings: 0,
    salsa: 0,
  })
  const [expandedAccordion, setExpandedAccordion] = useState<string | null>(null)

  const showPage = (page: string) => {
    setCurrentPage(page)
    setSidebarOpen(false)
  }

  const setRating = (category: string, value: number) => {
    setRatings((prev) => ({ ...prev, [category]: value }))
  }

  const toggleAccordion = (id: string) => {
    setExpandedAccordion(expandedAccordion === id ? null : id)
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(135deg, #1f2937 0%, #111827 100%)",
        color: "#e5e7eb",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        :root {
          --background: #111827;
          --foreground: #e5e7eb;
          --card: #374151;
          --card-foreground: #e5e7eb;
          --primary: #fbbf24;
          --primary-foreground: #1a1a1a;
          --secondary: #374151;
          --secondary-foreground: #e5e7eb;
          --muted: #4b5563;
          --muted-foreground: #9ca3af;
          --accent: #4b5563;
          --accent-foreground: #e5e7eb;
          --destructive: #ef4444;
          --border: #4b5563;
          --input: #1f2937;
          --orange-500: #fbbf24;
          --amber-600: #b45309;
          --success: #22c55e;
          --success-bg: #166534;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
          color: var(--foreground);
          line-height: 1.6;
          transition: background-color 0.3s, color 0.3s;
          min-height: 100vh;
        }

        .card {
          background-color: rgba(55, 65, 81, 0.5);
          border: 1px solid #4b5563;
          border-radius: 0.625rem;
          padding: 1rem;
          transition: all 0.2s;
        }

        .card:hover {
          border-color: #fbbf24;
          box-shadow: 0 0 15px rgba(251, 191, 36, 0.15);
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 0.5rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          width: 100%;
          min-height: 44px;
        }

        .btn-primary {
          background-color: #fbbf24;
          color: #1a1a1a;
        }

        .btn-primary:hover {
          opacity: 0.9;
        }

        .btn-secondary {
          background-color: rgba(75, 85, 99, 0.5);
          color: #e5e7eb;
          border: 1px solid #4b5563;
        }

        .btn-secondary:hover {
          background-color: rgba(75, 85, 99, 0.7);
          border-color: #fbbf24;
          color: #fbbf24;
        }

        .filter-btn {
          padding: 0.5rem 1rem;
          border: 1px solid #4b5563;
          background-color: transparent;
          border-radius: 0.5rem;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
          color: #e5e7eb;
        }

        .filter-btn.active {
          background-color: #fbbf24;
          color: #1a1a1a;
          border-color: #fbbf24;
        }

        .filter-btn:hover {
          border-color: #fbbf24;
          color: #fbbf24;
        }

        .star-btn {
          background: linear-gradient(135deg, #4b5563 0%, #374151 100%);
          border: 2px solid #fbbf24;
          border-radius: 0.5rem;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0.5rem 0.75rem;
          transition: all 0.2s;
          color: #fbbf24;
          font-weight: bold;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
          min-height: 44px;
        }

        .star-btn:hover {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          color: #1a1a1a;
          transform: scale(1.1);
          box-shadow: 0 6px 12px rgba(251, 191, 36, 0.3);
        }

        .star-btn.active {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          color: #1a1a1a;
          box-shadow: 0 6px 12px rgba(251, 191, 36, 0.3);
        }

        .page {
          display: none;
          animation: fadeIn 0.3s;
        }

        .page.active {
          display: block;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .top-bar {
          position: sticky;
          top: 0;
          z-index: 40;
          background-color: rgba(0, 0, 0, 0.5);
          border-bottom: 2px solid #b45309;
          padding: 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 56px;
        }

        .logo {
          font-weight: bold;
          font-size: 1.2rem;
          color: #fbbf24;
        }

        .menu-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0.5rem;
          color: var(--foreground);
        }

        .sidebar {
          position: fixed;
          left: 0;
          top: 0;
          width: 280px;
          height: 100vh;
          background-color: rgba(55, 65, 81, 0.8);
          border-right: 1px solid #4b5563;
          z-index: 41;
          overflow-y: auto;
          transform: translateX(-100%);
          transition: transform 0.3s;
        }

        .sidebar.active {
          transform: translateX(0);
        }

        .sidebar-overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 39;
        }

        .sidebar-overlay.active {
          display: block;
        }

        .sidebar-menu {
          padding: 1rem 0;
        }

        .sidebar-menu a {
          display: block;
          padding: 1rem 1.5rem;
          color: #e5e7eb;
          text-decoration: none;
          border-left: 3px solid transparent;
          transition: background-color 0.2s, border-color 0.2s;
          cursor: pointer;
        }

        .sidebar-menu a:hover,
        .sidebar-menu a.active {
          background-color: rgba(251, 191, 36, 0.1);
          border-left-color: #fbbf24;
          color: #fbbf24;
        }

        .main {
          flex: 1;
          padding: 0 1rem 65px;
          max-width: 100%;
          overflow-x: hidden;
        }

        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 65px;
          background-color: rgba(55, 65, 81, 0.8);
          border-top: 1px solid #4b5563;
          display: flex;
          justify-content: space-around;
          align-items: center;
          z-index: 40;
        }

        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.4rem;
          text-decoration: none;
          color: #9ca3af;
          cursor: pointer;
          transition: color 0.2s;
          font-size: 0.8rem;
        }

        .nav-item.active {
          color: #fbbf24;
        }

        .burger-card {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
          position: relative;
          align-items: stretch;
        }

        .burger-position {
          position: absolute;
          top: -8px;
          left: -8px;
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 1.2rem;
          color: #1a1a1a;
          box-shadow: 0 2px 8px rgba(251, 191, 36, 0.3);
        }

        .burger-image {
          width: 70px;
          height: 70px;
          border-radius: 0.5rem;
          object-fit: cover;
          background: linear-gradient(135deg, #92400e 0%, #b45309 100%);
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
        }

        .burger-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .burger-name {
          font-weight: 600;
          margin-bottom: 0.25rem;
          font-size: 0.95rem;
        }

        .burger-restaurant {
          font-size: 0.8rem;
          color: #9ca3af;
          margin-bottom: 0.3rem;
        }

        .burger-description {
          font-size: 0.8rem;
          color: #9ca3af;
          margin-bottom: 0.4rem;
          line-height: 1.3;
        }

        .burger-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-bottom: 0.4rem;
        }

        .burger-tag {
          display: inline-block;
          padding: 0.2rem 0.6rem;
          border-radius: 0.25rem;
          font-size: 0.7rem;
          background-color: rgba(251, 191, 36, 0.15);
          color: #fbbf24;
          border: 1px solid rgba(251, 191, 36, 0.3);
        }

        .burger-rating {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          font-size: 0.85rem;
          margin-bottom: 0.3rem;
        }

        .rating-item {
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .stars {
          color: #fbbf24;
        }

        .burger-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .burger-actions {
          display: flex;
          gap: 0.4rem;
        }

        .btn-tiny {
          padding: 0.4rem 0.8rem;
          font-size: 0.75rem;
          border: none;
          background-color: #fbbf24;
          color: #1a1a1a;
          border-radius: 0.375rem;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
          min-height: 44px;
        }

        .btn-tiny:hover {
          background-color: #f59e0b;
          transform: translateY(-1px);
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-label {
          display: block;
          margin-bottom: 0.3rem;
          font-weight: 600;
          font-size: 0.85rem;
        }

        .form-input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #4b5563;
          border-radius: 0.5rem;
          background-color: #1f2937;
          color: #e5e7eb;
          font-size: 1rem;
          font-family: inherit;
        }

        .form-input:focus {
          outline: none;
          border-color: #fbbf24;
          box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.1);
        }

        .text-2xl {
          font-size: 1.5rem;
          font-weight: bold;
        }

        .text-xl {
          font-size: 1.25rem;
          font-weight: 600;
        }

        .text-lg {
          font-size: 1.125rem;
        }

        .text-sm {
          font-size: 0.875rem;
        }

        .text-muted {
          color: #9ca3af;
        }

        .mb-2 { margin-bottom: 0.5rem; }
        .mb-3 { margin-bottom: 0.75rem; }
        .mb-4 { margin-bottom: 1rem; }

        .section-title {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 1.2rem 0 0.75rem 0;
          color: #fbbf24;
          border-bottom: 2px solid rgba(251, 191, 36, 0.3);
          padding-bottom: 0.5rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .stat-card {
          background-color: rgba(55, 65, 81, 0.5);
          border: 1px solid #4b5563;
          border-radius: 0.625rem;
          padding: 1rem;
          text-align: center;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: bold;
          color: #fbbf24;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          font-size: 0.8rem;
          color: #9ca3af;
        }

        .accordion-item {
          border: 1px solid #4b5563;
          border-radius: 0.625rem;
          margin-bottom: 0.75rem;
          overflow: hidden;
        }

        .accordion-header {
          background-color: rgba(55, 65, 81, 0.5);
          padding: 1rem;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          user-select: none;
          transition: all 0.2s;
        }

        .accordion-header:hover {
          background-color: rgba(55, 65, 81, 0.7);
          border-left: 3px solid #fbbf24;
        }

        .accordion-content {
          background-color: rgba(31, 41, 55, 0.5);
          padding: 1rem;
          border-top: 1px solid #4b5563;
          display: none;
          animation: slideDown 0.3s;
        }

        .accordion-content.open {
          display: block;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .wizard-step {
          display: none;
        }

        .wizard-step.active {
          display: block;
          animation: fadeIn 0.3s;
        }

        .wizard-progress {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2rem;
        }

        .progress-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #4b5563;
          transition: all 0.3s;
        }

        .progress-dot.active {
          width: 24px;
          background-color: #fbbf24;
        }

        .progress-dot.completed {
          background-color: #22c55e;
        }

        .rating-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 0.5rem;
          margin-top: 0.75rem;
        }

        @media (max-width: 768px) {
          .main {
            padding: 0 0.5rem 65px;
          }

          .burger-image {
            width: 60px;
            height: 60px;
          }

          .top-bar {
            padding: 0.75rem 0.5rem;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 480px) {
          .star-btn {
            font-size: 1.2rem;
            padding: 0.4rem 0.6rem;
          }

          .form-group {
            margin-bottom: 1rem;
          }

          .btn-tiny {
            padding: 0.6rem 0.8rem;
            font-size: 0.8rem;
          }

          .burger-image {
            width: 100%;
            height: 100px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Top Bar */}
      <div className="top-bar">
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <button
            className="menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          <div className="logo">🍔 BurgeRank</div>
        </div>
        <button
          onClick={() => showPage("about")}
          style={{
            background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
            border: "none",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            color: "#1a1a1a",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "0.9rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 6px rgba(251, 191, 36, 0.3)",
          }}
        >
          ?
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? "active" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />
      <div className={`sidebar ${sidebarOpen ? "active" : ""}`}>
        <div className="sidebar-menu">
          <a
            onClick={() => showPage("ranking")}
            className={currentPage === "ranking" ? "active" : ""}
          >
            🏆 Ranking
          </a>
          <a
            onClick={() => showPage("rate")}
            className={currentPage === "rate" ? "active" : ""}
          >
            ⭐ Valorar
          </a>
          <a
            onClick={() => showPage("profile")}
            className={currentPage === "profile" ? "active" : ""}
          >
            👤 Perfil
          </a>
          <a
            onClick={() => showPage("about")}
            className={currentPage === "about" ? "active" : ""}
          >
            ℹ️ Como nació BurgeRank
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="main">
        {/* RANKING PAGE */}
        <div className={`page ${currentPage === "ranking" ? "active" : ""}`}>
          <h2 className="text-2xl mb-4">🏆 Ranking Nacional de Hamburguesas</h2>

          <div
            style={{
              marginBottom: "1.5rem",
              display: "flex",
              gap: "0.5rem",
              flexWrap: "wrap",
            }}
          >
            <button
              className={`filter-btn ${selectedCategory === "all" ? "active" : ""}`}
              onClick={() => setSelectedCategory("all")}
            >
              Todos
            </button>
            <button
              className={`filter-btn ${selectedCategory === "trending" ? "active" : ""}`}
              onClick={() => setSelectedCategory("trending")}
            >
              🔥 Tendencias
            </button>
            <button
              className={`filter-btn ${selectedCategory === "new" ? "active" : ""}`}
              onClick={() => setSelectedCategory("new")}
            >
              ✨ Nuevas
            </button>
          </div>

          {mockBurgers.map((burger) => (
            <div key={burger.id} className="card burger-card">
              <div className="burger-position">#{burger.position}</div>
              <div className="burger-image">🍔</div>
              <div className="burger-content">
                <div>
                  <div className="burger-name">{burger.name}</div>
                  <div className="burger-restaurant">🏪 {burger.restaurant}</div>
                  <div className="burger-description">{burger.description}</div>
                  <div className="burger-tags">
                    {burger.tags.map((tag) => (
                      <span key={tag} className="burger-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="burger-rating">
                    <div className="rating-item">
                      <span className="stars">★★★★☆</span>
                      <span>
                        {burger.rating} ({burger.reviews})
                      </span>
                    </div>
                    <div className="rating-item">
                      {burger.userRating === 0
                        ? "☆ No valorada"
                        : `★ ${burger.userRating}/5`}
                    </div>
                  </div>
                  <div className="burger-footer">
                    <span style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
                      📍 {burger.city}
                    </span>
                    <div className="burger-actions">
                      <button
                        className="btn-tiny"
                        onClick={() => showPage("restaurant")}
                      >
                        🏪 Restaurante
                      </button>
                      <button
                        className="btn-tiny"
                        onClick={() => {
                          setRateStep(0)
                          showPage("rate")
                        }}
                      >
                        ⭐ Valorar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* RATE PAGE */}
        <div className={`page ${currentPage === "rate" ? "active" : ""}`}>
          <h2 className="text-2xl mb-4">⭐ Valorar una Hamburguesa</h2>

          {/* Wizard */}
          <div style={{ maxWidth: "600px", margin: "0 auto" }}>
            <div className="wizard-progress">
              {[0, 1, 2, 3, 4, 5].map((step) => (
                <div
                  key={step}
                  className={`progress-dot ${step === rateStep ? "active" : ""} ${step < rateStep ? "completed" : ""}`}
                />
              ))}
            </div>

            {/* Step 0: Context */}
            <div className={`wizard-step ${rateStep === 0 ? "active" : ""}`}>
              <h3 className="text-lg mb-3">¿Dónde estás?</h3>
              <div className="form-group">
                <label className="form-label">Contexto de la valoración</label>
                <select className="form-input">
                  <option>Comiendo en el restaurante</option>
                  <option>En casa (delivery)</option>
                  <option>Para llevar</option>
                </select>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => setRateStep(1)}
              >
                Continuar →
              </button>
            </div>

            {/* Step 1: Search */}
            <div className={`wizard-step ${rateStep === 1 ? "active" : ""}`}>
              <h3 className="text-lg mb-3">Busca la hamburguesa</h3>
              <div className="form-group">
                <label className="form-label">Nombre de la hamburguesa</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ej: The King Burger"
                />
              </div>
              <button
                className="btn btn-primary"
                onClick={() => setRateStep(2)}
              >
                Siguiente: Detalles →
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setRateStep(0)}
                style={{ marginTop: "0.5rem" }}
              >
                ← Atrás
              </button>
            </div>

            {/* Step 2: Detailed Rating */}
            <div className={`wizard-step ${rateStep === 2 ? "active" : ""}`}>
              <h3 className="text-lg mb-3">Valora cada aspecto</h3>

              {/* Pan */}
              <div className="form-group">
                <label className="form-label">🍞 Pan</label>
                <div className="rating-grid">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button
                      key={i}
                      className={`star-btn ${ratings.pan === i ? "active" : ""}`}
                      onClick={() => setRating("pan", i)}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Carne */}
              <div className="form-group">
                <label className="form-label">🥩 Carne</label>
                <div className="rating-grid">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button
                      key={i}
                      className={`star-btn ${ratings.carne === i ? "active" : ""}`}
                      onClick={() => setRating("carne", i)}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Toppings */}
              <div className="form-group">
                <label className="form-label">🧅 Toppings</label>
                <div className="rating-grid">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button
                      key={i}
                      className={`star-btn ${ratings.toppings === i ? "active" : ""}`}
                      onClick={() => setRating("toppings", i)}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Salsa */}
              <div className="form-group">
                <label className="form-label">🌶️ Salsa</label>
                <div className="rating-grid">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button
                      key={i}
                      className={`star-btn ${ratings.salsa === i ? "active" : ""}`}
                      onClick={() => setRating("salsa", i)}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <button
                className="btn btn-primary"
                onClick={() => setRateStep(3)}
              >
                Siguiente: Ticket →
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setRateStep(1)}
                style={{ marginTop: "0.5rem" }}
              >
                ← Atrás
              </button>
            </div>

            {/* Step 3: Ticket */}
            <div className={`wizard-step ${rateStep === 3 ? "active" : ""}`}>
              <h3 className="text-lg mb-3">Adjunta el ticket (opcional)</h3>
              <p className="text-sm text-muted mb-3">
                Nos ayuda a verificar que realmente fuiste al restaurante
              </p>
              <div style={{
                border: "2px dashed #4b5563",
                borderRadius: "0.625rem",
                padding: "2rem",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.2s",
              }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📸</div>
                <p className="text-sm">Arrastra una imagen o haz clic para seleccionar</p>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => setRateStep(4)}
                style={{ marginTop: "1rem" }}
              >
                Siguiente: Comentarios →
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setRateStep(2)}
                style={{ marginTop: "0.5rem" }}
              >
                ← Atrás
              </button>
            </div>

            {/* Step 4: Comments */}
            <div className={`wizard-step ${rateStep === 4 ? "active" : ""}`}>
              <h3 className="text-lg mb-3">Cuéntanos más</h3>
              <div className="form-group">
                <label className="form-label">Comentarios (opcional)</label>
                <textarea
                  className="form-input"
                  placeholder="¿Qué te pareció? ¿Algo especial que destacar?"
                  style={{ minHeight: "100px", resize: "vertical" }}
                />
              </div>
              <button
                className="btn btn-primary"
                onClick={() => setRateStep(5)}
              >
                Enviar valoración →
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setRateStep(3)}
                style={{ marginTop: "0.5rem" }}
              >
                ← Atrás
              </button>
            </div>

            {/* Step 5: Success */}
            <div className={`wizard-step ${rateStep === 5 ? "active" : ""}`}>
              <div style={{ textAlign: "center", padding: "2rem" }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
                <h3 className="text-lg mb-2">¡Valoración enviada!</h3>
                <p className="text-muted mb-4">
                  Gracias por contribuir al ranking de BurgeRank
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setRateStep(0)
                    showPage("ranking")
                  }}
                >
                  Volver al ranking
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* PROFILE PAGE */}
        <div className={`page ${currentPage === "profile" ? "active" : ""}`}>
          <h2 className="text-2xl mb-4">👤 Mi Perfil</h2>

          {/* User Info */}
          <div className="card mb-4">
            <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1rem" }}>
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2rem",
                }}
              >
                👤
              </div>
              <div>
                <h3 className="text-xl mb-1">Juan García</h3>
                <p className="text-muted">Crítico de Hamburguesas Nivel 3</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="section-title">Mis Estadísticas</div>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">24</div>
              <div className="stat-label">Valoraciones</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">156</div>
              <div className="stat-label">Seguidores</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">89</div>
              <div className="stat-label">Siguiendo</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">3</div>
              <div className="stat-label">Recompensas</div>
            </div>
          </div>

          {/* Top 3 */}
          <div className="section-title">Mi Top 3 Hamburguesas</div>
          {mockBurgers.slice(0, 3).map((burger) => (
            <div key={burger.id} className="card burger-card" style={{ marginBottom: "0.75rem" }}>
              <div className="burger-image" style={{ width: "60px", height: "60px" }}>🍔</div>
              <div className="burger-content">
                <div className="burger-name">{burger.name}</div>
                <div className="burger-restaurant">{burger.restaurant}</div>
                <div className="stars">★★★★★ Mi valoración: 5/5</div>
              </div>
            </div>
          ))}

          {/* Settings */}
          <div className="section-title">Configuración</div>
          <div className="form-group">
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
              <input type="checkbox" defaultChecked />
              <span>Notificaciones activadas</span>
            </label>
          </div>
          <button className="btn btn-secondary">
            Cambiar contraseña
          </button>
        </div>

        {/* RESTAURANT PAGE */}
        <div className={`page ${currentPage === "restaurant" ? "active" : ""}`}>
          <h2 className="text-2xl mb-4">🏪 Burger Palace</h2>

          <div className="card mb-4">
            <div
              style={{
                width: "100%",
                height: "150px",
                background: "linear-gradient(135deg, #92400e 0%, #b45309 100%)",
                borderRadius: "0.625rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "3rem",
                marginBottom: "1rem",
              }}
            >
              🏪
            </div>
            <p className="text-muted mb-2">📍 Madrid, España</p>
            <p className="text-muted mb-2">⭐ Rating: 4.8/5</p>
            <p className="text-muted">📞 +34 912 345 678</p>
          </div>

          <div className="section-title">Hamburguesas Destacadas</div>
          {mockBurgers.slice(0, 2).map((burger) => (
            <div key={burger.id} className="card burger-card" style={{ marginBottom: "0.75rem" }}>
              <div className="burger-image" style={{ width: "60px", height: "60px" }}>🍔</div>
              <div className="burger-content">
                <div className="burger-name">{burger.name}</div>
                <div className="burger-description">{burger.description}</div>
                <div className="stars">★★★★☆ {burger.rating}</div>
              </div>
            </div>
          ))}

          <button className="btn btn-primary" style={{ marginTop: "1rem" }}>
            Visitar restaurante
          </button>
        </div>

        {/* ABOUT PAGE */}
        <div className={`page ${currentPage === "about" ? "active" : ""}`}>
          <h2 className="text-2xl mb-4">ℹ️ Acerca de BurgeRank</h2>

          <div className="card mb-4">
            <h3 className="text-lg mb-2">¿Cómo funciona el sistema de valoración?</h3>
            <p className="text-muted">
              En BurgeRank valoramos cada aspecto de la hamburguesa por separado:
              el pan, la carne, los toppings y la salsa. Esto nos permite tener un
              análisis detallado de cada hamburguesería.
            </p>
          </div>

          {/* FAQ Accordions */}
          <div className="section-title">Preguntas Frecuentes</div>

          {[
            {
              id: "q1",
              title: "¿Cómo funciona el ranking?",
              answer: "El ranking se actualiza en tiempo real basándose en las valoraciones de nuestra comunidad. Los restaurantes mejor valorados suben en la clasificación.",
            },
            {
              id: "q2",
              title: "¿Cómo gano recompensas?",
              answer: "Puedes ganar recompensas valorando hamburguesas, subiendo fotos, invitando amigos y participando en eventos especiales.",
            },
            {
              id: "q3",
              title: "¿Es gratis BurgeRank?",
              answer: "Sí, BurgeRank es completamente gratuito. Únicamente registrándote puedes empezar a valorar hamburguesas.",
            },
          ].map((faq) => (
            <div key={faq.id} className="accordion-item">
              <div
                className="accordion-header"
                onClick={() => toggleAccordion(faq.id)}
              >
                <span>{faq.title}</span>
                <span>{expandedAccordion === faq.id ? "−" : "+"}</span>
              </div>
              <div
                className={`accordion-content ${expandedAccordion === faq.id ? "open" : ""}`}
              >
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <a
          className={`nav-item ${currentPage === "ranking" ? "active" : ""}`}
          onClick={() => showPage("ranking")}
        >
          <span style={{ fontSize: "1.5rem" }}>🏆</span>
          <span>Ranking</span>
        </a>
        <a
          className={`nav-item ${currentPage === "rate" ? "active" : ""}`}
          onClick={() => showPage("rate")}
        >
          <span style={{ fontSize: "1.5rem" }}>⭐</span>
          <span>Valorar</span>
        </a>
        <a
          className={`nav-item ${currentPage === "profile" ? "active" : ""}`}
          onClick={() => showPage("profile")}
        >
          <span style={{ fontSize: "1.5rem" }}>👤</span>
          <span>Perfil</span>
        </a>
      </div>
    </div>
  )
}
