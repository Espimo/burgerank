'use client';

import { useState, useEffect } from 'react';
import './admin.css';

interface Restaurant {
  id: number;
  name: string;
  city: string;
  address: string;
  phone: string;
  hours: string;
  website?: string;
  description?: string;
  rating: number;
  reviews: number;
}

interface Burger {
  id: number;
  name: string;
  restaurantId: number;
  type: string;
  price: number;
  rating: number;
  reviews: number;
  description: string;
  tags: string[];
}

interface User {
  id: number;
  username: string;
  email: string;
  category: string;
  points: number;
  ratings: number;
  registeredDate: string;
}

interface Request {
  id: number;
  username: string;
  type: string;
  details: string;
  date: string;
  status: 'pending' | 'approved';
}

interface Rating {
  id: number;
  username: string;
  burger: string;
  comment: string;
  rating: number;
  date: string;
  status: 'pending' | 'verified';
}

interface Ticket {
  id: number;
  username: string;
  burger: string;
  restaurant: string;
  price: number;
  date: string;
  status: 'pending' | 'verified';
}

interface ActivityLog {
  type: string;
  description: string;
  date: string;
}

interface Data {
  restaurants: Restaurant[];
  burgers: Burger[];
  requests: Request[];
  ratings: Rating[];
  tickets: Ticket[];
  users: User[];
  activityLog: ActivityLog[];
}

const adminCredentials = { username: 'usuario_admin', password: 'admin123' };

export default function AdminPanel() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [data, setData] = useState<Data>({
    restaurants: [],
    burgers: [],
    requests: [],
    ratings: [],
    tickets: [],
    users: [],
    activityLog: []
  });
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [selectedModal, setSelectedModal] = useState<any>(null);
  const [tags, setTags] = useState<string[]>([]);

  // Cargar datos
  useEffect(() => {
    const saved = localStorage.getItem('burgerankAdminData');
    if (saved) {
      setData(JSON.parse(saved));
    } else {
      initializeSampleData();
    }
  }, []);

  // Guardar datos
  const saveData = (newData: Data) => {
    setData(newData);
    localStorage.setItem('burgerankAdminData', JSON.stringify(newData));
  };

  const initializeSampleData = () => {
    const initialData: Data = {
      restaurants: [
        { id: 1, name: 'Burger Palace', city: 'Madrid', address: 'Calle Principal 123', phone: '+34 91 234 5678', hours: '12:00-23:30', website: 'www.burgerpalace.es', rating: 4.8, reviews: 245 },
        { id: 2, name: 'The Smokehouse', city: 'Barcelona', address: 'Paseo de Gracia 456', phone: '+34 93 234 5678', hours: '13:00-22:30', website: 'www.smokehouse.es', rating: 4.7, reviews: 189 }
      ],
      burgers: [
        { id: 1, name: 'The King', restaurantId: 1, type: 'premium', price: 12.99, rating: 9.7, reviews: 52, description: 'Doble carne, queso cheddar, bacon, lechuga y tomate', tags: ['Jugosa', 'Doble Carne', 'Premium'] },
        { id: 2, name: 'Smoky BBQ Delight', restaurantId: 2, type: 'premium', price: 13.99, rating: 9.5, reviews: 45, description: 'Carne ahumada con salsa BBQ premium', tags: ['Ahumada', 'BBQ', 'Specialty'] }
      ],
      users: [
        { id: 1, username: 'usuario_burguer', email: 'usuario@burgerank.es', category: 'Burger Fan', points: 120, ratings: 8, registeredDate: '2025-01-15' },
        { id: 2, username: 'foodlover_madrid', email: 'foodlover@burgerank.es', category: 'Burger Lover', points: 245, ratings: 15, registeredDate: '2025-01-10' }
      ],
      requests: [
        { id: 1, username: 'nuevo_usuario', type: 'Nuevo Restaurante', details: 'Hamburguesa Express en Sevilla', date: '2025-01-20', status: 'pending' }
      ],
      ratings: [
        { id: 1, username: 'usuario_burguer', burger: 'The King', comment: 'Excelente hamburguesa', rating: 5, date: '2025-01-19', status: 'pending' }
      ],
      tickets: [
        { id: 1, username: 'foodlover_madrid', burger: 'The King', restaurant: 'Burger Palace', price: 12.99, date: '2025-01-18', status: 'pending' }
      ],
      activityLog: []
    };
    saveData(initialData);
  };

  const showAlert = (message: string, type: string) => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: '', type: '' }), 3000);
  };

  const addActivityLog = (type: string, description: string) => {
    const now = new Date();
    const date = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
    const newData = { ...data, activityLog: [...data.activityLog, { type, description, date }] };
    saveData(newData);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    if (username === adminCredentials.username && password === adminCredentials.password) {
      setCurrentUser(username);
      addActivityLog('Inicio de sesión', `${username} inició sesión`);
      showAlert('✅ Sesión iniciada', 'success');
    } else {
      showAlert('❌ Usuario o contraseña incorrectos', 'error');
    }
  };

  const handleLogout = () => {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      addActivityLog('Cierre de sesión', `${currentUser} cerró sesión`);
      setCurrentUser(null);
    }
  };

  const handleAddRestaurant = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const newRestaurant: Restaurant = {
      id: data.restaurants.length + 1,
      name: formData.get('restName') as string,
      city: formData.get('restCity') as string,
      address: formData.get('restAddress') as string,
      phone: formData.get('restPhone') as string,
      hours: formData.get('restHours') as string,
      website: formData.get('restWebsite') as string,
      description: formData.get('restDescription') as string,
      rating: 0,
      reviews: 0
    };

    const newData = { ...data, restaurants: [...data.restaurants, newRestaurant] };
    saveData(newData);
    showAlert(`✅ Restaurante "${newRestaurant.name}" creado exitosamente`, 'success');
    (e.target as HTMLFormElement).reset();
    addActivityLog('Crear Restaurante', `Se creó: ${newRestaurant.name}`);
  };

  const handleAddBurger = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const newBurger: Burger = {
      id: data.burgers.length + 1,
      name: formData.get('burgerName') as string,
      restaurantId: parseInt(formData.get('burgerRestaurant') as string),
      type: formData.get('burgerType') as string,
      price: parseFloat(formData.get('burgerPrice') as string),
      description: formData.get('burgerDescription') as string,
      tags: tags,
      rating: 0,
      reviews: 0
    };

    const newData = { ...data, burgers: [...data.burgers, newBurger] };
    saveData(newData);
    showAlert(`✅ Hamburguesa "${newBurger.name}" creada exitosamente`, 'success');
    (e.target as HTMLFormElement).reset();
    setTags([]);
    addActivityLog('Crear Hamburguesa', `Se creó: ${newBurger.name}`);
  };

  const handleDeleteRestaurant = (id: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar este restaurante?')) {
      const rest = data.restaurants.find(r => r.id === id);
      const newData = {
        ...data,
        restaurants: data.restaurants.filter(r => r.id !== id),
        burgers: data.burgers.filter(b => b.restaurantId !== id)
      };
      saveData(newData);
      showAlert(`✅ Restaurante "${rest?.name}" eliminado`, 'success');
      addActivityLog('Eliminar Restaurante', `Se eliminó: ${rest?.name}`);
    }
  };

  const handleDeleteBurger = (id: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta hamburguesa?')) {
      const burger = data.burgers.find(b => b.id === id);
      const newData = {
        ...data,
        burgers: data.burgers.filter(b => b.id !== id)
      };
      saveData(newData);
      showAlert(`✅ Hamburguesa "${burger?.name}" eliminada`, 'success');
      addActivityLog('Eliminar Hamburguesa', `Se eliminó: ${burger?.name}`);
    }
  };

  const handleApproveRequest = (id: number) => {
    const newRequests = data.requests.map(r => r.id === id ? { ...r, status: 'approved' as const } : r);
    const newData = { ...data, requests: newRequests };
    saveData(newData);
    showAlert('✅ Solicitud aprobada', 'success');
    addActivityLog('Aprobar Solicitud', `Se aprobó solicitud`);
  };

  const handleRejectRequest = (id: number) => {
    const req = data.requests.find(r => r.id === id);
    const newData = { ...data, requests: data.requests.filter(r => r.id !== id) };
    saveData(newData);
    showAlert('✅ Solicitud rechazada', 'success');
    addActivityLog('Rechazar Solicitud', `Se rechazó solicitud de ${req?.username}`);
  };

  const handleVerifyRating = (index: number) => {
    const newRatings = [...data.ratings];
    newRatings[index].status = 'verified';
    const newData = { ...data, ratings: newRatings };
    saveData(newData);
    showAlert('✅ Valoración verificada', 'success');
    addActivityLog('Verificar Valoración', `Se verificó valoración`);
  };

  const handleDeleteRating = (index: number) => {
    const rating = data.ratings[index];
    const newRatings = data.ratings.filter((_, i) => i !== index);
    const newData = { ...data, ratings: newRatings };
    saveData(newData);
    showAlert('✅ Valoración rechazada', 'success');
    addActivityLog('Rechazar Valoración', `Se rechazó valoración de ${rating.username}`);
  };

  const handleVerifyTicket = (index: number) => {
    const newTickets = [...data.tickets];
    newTickets[index].status = 'verified';
    const newData = { ...data, tickets: newTickets };
    saveData(newData);
    showAlert('✅ Ticket verificado', 'success');
    addActivityLog('Verificar Ticket', `Se verificó ticket`);
  };

  const handleRejectTicket = (index: number) => {
    const ticket = data.tickets[index];
    const newTickets = data.tickets.filter((_, i) => i !== index);
    const newData = { ...data, tickets: newTickets };
    saveData(newData);
    showAlert('✅ Ticket rechazado', 'success');
    addActivityLog('Rechazar Ticket', `Se rechazó ticket de ${ticket.username}`);
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const input = e.target as HTMLInputElement;
      if (input.value.trim()) {
        setTags([...tags, input.value.trim()]);
        input.value = '';
      }
    }
  };

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  // LOGIN
  if (!currentUser) {
    return (
      <div className="login-container">
        <div className="login-box">
          <h1>🍔 BurgeRank</h1>
          <p>Panel Administrativo</p>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="username">Usuario</label>
              <input type="text" id="username" name="username" placeholder="usuario_admin" required />
            </div>
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input type="password" id="password" name="password" placeholder="••••••••" required />
            </div>
            <button type="submit" className="btn-submit">Iniciar Sesión</button>
            <p style={{ marginTop: '20px', fontSize: '12px', textAlign: 'center', color: '#6b7280' }}>
              Demo: usuario_admin / admin123
            </p>
          </form>
        </div>
      </div>
    );
  }

  // ADMIN PANEL
  return (
    <div className="admin-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <span style={{ fontSize: '24px' }}>🍔</span>
          <h2>BurgeRank Admin</h2>
        </div>
        <ul className="sidebar-menu">
          <li><button className={`menu-btn ${activeSection === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveSection('dashboard')}>📊 Dashboard</button></li>
          <li><button className={`menu-btn ${activeSection === 'restaurants' ? 'active' : ''}`} onClick={() => setActiveSection('restaurants')}>🏪 Restaurantes</button></li>
          <li><button className={`menu-btn ${activeSection === 'burgers' ? 'active' : ''}`} onClick={() => setActiveSection('burgers')}>🍟 Hamburguesas</button></li>
          <li><button className={`menu-btn ${activeSection === 'requests' ? 'active' : ''}`} onClick={() => setActiveSection('requests')}>📋 Solicitudes</button></li>
          <li><button className={`menu-btn ${activeSection === 'ratings' ? 'active' : ''}`} onClick={() => setActiveSection('ratings')}>⭐ Valoraciones</button></li>
          <li><button className={`menu-btn ${activeSection === 'tickets' ? 'active' : ''}`} onClick={() => setActiveSection('tickets')}>🎫 Tickets</button></li>
          <li><button className={`menu-btn ${activeSection === 'users' ? 'active' : ''}`} onClick={() => setActiveSection('users')}>👥 Usuarios</button></li>
        </ul>
      </div>

      <div className="main-content">
        <div className="header-bar">
          <h1>
            {{
              dashboard: '📊 Dashboard',
              restaurants: '🏪 Restaurantes',
              burgers: '🍟 Hamburguesas',
              requests: '📋 Solicitudes',
              ratings: '⭐ Valoraciones',
              tickets: '🎫 Tickets',
              users: '👥 Usuarios'
            }[activeSection]}
          </h1>
          <div className="user-info">
            <span>Bienvenido, {currentUser}</span>
            <button className="logout-btn" onClick={handleLogout}>Cerrar Sesión</button>
          </div>
        </div>

        {alert.message && (
          <div className={`alert alert-${alert.type} active`}>
            {alert.message}
          </div>
        )}

        {/* DASHBOARD */}
        {activeSection === 'dashboard' && (
          <div className="section active">
            <h2>📊 Dashboard General</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Restaurantes</h3>
                <div className="value">{data.restaurants.length}</div>
              </div>
              <div className="stat-card">
                <h3>Total Hamburguesas</h3>
                <div className="value">{data.burgers.length}</div>
              </div>
              <div className="stat-card">
                <h3>Valoraciones Pendientes</h3>
                <div className="value">{data.ratings.filter(r => r.status === 'pending').length}</div>
              </div>
              <div className="stat-card">
                <h3>Tickets Sin Verificar</h3>
                <div className="value">{data.tickets.filter(t => t.status === 'pending').length}</div>
              </div>
              <div className="stat-card">
                <h3>Usuarios Totales</h3>
                <div className="value">{data.users.length}</div>
              </div>
              <div className="stat-card">
                <h3>Solicitudes Pendientes</h3>
                <div className="value">{data.requests.filter(r => r.status === 'pending').length}</div>
              </div>
            </div>

            <div className="table-container">
              <h2 style={{ padding: '20px', color: '#fbbf24' }}>Actividad Reciente</h2>
              <table>
                <thead>
                  <tr>
                    <th>Tipo</th>
                    <th>Descripción</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {data.activityLog.slice(-5).reverse().map((log, idx) => (
                    <tr key={idx}>
                      <td>{log.type}</td>
                      <td>{log.description}</td>
                      <td>{log.date}</td>
                      <td><span className="status-badge status-approved">✓ Completado</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* RESTAURANTES */}
        {activeSection === 'restaurants' && (
          <div className="section active">
            <h2>🏪 Gestión de Restaurantes</h2>
            <div className="form-container">
              <h3 style={{ color: '#fbbf24', marginBottom: '15px' }}>Añadir Nuevo Restaurante</h3>
              <form onSubmit={handleAddRestaurant}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Nombre del Restaurante</label>
                    <input type="text" name="restName" placeholder="Ej: Burger Palace" required />
                  </div>
                  <div className="form-group">
                    <label>Ciudad</label>
                    <select name="restCity" required>
                      <option value="">Selecciona una ciudad</option>
                      <option value="Madrid">Madrid</option>
                      <option value="Barcelona">Barcelona</option>
                      <option value="Valencia">Valencia</option>
                      <option value="Sevilla">Sevilla</option>
                      <option value="Bilbao">Bilbao</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Dirección</label>
                    <input type="text" name="restAddress" placeholder="Calle Principal 123" required />
                  </div>
                  <div className="form-group">
                    <label>Teléfono</label>
                    <input type="tel" name="restPhone" placeholder="+34 91 234 5678" required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Horario</label>
                    <input type="text" name="restHours" placeholder="12:00-23:30" required />
                  </div>
                  <div className="form-group">
                    <label>Sitio Web</label>
                    <input type="url" name="restWebsite" placeholder="www.example.es" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Descripción</label>
                  <textarea name="restDescription" placeholder="Descripción del restaurante..."></textarea>
                </div>
                <button type="submit" className="btn-submit">➕ Crear Restaurante</button>
              </form>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Ciudad</th>
                    <th>Teléfono</th>
                    <th>Rating</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {data.restaurants.length === 0 ? (
                    <tr><td colSpan={5} className="empty-state"><div className="empty-state-icon">📭</div>No hay restaurantes creados</td></tr>
                  ) : (
                    data.restaurants.map(rest => (
                      <tr key={rest.id}>
                        <td><strong>{rest.name}</strong></td>
                        <td>{rest.city}</td>
                        <td>{rest.phone}</td>
                        <td><span className="rating-stars">{'★'.repeat(Math.round(rest.rating))}☆</span> {rest.rating.toFixed(1)}</td>
                        <td>
                          <div className="action-buttons">
                            <button className="btn-small btn-view" onClick={() => setSelectedModal({ type: 'restaurant', data: rest })}>Ver</button>
                            <button className="btn-small btn-delete" onClick={() => handleDeleteRestaurant(rest.id)}>Eliminar</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* HAMBURGUESAS */}
        {activeSection === 'burgers' && (
          <div className="section active">
            <h2>🍟 Gestión de Hamburguesas</h2>
            <div className="form-container">
              <h3 style={{ color: '#fbbf24', marginBottom: '15px' }}>Añadir Nueva Hamburguesa</h3>
              <form onSubmit={handleAddBurger}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Nombre de la Hamburguesa</label>
                    <input type="text" name="burgerName" placeholder="Ej: The King" required />
                  </div>
                  <div className="form-group">
                    <label>Restaurante</label>
                    <select name="burgerRestaurant" required>
                      <option value="">Selecciona un restaurante</option>
                      {data.restaurants.map(rest => (
                        <option key={rest.id} value={rest.id}>{rest.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Tipo</label>
                    <select name="burgerType" required>
                      <option value="premium">Premium</option>
                      <option value="clásica">Clásica</option>
                      <option value="doble">Doble Carne</option>
                      <option value="vegana">Vegana</option>
                      <option value="especial">Especial</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Precio</label>
                    <input type="number" name="burgerPrice" placeholder="12.99" step="0.01" required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Descripción</label>
                  <textarea name="burgerDescription" placeholder="Descripción de la hamburguesa..." required></textarea>
                </div>
                <div className="form-group">
                  <label>Tags (escribe y presiona Enter)</label>
                  <div className="tags-input">
                    {tags.map((tag, idx) => (
                      <div key={idx} className="tag">
                        {tag}
                        <button type="button" onClick={() => handleRemoveTag(idx)}>✕</button>
                      </div>
                    ))}
                    <input type="text" className="tag-input" onKeyPress={handleAddTag} placeholder="Añade tags..." />
                  </div>
                </div>
                <button type="submit" className="btn-submit">➕ Crear Hamburguesa</button>
              </form>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Restaurante</th>
                    <th>Tipo</th>
                    <th>Precio</th>
                    <th>Rating</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {data.burgers.length === 0 ? (
                    <tr><td colSpan={6} className="empty-state"><div className="empty-state-icon">🍟</div>No hay hamburguesas creadas</td></tr>
                  ) : (
                    data.burgers.map(burger => {
                      const rest = data.restaurants.find(r => r.id === burger.restaurantId);
                      return (
                        <tr key={burger.id}>
                          <td><strong>{burger.name}</strong></td>
                          <td>{rest?.name || 'Desconocido'}</td>
                          <td>{burger.type}</td>
                          <td>${burger.price}</td>
                          <td><span className="rating-stars">{'★'.repeat(Math.round(burger.rating))}☆</span> {burger.rating.toFixed(1)}</td>
                          <td>
                            <div className="action-buttons">
                              <button className="btn-small btn-view" onClick={() => setSelectedModal({ type: 'burger', data: burger })}>Ver</button>
                              <button className="btn-small btn-delete" onClick={() => handleDeleteBurger(burger.id)}>Eliminar</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SOLICITUDES */}
        {activeSection === 'requests' && (
          <div className="section active">
            <h2>📋 Solicitudes de Usuarios</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Tipo</th>
                    <th>Detalles</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {data.requests.length === 0 ? (
                    <tr><td colSpan={6} className="empty-state"><div className="empty-state-icon">📭</div>No hay solicitudes pendientes</td></tr>
                  ) : (
                    data.requests.map(req => (
                      <tr key={req.id}>
                        <td>{req.username}</td>
                        <td>{req.type}</td>
                        <td>{req.details}</td>
                        <td>{req.date}</td>
                        <td><span className={`status-badge status-${req.status}`}>{req.status === 'pending' ? 'Pendiente' : 'Aprobado'}</span></td>
                        <td>
                          <div className="action-buttons">
                            {req.status === 'pending' ? (
                              <>
                                <button className="btn-small btn-approve" onClick={() => handleApproveRequest(req.id)}>Aprobar</button>
                                <button className="btn-small btn-reject" onClick={() => handleRejectRequest(req.id)}>Rechazar</button>
                              </>
                            ) : '-'}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VALORACIONES */}
        {activeSection === 'ratings' && (
          <div className="section active">
            <h2>⭐ Revisión de Valoraciones</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Hamburguesa</th>
                    <th>Rating</th>
                    <th>Comentario</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {data.ratings.length === 0 ? (
                    <tr><td colSpan={7} className="empty-state"><div className="empty-state-icon">⭐</div>No hay valoraciones pendientes de revisar</td></tr>
                  ) : (
                    data.ratings.map((rating, idx) => (
                      <tr key={idx}>
                        <td>{rating.username}</td>
                        <td>{rating.burger}</td>
                        <td><span className="rating-stars">{'★'.repeat(rating.rating)}</span></td>
                        <td>{rating.comment}</td>
                        <td>{rating.date}</td>
                        <td><span className={`status-badge status-${rating.status}`}>{rating.status === 'pending' ? 'Pendiente' : 'Verificado'}</span></td>
                        <td>
                          <div className="action-buttons">
                            {rating.status === 'pending' ? (
                              <>
                                <button className="btn-small btn-approve" onClick={() => handleVerifyRating(idx)}>Verificar</button>
                                <button className="btn-small btn-reject" onClick={() => handleDeleteRating(idx)}>Rechazar</button>
                              </>
                            ) : '-'}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TICKETS */}
        {activeSection === 'tickets' && (
          <div className="section active">
            <h2>🎫 Gestión de Tickets</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Hamburguesa</th>
                    <th>Restaurante</th>
                    <th>Precio</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {data.tickets.length === 0 ? (
                    <tr><td colSpan={7} className="empty-state"><div className="empty-state-icon">🎫</div>No hay tickets para verificar</td></tr>
                  ) : (
                    data.tickets.map((ticket, idx) => (
                      <tr key={idx}>
                        <td>{ticket.username}</td>
                        <td>{ticket.burger}</td>
                        <td>{ticket.restaurant}</td>
                        <td>${ticket.price}</td>
                        <td>{ticket.date}</td>
                        <td><span className={`status-badge status-${ticket.status}`}>{ticket.status === 'pending' ? 'Pendiente' : 'Verificado'}</span></td>
                        <td>
                          <div className="action-buttons">
                            {ticket.status === 'pending' ? (
                              <>
                                <button className="btn-small btn-approve" onClick={() => handleVerifyTicket(idx)}>Verificar</button>
                                <button className="btn-small btn-reject" onClick={() => handleRejectTicket(idx)}>Rechazar</button>
                              </>
                            ) : '-'}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* USUARIOS */}
        {activeSection === 'users' && (
          <div className="section active">
            <h2>👥 Gestión de Usuarios</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Email</th>
                    <th>Categoría</th>
                    <th>Puntos</th>
                    <th>Valoraciones</th>
                    <th>Fecha Registro</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {data.users.length === 0 ? (
                    <tr><td colSpan={7} className="empty-state"><div className="empty-state-icon">👥</div>No hay usuarios registrados</td></tr>
                  ) : (
                    data.users.map(user => (
                      <tr key={user.id}>
                        <td><strong>{user.username}</strong></td>
                        <td>{user.email}</td>
                        <td>{user.category}</td>
                        <td>{user.points} pts</td>
                        <td>{user.ratings}</td>
                        <td>{user.registeredDate}</td>
                        <td>
                          <div className="action-buttons">
                            <button className="btn-small btn-view" onClick={() => setSelectedModal({ type: 'user', data: user })}>Ver</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* MODAL */}
      {selectedModal && (
        <div className="modal active">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{selectedModal.type === 'restaurant' ? '🏪 ' : selectedModal.type === 'burger' ? '🍟 ' : '👤 '}{selectedModal.data.name || selectedModal.data.username}</h2>
              <button className="close-modal" onClick={() => setSelectedModal(null)}>×</button>
            </div>
            <div id="modalBody">
              {selectedModal.type === 'restaurant' && (
                <>
                  <p><strong>Ciudad:</strong> {selectedModal.data.city}</p>
                  <p><strong>Dirección:</strong> {selectedModal.data.address}</p>
                  <p><strong>Teléfono:</strong> {selectedModal.data.phone}</p>
                  <p><strong>Horario:</strong> {selectedModal.data.hours}</p>
                  <p><strong>Web:</strong> {selectedModal.data.website}</p>
                  <p><strong>Rating:</strong> {selectedModal.data.rating.toFixed(1)} / 5 ({selectedModal.data.reviews} reseñas)</p>
                  <p><strong>Descripción:</strong> {selectedModal.data.description || 'Sin descripción'}</p>
                </>
              )}
              {selectedModal.type === 'burger' && (
                <>
                  <p><strong>Restaurante:</strong> {data.restaurants.find(r => r.id === selectedModal.data.restaurantId)?.name}</p>
                  <p><strong>Tipo:</strong> {selectedModal.data.type}</p>
                  <p><strong>Precio:</strong> ${selectedModal.data.price}</p>
                  <p><strong>Rating:</strong> {selectedModal.data.rating.toFixed(1)} / 10 ({selectedModal.data.reviews} valoraciones)</p>
                  <p><strong>Descripción:</strong> {selectedModal.data.description}</p>
                  <p><strong>Tags:</strong> {selectedModal.data.tags.join(', ') || 'Sin tags'}</p>
                </>
              )}
              {selectedModal.type === 'user' && (
                <>
                  <p><strong>Email:</strong> {selectedModal.data.email}</p>
                  <p><strong>Categoría:</strong> {selectedModal.data.category}</p>
                  <p><strong>Puntos:</strong> {selectedModal.data.points}</p>
                  <p><strong>Valoraciones:</strong> {selectedModal.data.ratings}</p>
                  <p><strong>Fecha Registro:</strong> {selectedModal.data.registeredDate}</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
