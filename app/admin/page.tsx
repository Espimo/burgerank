'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdmin } from '../contexts/AdminContext';
import { useAuth } from '../contexts/AuthContext';
import { createAdminClient } from '@/lib/supabase/client';
import { ImageUploader } from '../components/ImageUploader';

// Mobile menu hook
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);
  
  return matches;
};

// Types
interface Restaurant {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  hours: string | null;
  website: string | null;
  delivery_url: string | null;
  reservation_url: string | null;
  banner_url: string | null;
  logo_url: string | null;
  status: string;
  submitted_by: string | null;
  average_rating: number;
  total_ratings: number;
  city_id: string;
  city?: { name: string };
}

interface Burger {
  id: string;
  name: string;
  description: string | null;
  restaurant_id: string;
  city_id: string;
  image_url: string | null;
  is_featured: boolean;
  featured_order: number | null;
  status: string;
  submitted_by: string | null;
  average_rating: number;
  total_ratings: number;
  position: number | null;
  type: string | null;
  tags: string[] | null;
  restaurant?: { name: string };
  city?: { name: string };
}

interface User {
  id: string;
  username: string;
  email: string;
  points: number;
  category: string;
  is_admin: boolean;
  created_at: string;
}

interface Promotion {
  id: string;
  restaurant_id: string;
  title: string;
  description: string | null;
  discount_percentage: number | null;
  valid_from: string | null;
  valid_until: string | null;
  is_active: boolean;
  emoji: string | null;
  restaurant?: { name: string };
}

interface City {
  id: string;
  name: string;
  country: string | null;
}

interface Rating {
  id: string;
  overall_rating: number;
  comment: string | null;
  created_at: string;
  user?: { username: string };
  burger?: { name: string; restaurant?: { name: string } };
}

interface PendingItem {
  item_type: string;
  item_id: string;
  item_name: string;
  submitted_by: string | null;
  submitter_name: string | null;
  created_at: string;
}

type ActiveSection = 'dashboard' | 'burgers' | 'restaurants' | 'users' | 'promotions' | 'ratings' | 'featured' | 'pending' | 'import';

export default function AdminPanel() {
  const router = useRouter();
  const { isAdmin, adminLoading } = useAdmin();
  const { authUser, loading: authLoading, userProfile } = useAuth();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const [activeSection, setActiveSection] = useState<ActiveSection>('dashboard');
  const [loading, setLoading] = useState(true);
  
  // Data states
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [burgers, setBurgers] = useState<Burger[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [pendingItems, setPendingItems] = useState<PendingItem[]>([]);
  
  // Stats
  const [stats, setStats] = useState({
    totalBurgers: 0,
    totalRestaurants: 0,
    totalUsers: 0,
    totalRatings: 0,
    activePromotions: 0,
    pendingApprovals: 0,
    featuredBurgers: 0
  });

  // Modal states
  const [editingItem, setEditingItem] = useState<any>(null);
  const [modalType, setModalType] = useState<'burger' | 'restaurant' | 'promotion' | 'user' | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Check authentication and admin status
  useEffect(() => {
    console.log('[AdminPanel] Auth state:', { authLoading, adminLoading, authUser: !!authUser, isAdmin });
    
    if (!authLoading && !adminLoading) {
      if (!authUser) {
        console.log('[AdminPanel] No authUser, redirecting to signin');
        router.push('/auth/signin');
        return;
      }
      if (!isAdmin) {
        console.log('[AdminPanel] User is not admin, redirecting to home');
        router.push('/');
        return;
      }
      console.log('[AdminPanel] User is admin, loading data');
      loadAllData();
    }
  }, [authUser, isAdmin, authLoading, adminLoading, router]);

  const loadAllData = async () => {
    setLoading(true);
    const supabase = createAdminClient();

    try {
      // Load cities
      const { data: citiesData } = await supabase
        .from('cities')
        .select('*')
        .order('name');
      if (citiesData) setCities(citiesData);

      // Load restaurants with city
      const { data: restaurantsData } = await supabase
        .from('restaurants')
        .select('*, city:cities(name)')
        .order('name');
      if (restaurantsData) setRestaurants(restaurantsData as any);

      // Load burgers with restaurant and city
      const { data: burgersData } = await supabase
        .from('burgers')
        .select('*, restaurant:restaurants(name), city:cities(name)')
        .order('position', { ascending: true, nullsFirst: false });
      if (burgersData) setBurgers(burgersData as any);

      // Load users
      const { data: usersData } = await supabase
        .from('users')
        .select('id, username, email, points, category, is_admin, created_at')
        .order('created_at', { ascending: false });
      if (usersData) setUsers(usersData as any);

      // Load promotions with restaurant
      const { data: promotionsData } = await supabase
        .from('restaurant_promotions')
        .select('*, restaurant:restaurants(name)')
        .order('created_at', { ascending: false });
      if (promotionsData) setPromotions(promotionsData as any);

      // Load recent ratings
      const { data: ratingsData } = await supabase
        .from('ratings')
        .select('*, user:users(username), burger:burgers(name, restaurant:restaurants(name))')
        .order('created_at', { ascending: false })
        .limit(50);
      if (ratingsData) setRatings(ratingsData as any);

      // Load pending items (burgers and restaurants awaiting approval)
      const pendingBurgers = await supabase
        .from('burgers')
        .select('id, name, created_at, submitted_by, users:submitted_by(username)')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      const pendingRestaurants = await supabase
        .from('restaurants')
        .select('id, name, created_at, submitted_by, users:submitted_by(username)')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      const pending: PendingItem[] = [
        ...(pendingBurgers.data || []).map((b: any) => ({
          item_type: 'burger',
          item_id: b.id,
          item_name: b.name,
          submitted_by: b.submitted_by,
          submitter_name: b.users?.username || 'Desconocido',
          created_at: b.created_at
        })),
        ...(pendingRestaurants.data || []).map((r: any) => ({
          item_type: 'restaurant',
          item_id: r.id,
          item_name: r.name,
          submitted_by: r.submitted_by,
          submitter_name: r.users?.username || 'Desconocido',
          created_at: r.created_at
        }))
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setPendingItems(pending);

      // Calculate stats
      const featuredCount = (burgersData || []).filter((b: any) => b.is_featured).length;
      
      setStats({
        totalBurgers: burgersData?.length || 0,
        totalRestaurants: restaurantsData?.length || 0,
        totalUsers: usersData?.length || 0,
        totalRatings: ratingsData?.length || 0,
        activePromotions: (promotionsData as any[] || []).filter((p: any) => p.is_active).length,
        pendingApprovals: pending.length,
        featuredBurgers: featuredCount
      });
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // CRUD Operations
  const handleSaveBurger = async (burger: Partial<Burger>) => {
    const supabase = createAdminClient();
    
    if (burger.id) {
      const { error } = await supabase
        .from('burgers')
        .update({
          name: burger.name,
          description: burger.description,
          restaurant_id: burger.restaurant_id,
          city_id: burger.city_id,
          type: burger.type,
          tags: burger.tags,
          position: burger.position,
          image_url: burger.image_url,
          is_featured: burger.is_featured || false,
          featured_order: burger.featured_order,
          status: burger.status || 'approved'
        })
        .eq('id', burger.id);
      
      if (error) {
        alert('Error actualizando hamburguesa: ' + error.message);
        return;
      }
    } else {
      const { error } = await supabase
        .from('burgers')
        .insert({
          name: burger.name,
          description: burger.description,
          restaurant_id: burger.restaurant_id,
          city_id: burger.city_id,
          type: burger.type,
          tags: burger.tags,
          position: burger.position,
          image_url: burger.image_url,
          is_featured: burger.is_featured || false,
          featured_order: burger.featured_order,
          status: 'approved'
        });
      
      if (error) {
        alert('Error creando hamburguesa: ' + error.message);
        return;
      }
    }
    
    setShowModal(false);
    setEditingItem(null);
    loadAllData();
  };

  const handleSaveRestaurant = async (restaurant: Partial<Restaurant>) => {
    const supabase = createAdminClient();
    
    if (restaurant.id) {
      const { error } = await supabase
        .from('restaurants')
        .update({
          name: restaurant.name,
          address: restaurant.address,
          phone: restaurant.phone,
          hours: restaurant.hours,
          website: restaurant.website,
          delivery_url: restaurant.delivery_url,
          reservation_url: restaurant.reservation_url,
          city_id: restaurant.city_id,
          banner_url: restaurant.banner_url,
          logo_url: restaurant.logo_url,
          status: restaurant.status || 'approved'
        })
        .eq('id', restaurant.id);
      
      if (error) {
        alert('Error actualizando restaurante: ' + error.message);
        return;
      }
    } else {
      const { error } = await supabase
        .from('restaurants')
        .insert({
          name: restaurant.name,
          address: restaurant.address,
          phone: restaurant.phone,
          hours: restaurant.hours,
          website: restaurant.website,
          delivery_url: restaurant.delivery_url,
          reservation_url: restaurant.reservation_url,
          city_id: restaurant.city_id,
          banner_url: restaurant.banner_url,
          logo_url: restaurant.logo_url,
          status: 'approved'
        });
      
      if (error) {
        alert('Error creando restaurante: ' + error.message);
        return;
      }
    }
    
    setShowModal(false);
    setEditingItem(null);
    loadAllData();
  };

  const handleSavePromotion = async (promotion: Partial<Promotion>) => {
    const supabase = createAdminClient();
    
    if (promotion.id) {
      const { error } = await supabase
        .from('restaurant_promotions')
        .update({
          title: promotion.title,
          description: promotion.description,
          discount_percentage: promotion.discount_percentage,
          valid_from: promotion.valid_from,
          valid_until: promotion.valid_until,
          is_active: promotion.is_active,
          emoji: promotion.emoji,
          restaurant_id: promotion.restaurant_id
        })
        .eq('id', promotion.id);
      
      if (error) {
        alert('Error actualizando promoción: ' + error.message);
        return;
      }
    } else {
      const { error } = await supabase
        .from('restaurant_promotions')
        .insert({
          title: promotion.title,
          description: promotion.description,
          discount_percentage: promotion.discount_percentage,
          valid_from: promotion.valid_from,
          valid_until: promotion.valid_until,
          is_active: promotion.is_active ?? true,
          emoji: promotion.emoji,
          restaurant_id: promotion.restaurant_id
        });
      
      if (error) {
        alert('Error creando promoción: ' + error.message);
        return;
      }
    }
    
    setShowModal(false);
    setEditingItem(null);
    loadAllData();
  };

  const handleToggleAdmin = async (userId: string, currentStatus: boolean) => {
    if (userId === authUser?.id) {
      alert('No puedes modificar tu propio rol de administrador');
      return;
    }
    
    const supabase = createAdminClient();
    const { error } = await supabase
      .from('users')
      .update({ is_admin: !currentStatus })
      .eq('id', userId);
    
    if (error) {
      alert('Error actualizando usuario: ' + error.message);
      return;
    }
    
    loadAllData();
  };

  const handleDelete = async (type: 'burger' | 'restaurant' | 'promotion' | 'rating', id: string) => {
    if (!confirm('¿Estás seguro de eliminar este elemento?')) return;
    
    const supabase = createAdminClient();
    let tableName = '';
    
    switch (type) {
      case 'burger': tableName = 'burgers'; break;
      case 'restaurant': tableName = 'restaurants'; break;
      case 'promotion': tableName = 'restaurant_promotions'; break;
      case 'rating': tableName = 'ratings'; break;
    }
    
    const { error } = await supabase.from(tableName).delete().eq('id', id);
    
    if (error) {
      alert('Error eliminando: ' + error.message);
      return;
    }
    
    loadAllData();
  };

  // Approval functions - Using API to give bonus points and notifications
  const handleApprove = async (type: 'burger' | 'restaurant', id: string) => {
    try {
      const response = await fetch('/api/admin/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, id, action: 'approve' })
      });
      
      const data = await response.json();
      if (!response.ok) {
        alert('Error aprobando: ' + data.error);
        return;
      }
      
      alert(`✅ ${type === 'burger' ? 'Hamburguesa' : 'Restaurante'} aprobado correctamente`);
      loadAllData();
    } catch (error) {
      alert('Error de conexión');
    }
  };

  const handleReject = async (type: 'burger' | 'restaurant', id: string) => {
    if (!confirm('¿Seguro que quieres rechazar este elemento?')) return;
    
    try {
      const response = await fetch('/api/admin/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, id, action: 'reject' })
      });
      
      const data = await response.json();
      if (!response.ok) {
        alert('Error rechazando: ' + data.error);
        return;
      }
      
      alert(`❌ ${type === 'burger' ? 'Hamburguesa' : 'Restaurante'} rechazado`);
      loadAllData();
    } catch (error) {
      alert('Error de conexión');
    }
  };

  // Featured burgers functions
  const handleToggleFeatured = async (burgerId: string, currentFeatured: boolean) => {
    const supabase = createAdminClient();
    
    // If making featured, need to assign an order
    if (!currentFeatured) {
      // Check how many featured burgers already exist
      const { data: featuredBurgers } = await supabase
        .from('burgers')
        .select('featured_order')
        .eq('is_featured', true)
        .not('featured_order', 'is', null);
      
      if (featuredBurgers && featuredBurgers.length >= 3) {
        alert('Ya hay 3 hamburguesas destacadas. Deselecciona una primero.');
        return;
      }
      
      // Find the next available order
      const orders = (featuredBurgers || []).map(b => b.featured_order).filter(o => o !== null);
      let nextOrder = 1;
      for (let i = 1; i <= 3; i++) {
        if (!orders.includes(i)) {
          nextOrder = i;
          break;
        }
      }
      
      const { error } = await supabase
        .from('burgers')
        .update({ is_featured: true, featured_order: nextOrder })
        .eq('id', burgerId);
      
      if (error) {
        alert('Error destacando hamburguesa: ' + error.message);
        return;
      }
    } else {
      // Removing from featured
      const { error } = await supabase
        .from('burgers')
        .update({ is_featured: false, featured_order: null })
        .eq('id', burgerId);
      
      if (error) {
        alert('Error quitando destacado: ' + error.message);
        return;
      }
    }
    
    loadAllData();
  };

  const handleChangeFeaturedOrder = async (burgerId: string, newOrder: number) => {
    if (newOrder < 1 || newOrder > 3) return;
    
    const supabase = createAdminClient();
    
    // Check if another burger already has this order
    const { data: existing } = await supabase
      .from('burgers')
      .select('id')
      .eq('featured_order', newOrder)
      .eq('is_featured', true)
      .neq('id', burgerId)
      .single();
    
    if (existing) {
      // Swap orders
      const { data: current } = await supabase
        .from('burgers')
        .select('featured_order')
        .eq('id', burgerId)
        .single();
      
      if (current) {
        await supabase
          .from('burgers')
          .update({ featured_order: current.featured_order })
          .eq('id', existing.id);
      }
    }
    
    const { error } = await supabase
      .from('burgers')
      .update({ featured_order: newOrder })
      .eq('id', burgerId);
    
    if (error) {
      alert('Error cambiando orden: ' + error.message);
      return;
    }
    
    loadAllData();
  };

  // Loading state
  if (authLoading || adminLoading || loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}>🍔</div>
        <div>Cargando panel de administración...</div>
      </div>
    );
  }

  // Access denied
  if (!isAdmin) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}>🚫</div>
        <div>Acceso denegado</div>
        <Link href="/" style={styles.backLink}>Volver al inicio</Link>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Mobile Header */}
      {isMobile && (
        <header style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '3.5rem',
          backgroundColor: '#1f2937',
          borderBottom: '1px solid #374151',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1rem',
          zIndex: 100,
        }}>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: '#fbbf24',
              fontSize: '1.5rem',
              cursor: 'pointer',
              minWidth: '2.75rem',
              minHeight: '2.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
          <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>🍔 Admin</span>
          <Link href="/" style={{ 
            color: '#9ca3af', 
            textDecoration: 'none',
            minWidth: '2.75rem',
            minHeight: '2.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>←</Link>
        </header>
      )}
      
      {/* Sidebar - Desktop always visible, Mobile overlay */}
      <aside style={{
        ...styles.sidebar,
        ...(isMobile ? {
          position: 'fixed',
          top: '3.5rem',
          left: 0,
          bottom: 0,
          width: '85vw',
          maxWidth: '300px',
          zIndex: 90,
          transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease-in-out',
        } : {})
      }}>
        {!isMobile && (
          <div style={styles.sidebarHeader}>
            <h1 style={styles.logo}>🍔 BurgeRank</h1>
            <span style={styles.adminBadge}>Admin</span>
          </div>
        )}
        
        <nav style={styles.nav}>
          {[
            { id: 'dashboard', icon: '📊', label: 'Dashboard' },
            { id: 'burgers', icon: '🍔', label: 'Hamburguesas' },
            { id: 'restaurants', icon: '🏪', label: 'Restaurantes' },
            { id: 'featured', icon: '⭐', label: 'Destacados' },
            { id: 'promotions', icon: '🎉', label: 'Promociones' },
            { id: 'pending', icon: '⏳', label: `Pendientes ${stats.pendingApprovals > 0 ? `(${stats.pendingApprovals})` : ''}` },
            { id: 'import', icon: '📥', label: 'Importar CSV' },
            { id: 'users', icon: '●', label: 'Usuarios' },
            { id: 'ratings', icon: '◇', label: 'Valoraciones' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id as ActiveSection);
                if (isMobile) setMobileMenuOpen(false);
              }}
              style={{
                ...styles.navButton,
                minHeight: '2.75rem', // Touch target
                ...(activeSection === item.id ? styles.navButtonActive : {}),
                ...(item.id === 'pending' && stats.pendingApprovals > 0 ? { backgroundColor: '#7c2d12', color: '#fbbf24' } : {})
              }}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        
        <div style={styles.sidebarFooter}>
          <div style={styles.userInfo}>
            <span>👤 {userProfile?.username}</span>
          </div>
          <Link href="/" style={styles.exitButton}>
            ← Volver a la app
          </Link>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobile && mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: '3.5rem',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 80,
          }}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main style={{
        ...styles.main,
        ...(isMobile ? {
          marginTop: '3.5rem',
          padding: '1rem',
        } : {})
      }}>
        {activeSection === 'dashboard' && (
          <DashboardSection stats={stats} />
        )}
        
        {activeSection === 'burgers' && (
          <BurgersSection 
            burgers={burgers}
            restaurants={restaurants}
            cities={cities}
            onEdit={(burger: Burger) => { setEditingItem(burger); setModalType('burger'); setShowModal(true); }}
            onDelete={(id: string) => handleDelete('burger', id)}
            onAdd={() => { setEditingItem(null); setModalType('burger'); setShowModal(true); }}
          />
        )}
        
        {activeSection === 'restaurants' && (
          <RestaurantsSection 
            restaurants={restaurants}
            cities={cities}
            onEdit={(restaurant: Restaurant) => { setEditingItem(restaurant); setModalType('restaurant'); setShowModal(true); }}
            onDelete={(id: string) => handleDelete('restaurant', id)}
            onAdd={() => { setEditingItem(null); setModalType('restaurant'); setShowModal(true); }}
          />
        )}
        
        {activeSection === 'promotions' && (
          <PromotionsSection 
            promotions={promotions}
            restaurants={restaurants}
            onEdit={(promo: Promotion) => { setEditingItem(promo); setModalType('promotion'); setShowModal(true); }}
            onDelete={(id: string) => handleDelete('promotion', id)}
            onAdd={() => { setEditingItem(null); setModalType('promotion'); setShowModal(true); }}
          />
        )}
        
        {activeSection === 'users' && (
          <UsersSection 
            users={users}
            currentUserId={authUser?.id || ''}
            onToggleAdmin={handleToggleAdmin}
          />
        )}
        
        {activeSection === 'ratings' && (
          <RatingsSection 
            ratings={ratings}
            onDelete={(id: string) => handleDelete('rating', id)}
          />
        )}

        {activeSection === 'featured' && (
          <div>
            <Link 
              href="/admin/featured"
              style={{
                display: 'inline-block',
                padding: '1rem 2rem',
                backgroundColor: '#fbbf24',
                color: '#1a1a1a',
                borderRadius: '0.5rem',
                fontWeight: 600,
                textDecoration: 'none',
                marginBottom: '1rem'
              }}
            >
              🌟 Ir a Gestión de Destacados
            </Link>
            <FeaturedSection 
              burgers={burgers.filter(b => b.is_featured)}
              allBurgers={burgers}
              onToggleFeatured={handleToggleFeatured}
              onChangeOrder={handleChangeFeaturedOrder}
            />
          </div>
        )}

        {activeSection === 'pending' && (
          <PendingSection 
            pendingItems={pendingItems}
            burgers={burgers}
            restaurants={restaurants}
            onApprove={handleApprove}
            onReject={handleReject}
            onEdit={(type: string, item: any) => {
              setEditingItem(item);
              setModalType(type as any);
              setShowModal(true);
            }}
          />
        )}

        {activeSection === 'import' && (
          <ImportCSVSection onImportComplete={loadAllData} />
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <Modal
          type={modalType}
          item={editingItem}
          restaurants={restaurants}
          cities={cities}
          onClose={() => { setShowModal(false); setEditingItem(null); }}
          onSave={(data: any) => {
            switch (modalType) {
              case 'burger': handleSaveBurger(data); break;
              case 'restaurant': handleSaveRestaurant(data); break;
              case 'promotion': handleSavePromotion(data); break;
            }
          }}
        />
      )}
    </div>
  );
}

// Dashboard Section
function DashboardSection({ stats }: { stats: any }) {
  return (
    <div>
      <h2 style={styles.sectionTitle}>📊 Dashboard</h2>
      
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>🍔</div>
          <div style={styles.statNumber}>{stats.totalBurgers}</div>
          <div style={styles.statLabel}>Hamburguesas</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>🏪</div>
          <div style={styles.statNumber}>{stats.totalRestaurants}</div>
          <div style={styles.statLabel}>Restaurantes</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>👥</div>
          <div style={styles.statNumber}>{stats.totalUsers}</div>
          <div style={styles.statLabel}>Usuarios</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>💬</div>
          <div style={styles.statNumber}>{stats.totalRatings}</div>
          <div style={styles.statLabel}>Valoraciones</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>🎉</div>
          <div style={styles.statNumber}>{stats.activePromotions}</div>
          <div style={styles.statLabel}>Promociones Activas</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>⭐</div>
          <div style={styles.statNumber}>{stats.featuredBurgers}</div>
          <div style={styles.statLabel}>Destacadas</div>
        </div>
        {stats.pendingApprovals > 0 && (
          <div style={{...styles.statCard, backgroundColor: '#7c2d12', borderColor: '#dc2626'}}>
            <div style={styles.statIcon}>⏳</div>
            <div style={styles.statNumber}>{stats.pendingApprovals}</div>
            <div style={styles.statLabel}>Pendientes Aprobación</div>
          </div>
        )}
      </div>
    </div>
  );
}

// Burgers Section
function BurgersSection({ burgers, onEdit, onDelete, onAdd }: any) {
  const [search, setSearch] = useState('');
  
  const filteredBurgers = burgers.filter((b: Burger) => 
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.restaurant?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>🍔 Hamburguesas</h2>
        <button onClick={onAdd} style={styles.addButton}>+ Nueva Hamburguesa</button>
      </div>
      
      <input
        type="text"
        placeholder="Buscar hamburguesa..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.searchInput}
      />
      
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>#</th>
              <th style={styles.th}>Nombre</th>
              <th style={styles.th}>Restaurante</th>
              <th style={styles.th}>Ciudad</th>
              <th style={styles.th}>Rating</th>
              <th style={styles.th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredBurgers.map((burger: Burger) => (
              <tr key={burger.id} style={styles.tr}>
                <td style={styles.td}>{burger.position || '-'}</td>
                <td style={styles.td}>{burger.name}</td>
                <td style={styles.td}>{burger.restaurant?.name || '-'}</td>
                <td style={styles.td}>{burger.city?.name || '-'}</td>
                <td style={styles.td}>⭐ {burger.average_rating?.toFixed(1) || '0.0'}</td>
                <td style={styles.td}>
                  <button onClick={() => onEdit(burger)} style={styles.editBtn}>✏️</button>
                  <button onClick={() => onDelete(burger.id)} style={styles.deleteBtn}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Restaurants Section
function RestaurantsSection({ restaurants, onEdit, onDelete, onAdd }: any) {
  const [search, setSearch] = useState('');
  
  const filteredRestaurants = restaurants.filter((r: Restaurant) => 
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>🏪 Restaurantes</h2>
        <button onClick={onAdd} style={styles.addButton}>+ Nuevo Restaurante</button>
      </div>
      
      <input
        type="text"
        placeholder="Buscar restaurante..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.searchInput}
      />
      
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Nombre</th>
              <th style={styles.th}>Ciudad</th>
              <th style={styles.th}>Dirección</th>
              <th style={styles.th}>Rating</th>
              <th style={styles.th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredRestaurants.map((restaurant: Restaurant) => (
              <tr key={restaurant.id} style={styles.tr}>
                <td style={styles.td}>{restaurant.name}</td>
                <td style={styles.td}>{restaurant.city?.name || '-'}</td>
                <td style={styles.td}>{restaurant.address || '-'}</td>
                <td style={styles.td}>⭐ {restaurant.average_rating?.toFixed(1) || '0.0'}</td>
                <td style={styles.td}>
                  <button onClick={() => onEdit(restaurant)} style={styles.editBtn}>✏️</button>
                  <button onClick={() => onDelete(restaurant.id)} style={styles.deleteBtn}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Promotions Section
function PromotionsSection({ promotions, onEdit, onDelete, onAdd }: any) {
  return (
    <div>
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>🎉 Promociones</h2>
        <button onClick={onAdd} style={styles.addButton}>+ Nueva Promoción</button>
      </div>
      
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Título</th>
              <th style={styles.th}>Restaurante</th>
              <th style={styles.th}>Descuento</th>
              <th style={styles.th}>Estado</th>
              <th style={styles.th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {promotions.map((promo: Promotion) => (
              <tr key={promo.id} style={styles.tr}>
                <td style={styles.td}>{promo.emoji} {promo.title}</td>
                <td style={styles.td}>{promo.restaurant?.name || '-'}</td>
                <td style={styles.td}>{promo.discount_percentage ? `${promo.discount_percentage}%` : '-'}</td>
                <td style={styles.td}>
                  <span style={promo.is_active ? styles.activeStatus : styles.inactiveStatus}>
                    {promo.is_active ? '✅ Activa' : '❌ Inactiva'}
                  </span>
                </td>
                <td style={styles.td}>
                  <button onClick={() => onEdit(promo)} style={styles.editBtn}>✏️</button>
                  <button onClick={() => onDelete(promo.id)} style={styles.deleteBtn}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Users Section
function UsersSection({ users, currentUserId, onToggleAdmin }: any) {
  const [search, setSearch] = useState('');
  
  const filteredUsers = users.filter((u: User) => 
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2 style={styles.sectionTitle}>👥 Usuarios</h2>
      
      <input
        type="text"
        placeholder="Buscar usuario..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.searchInput}
      />
      
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Usuario</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Categoría</th>
              <th style={styles.th}>Puntos</th>
              <th style={styles.th}>Admin</th>
              <th style={styles.th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user: User) => (
              <tr key={user.id} style={styles.tr}>
                <td style={styles.td}>@{user.username}</td>
                <td style={styles.td}>{user.email}</td>
                <td style={styles.td}>{user.category}</td>
                <td style={styles.td}>{user.points}</td>
                <td style={styles.td}>
                  <span style={user.is_admin ? styles.activeStatus : styles.inactiveStatus}>
                    {user.is_admin ? '✅ Sí' : '❌ No'}
                  </span>
                </td>
                <td style={styles.td}>
                  {user.id !== currentUserId && (
                    <button 
                      onClick={() => onToggleAdmin(user.id, user.is_admin)} 
                      style={user.is_admin ? styles.deleteBtn : styles.editBtn}
                    >
                      {user.is_admin ? '🔒 Quitar Admin' : '🔓 Hacer Admin'}
                    </button>
                  )}
                  {user.id === currentUserId && (
                    <span style={{ color: '#9ca3af' }}>Tú</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Ratings Section
function RatingsSection({ ratings, onDelete }: any) {
  return (
    <div>
      <h2 style={styles.sectionTitle}>⭐ Últimas Valoraciones</h2>
      
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Usuario</th>
              <th style={styles.th}>Hamburguesa</th>
              <th style={styles.th}>Restaurante</th>
              <th style={styles.th}>Rating</th>
              <th style={styles.th}>Comentario</th>
              <th style={styles.th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ratings.map((rating: Rating) => (
              <tr key={rating.id} style={styles.tr}>
                <td style={styles.td}>@{rating.user?.username || '-'}</td>
                <td style={styles.td}>{rating.burger?.name || '-'}</td>
                <td style={styles.td}>{rating.burger?.restaurant?.name || '-'}</td>
                <td style={styles.td}>{'★'.repeat(rating.overall_rating)}{'☆'.repeat(5 - rating.overall_rating)}</td>
                <td style={styles.td}>{rating.comment?.substring(0, 50) || '-'}{rating.comment && rating.comment.length > 50 ? '...' : ''}</td>
                <td style={styles.td}>
                  <button onClick={() => onDelete(rating.id)} style={styles.deleteBtn}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Modal Component
function Modal({ type, item, restaurants, cities, onClose, onSave }: any) {
  const [formData, setFormData] = useState(item || {});

  useEffect(() => {
    setFormData(item || {});
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const getTitle = () => {
    switch (type) {
      case 'burger': return item ? 'Editar Hamburguesa' : 'Nueva Hamburguesa';
      case 'restaurant': return item ? 'Editar Restaurante' : 'Nuevo Restaurante';
      case 'promotion': return item ? 'Editar Promoción' : 'Nueva Promoción';
      default: return '';
    }
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modal}>
        <div style={styles.modalHeader}>
          <h3 style={styles.modalTitle}>{getTitle()}</h3>
          <button onClick={onClose} style={styles.closeButton}>✕</button>
        </div>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          {type === 'burger' && (
            <>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nombre *</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Descripción</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={styles.textarea}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>🖼️ Imagen de Hamburguesa</label>
                <ImageUploader
                  onUrlChange={(url) => setFormData({ ...formData, image_url: url })}
                  currentUrl={formData.image_url}
                  folder="burgers"
                  aspect="square"
                />
              </div>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Restaurante *</label>
                  <select
                    value={formData.restaurant_id || ''}
                    onChange={(e) => setFormData({ ...formData, restaurant_id: e.target.value })}
                    style={styles.select}
                    required
                  >
                    <option value="">Seleccionar...</option>
                    {restaurants.map((r: Restaurant) => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Ciudad *</label>
                  <select
                    value={formData.city_id || ''}
                    onChange={(e) => setFormData({ ...formData, city_id: e.target.value })}
                    style={styles.select}
                    required
                  >
                    <option value="">Seleccionar...</option>
                    {cities.map((c: City) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Tipo</label>
                  <select
                    value={formData.type || ''}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    style={styles.select}
                  >
                    <option value="">Sin tipo</option>
                    <option value="clásica">Clásica</option>
                    <option value="premium">Premium</option>
                    <option value="doble">Doble</option>
                    <option value="vegana">Vegana</option>
                    <option value="gourmet">Gourmet</option>
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Posición</label>
                  <input
                    type="number"
                    value={formData.position || ''}
                    onChange={(e) => setFormData({ ...formData, position: parseInt(e.target.value) || null })}
                    style={styles.input}
                  />
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Tags (separados por coma)</label>
                <input
                  type="text"
                  value={(formData.tags || []).join(', ')}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map((t: string) => t.trim()).filter(Boolean) })}
                  style={styles.input}
                  placeholder="Premium, Jugosa, Carne Fresca"
                />
              </div>
            </>
          )}
          
          {type === 'restaurant' && (
            <>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nombre *</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Ciudad *</label>
                <select
                  value={formData.city_id || ''}
                  onChange={(e) => setFormData({ ...formData, city_id: e.target.value })}
                  style={styles.select}
                  required
                >
                  <option value="">Seleccionar...</option>
                  {cities.map((c: City) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Dirección</label>
                <input
                  type="text"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  style={styles.input}
                />
              </div>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Teléfono</label>
                  <input
                    type="text"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Horario</label>
                  <input
                    type="text"
                    value={formData.hours || ''}
                    onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                    style={styles.input}
                    placeholder="12:00 - 23:00"
                  />
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Sitio Web</label>
                <input
                  type="url"
                  value={formData.website || ''}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  style={styles.input}
                  placeholder="https://..."
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>URL Delivery</label>
                <input
                  type="url"
                  value={formData.delivery_url || ''}
                  onChange={(e) => setFormData({ ...formData, delivery_url: e.target.value })}
                  style={styles.input}
                  placeholder="https://ubereats.com/..."
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>URL Reservas</label>
                <input
                  type="url"
                  value={formData.reservation_url || ''}
                  onChange={(e) => setFormData({ ...formData, reservation_url: e.target.value })}
                  style={styles.input}
                  placeholder="https://thefork.es/..."
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>🖼️ Banner (Hero Image)</label>
                <ImageUploader
                  onUrlChange={(url) => setFormData({ ...formData, banner_url: url })}
                  currentUrl={formData.banner_url}
                  folder="restaurants"
                  aspect="banner"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>🖼️ Logo</label>
                <ImageUploader
                  onUrlChange={(url) => setFormData({ ...formData, logo_url: url })}
                  currentUrl={formData.logo_url}
                  folder="restaurants"
                  aspect="square"
                />
              </div>
            </>
          )}
          
          {type === 'promotion' && (
            <>
              <div style={styles.formGroup}>
                <label style={styles.label}>Título *</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Restaurante *</label>
                  <select
                    value={formData.restaurant_id || ''}
                    onChange={(e) => setFormData({ ...formData, restaurant_id: e.target.value })}
                    style={styles.select}
                    required
                  >
                    <option value="">Seleccionar...</option>
                    {restaurants.map((r: Restaurant) => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Emoji</label>
                  <input
                    type="text"
                    value={formData.emoji || ''}
                    onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                    style={styles.input}
                    placeholder="🎉"
                  />
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Descripción</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={styles.textarea}
                />
              </div>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>% Descuento</label>
                  <input
                    type="number"
                    value={formData.discount_percentage || ''}
                    onChange={(e) => setFormData({ ...formData, discount_percentage: parseInt(e.target.value) || null })}
                    style={styles.input}
                    min="0"
                    max="100"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Estado</label>
                  <select
                    value={formData.is_active ? 'true' : 'false'}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.value === 'true' })}
                    style={styles.select}
                  >
                    <option value="true">Activa</option>
                    <option value="false">Inactiva</option>
                  </select>
                </div>
              </div>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Válido desde</label>
                  <input
                    type="date"
                    value={formData.valid_from?.split('T')[0] || ''}
                    onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Válido hasta</label>
                  <input
                    type="date"
                    value={formData.valid_until?.split('T')[0] || ''}
                    onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                    style={styles.input}
                  />
                </div>
              </div>
            </>
          )}
          
          <div style={styles.modalFooter}>
            <button type="button" onClick={onClose} style={styles.cancelButton}>
              Cancelar
            </button>
            <button type="submit" style={styles.saveButton}>
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// FEATURED SECTION
// ==========================================
function FeaturedSection({ burgers, allBurgers, onToggleFeatured, onChangeOrder }: any) {
  const featured = burgers.sort((a: Burger, b: Burger) => (a.featured_order || 0) - (b.featured_order || 0));
  const available = allBurgers.filter((b: Burger) => !b.is_featured && b.status === 'approved');

  return (
    <div>
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>⭐ Hamburguesas Destacadas</h2>
        <span style={{ color: '#9ca3af' }}>Máximo 3 hamburguesas en el slider "Para Ti"</span>
      </div>

      {featured.length === 0 && (
        <div style={{ padding: '2rem', textAlign: 'center' as const, color: '#9ca3af' }}>
          No hay hamburguesas destacadas. Selecciona hasta 3 desde la lista de abajo.
        </div>
      )}

      {featured.length > 0 && (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Orden</th>
                <th style={styles.th}>Hamburguesa</th>
                <th style={styles.th}>Restaurante</th>
                <th style={styles.th}>Imagen</th>
                <th style={styles.th}>Rating</th>
                <th style={styles.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {featured.map((burger: Burger) => (
                <tr key={burger.id} style={styles.tr}>
                  <td style={styles.td}>
                    <select
                      value={burger.featured_order || 1}
                      onChange={(e) => onChangeOrder(burger.id, parseInt(e.target.value))}
                      style={{ ...styles.select, width: '70px' }}
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                    </select>
                  </td>
                  <td style={styles.td}>{burger.name}</td>
                  <td style={styles.td}>{burger.restaurant?.name || '-'}</td>
                  <td style={styles.td}>
                    {burger.image_url ? (
                      <img src={burger.image_url} alt={burger.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                    ) : (
                      <span style={{ color: '#9ca3af' }}>Sin imagen</span>
                    )}
                  </td>
                  <td style={styles.td}>⭐ {burger.average_rating?.toFixed(1) || '0.0'}</td>
                  <td style={styles.td}>
                    <button onClick={() => onToggleFeatured(burger.id, true)} style={styles.deleteBtn}>
                      ❌ Quitar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {featured.length < 3 && (
        <>
          <h3 style={{ ...styles.sectionTitle, fontSize: '1.2rem', marginTop: '2rem' }}>
            Hamburguesas disponibles para destacar
          </h3>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Hamburguesa</th>
                  <th style={styles.th}>Restaurante</th>
                  <th style={styles.th}>Imagen</th>
                  <th style={styles.th}>Rating</th>
                  <th style={styles.th}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {available.slice(0, 20).map((burger: Burger) => (
                  <tr key={burger.id} style={styles.tr}>
                    <td style={styles.td}>{burger.name}</td>
                    <td style={styles.td}>{burger.restaurant?.name || '-'}</td>
                    <td style={styles.td}>
                      {burger.image_url ? (
                        <img src={burger.image_url} alt={burger.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                      ) : (
                        <span style={{ color: '#9ca3af' }}>Sin imagen</span>
                      )}
                    </td>
                    <td style={styles.td}>⭐ {burger.average_rating?.toFixed(1) || '0.0'}</td>
                    <td style={styles.td}>
                      <button onClick={() => onToggleFeatured(burger.id, false)} style={styles.editBtn}>
                        ⭐ Destacar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

// ==========================================
// PENDING SECTION
// ==========================================
function PendingSection({ pendingItems, burgers, restaurants, onApprove, onReject, onEdit }: any) {
  return (
    <div>
      <h2 style={styles.sectionTitle}>⏳ Pendientes de Aprobación</h2>

      {pendingItems.length === 0 && (
        <div style={{ padding: '2rem', textAlign: 'center' as const, color: '#9ca3af' }}>
          ✅ No hay elementos pendientes de aprobación
        </div>
      )}

      {pendingItems.length > 0 && (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Tipo</th>
                <th style={styles.th}>Nombre</th>
                <th style={styles.th}>Enviado por</th>
                <th style={styles.th}>Fecha</th>
                <th style={styles.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pendingItems.map((item: PendingItem) => {
                const fullItem = item.item_type === 'burger' 
                  ? burgers.find((b: Burger) => b.id === item.item_id)
                  : restaurants.find((r: Restaurant) => r.id === item.item_id);

                return (
                  <tr key={item.item_id} style={styles.tr}>
                    <td style={styles.td}>
                      <span style={{ ...styles.activeStatus, backgroundColor: item.item_type === 'burger' ? '#3b82f6' : '#10b981' }}>
                        {item.item_type === 'burger' ? '🍔 Burger' : '🏪 Restaurante'}
                      </span>
                    </td>
                    <td style={styles.td}>{item.item_name}</td>
                    <td style={styles.td}>{item.submitter_name || 'Desconocido'}</td>
                    <td style={styles.td}>{new Date(item.created_at).toLocaleDateString()}</td>
                    <td style={styles.td}>
                      <button 
                        onClick={() => onEdit(item.item_type, fullItem)} 
                        style={styles.editBtn}
                        title="Editar antes de aprobar"
                      >
                        ✏️ Editar
                      </button>
                      <button 
                        onClick={() => onApprove(item.item_type, item.item_id)} 
                        style={{...styles.editBtn, backgroundColor: '#10b981'}}
                      >
                        ✅ Aprobar
                      </button>
                      <button 
                        onClick={() => onReject(item.item_type, item.item_id)} 
                        style={styles.deleteBtn}
                      >
                        ❌ Rechazar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ==========================================
// IMPORT CSV SECTION
// ==========================================
function ImportCSVSection({ onImportComplete }: { onImportComplete: () => void }) {
  const [importType, setImportType] = useState<'cities' | 'restaurants' | 'burgers'>('cities');
  const [csvData, setCsvData] = useState('');
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState<{ success: number; errors: string[] } | null>(null);

  const parseCSV = (text: string) => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const rows = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      rows.push(row);
    }
    
    return rows;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setCsvData(event.target?.result as string || '');
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!csvData.trim()) {
      alert('Por favor, pega datos CSV o sube un archivo');
      return;
    }
    
    const rows = parseCSV(csvData);
    if (rows.length === 0) {
      alert('No se encontraron datos válidos en el CSV');
      return;
    }
    
    setImporting(true);
    setResults(null);
    
    try {
      const response = await fetch('/api/admin/import-csv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: importType, data: rows })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        alert('Error: ' + data.error);
        return;
      }
      
      setResults({ success: data.success, errors: data.errors });
      
      if (data.success > 0) {
        onImportComplete();
      }
    } catch (error) {
      alert('Error de conexión');
    } finally {
      setImporting(false);
    }
  };

  const getExampleCSV = () => {
    switch (importType) {
      case 'cities':
        return 'name,country\nMadrid,España\nBarcelona,España\nValencia,España';
      case 'restaurants':
        return 'name,city,address,phone\nGoiko,Madrid,Calle Gran Vía 15,912345678\nTGB,Barcelona,Passeig de Gràcia 20,934567890';
      case 'burgers':
        return 'name,restaurant,city,description,type,tags\nKevin Bacon,Goiko,Madrid,Hamburguesa con bacon crujiente,Smash,bacon,queso,cebolla\nLa Vegana,TGB,Barcelona,Hamburguesa vegana,Vegana,vegana,tofu';
      default:
        return '';
    }
  };

  return (
    <div>
      <h2 style={styles.sectionTitle}>📥 Importar desde CSV</h2>
      
      <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#1f2937', borderRadius: '0.5rem' }}>
        <p style={{ color: '#9ca3af', marginBottom: '1rem' }}>
          Importa ciudades, restaurantes y hamburguesas masivamente desde un archivo CSV.
          <br />
          <strong>Orden recomendado:</strong> 1) Ciudades → 2) Restaurantes → 3) Hamburguesas
        </p>
      </div>

      {/* Type selector */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
          Tipo de datos a importar:
        </label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {[
            { value: 'cities', label: '📍 Ciudades', color: '#3b82f6' },
            { value: 'restaurants', label: '🏪 Restaurantes', color: '#10b981' },
            { value: 'burgers', label: '🍔 Hamburguesas', color: '#f59e0b' },
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => setImportType(opt.value as any)}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: importType === opt.value ? opt.color : '#374151',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: importType === opt.value ? '600' : 'normal'
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Format info */}
      <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#374151', borderRadius: '0.5rem' }}>
        <h4 style={{ marginBottom: '0.5rem', color: '#fbbf24' }}>📋 Formato esperado para {importType}:</h4>
        <pre style={{ 
          backgroundColor: '#1f2937', 
          padding: '1rem', 
          borderRadius: '0.25rem',
          fontSize: '0.85rem',
          overflowX: 'auto'
        }}>
          {getExampleCSV()}
        </pre>
        <button
          onClick={() => setCsvData(getExampleCSV())}
          style={{
            marginTop: '0.5rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#4b5563',
            color: 'white',
            border: 'none',
            borderRadius: '0.25rem',
            cursor: 'pointer',
            fontSize: '0.85rem'
          }}
        >
          📝 Usar ejemplo
        </button>
      </div>

      {/* File upload */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
          Subir archivo CSV:
        </label>
        <input
          type="file"
          accept=".csv,.txt"
          onChange={handleFileUpload}
          style={{
            padding: '0.5rem',
            backgroundColor: '#374151',
            color: 'white',
            border: '1px solid #4b5563',
            borderRadius: '0.5rem',
            width: '100%'
          }}
        />
      </div>

      {/* Text area for CSV data */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
          O pega los datos CSV aquí:
        </label>
        <textarea
          value={csvData}
          onChange={(e) => setCsvData(e.target.value)}
          placeholder={`Pega tu CSV aquí...\n\n${getExampleCSV()}`}
          style={{
            width: '100%',
            height: '200px',
            padding: '1rem',
            backgroundColor: '#1f2937',
            color: '#e5e7eb',
            border: '1px solid #4b5563',
            borderRadius: '0.5rem',
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            resize: 'vertical'
          }}
        />
      </div>

      {/* Import button */}
      <button
        onClick={handleImport}
        disabled={importing || !csvData.trim()}
        style={{
          padding: '1rem 2rem',
          backgroundColor: importing ? '#4b5563' : '#10b981',
          color: 'white',
          border: 'none',
          borderRadius: '0.5rem',
          cursor: importing ? 'not-allowed' : 'pointer',
          fontWeight: '600',
          fontSize: '1rem',
          width: '100%'
        }}
      >
        {importing ? '⏳ Importando...' : `📥 Importar ${importType}`}
      </button>

      {/* Results */}
      {results && (
        <div style={{ 
          marginTop: '1.5rem', 
          padding: '1rem', 
          backgroundColor: results.errors.length > 0 ? '#7c2d12' : '#065f46',
          borderRadius: '0.5rem'
        }}>
          <h4 style={{ marginBottom: '0.5rem' }}>
            ✅ Importados correctamente: {results.success}
          </h4>
          {results.errors.length > 0 && (
            <>
              <h4 style={{ marginBottom: '0.5rem', color: '#fbbf24' }}>
                ⚠️ Errores ({results.errors.length}):
              </h4>
              <ul style={{ 
                maxHeight: '150px', 
                overflowY: 'auto', 
                fontSize: '0.85rem',
                paddingLeft: '1.5rem'
              }}>
                {results.errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// Styles
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#111827',
    color: '#e5e7eb'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#111827',
    color: '#e5e7eb',
    gap: '1rem'
  },
  loadingSpinner: {
    fontSize: '4rem'
  },
  backLink: {
    color: '#fbbf24',
    textDecoration: 'none',
    marginTop: '1rem'
  },
  sidebar: {
    width: '250px',
    backgroundColor: '#1f2937',
    borderRight: '1px solid #374151',
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem'
  },
  sidebarHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '2rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #374151'
  },
  logo: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#fbbf24'
  },
  adminBadge: {
    backgroundColor: '#dc2626',
    color: 'white',
    fontSize: '0.7rem',
    padding: '0.25rem 0.5rem',
    borderRadius: '0.25rem',
    fontWeight: 'bold'
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    flex: 1
  },
  navButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#9ca3af',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    textAlign: 'left' as const,
    fontSize: '0.95rem',
    transition: 'all 0.2s'
  },
  navButtonActive: {
    backgroundColor: '#374151',
    color: '#fbbf24'
  },
  navIcon: {
    fontSize: '1.25rem'
  },
  sidebarFooter: {
    borderTop: '1px solid #374151',
    paddingTop: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  userInfo: {
    fontSize: '0.85rem',
    color: '#9ca3af'
  },
  exitButton: {
    display: 'block',
    padding: '0.5rem',
    color: '#9ca3af',
    textDecoration: 'none',
    fontSize: '0.85rem'
  },
  main: {
    flex: 1,
    padding: '2rem',
    overflowY: 'auto' as const
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    color: '#fbbf24'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem'
  },
  statCard: {
    backgroundColor: '#1f2937',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    textAlign: 'center' as const,
    border: '1px solid #374151'
  },
  statIcon: {
    fontSize: '2rem',
    marginBottom: '0.5rem'
  },
  statNumber: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#fbbf24'
  },
  statLabel: {
    color: '#9ca3af',
    fontSize: '0.85rem'
  },
  searchInput: {
    width: '100%',
    maxWidth: '400px',
    padding: '0.75rem 1rem',
    backgroundColor: '#374151',
    border: '1px solid #4b5563',
    borderRadius: '0.5rem',
    color: '#e5e7eb',
    marginBottom: '1rem',
    fontSize: '0.95rem'
  },
  addButton: {
    padding: '0.75rem 1.5rem',
    minHeight: '2.75rem', // Touch target
    backgroundColor: '#fbbf24',
    color: '#000',
    border: 'none',
    borderRadius: '0.5rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  tableContainer: {
    backgroundColor: '#1f2937',
    borderRadius: '0.75rem',
    border: '1px solid #374151',
    overflow: 'auto', // Enable horizontal scroll on mobile
    WebkitOverflowScrolling: 'touch' as const,
  },
  table: {
    width: '100%',
    minWidth: '600px', // Force minimum width for horizontal scroll
    borderCollapse: 'collapse' as const
  },
  th: {
    padding: '1rem',
    textAlign: 'left' as const,
    backgroundColor: '#374151',
    fontWeight: '600',
    fontSize: '0.85rem',
    color: '#fbbf24',
    borderBottom: '1px solid #4b5563'
  },
  tr: {
    borderBottom: '1px solid #374151'
  },
  td: {
    padding: '0.75rem 1rem',
    fontSize: '0.9rem'
  },
  editBtn: {
    padding: '0.5rem 0.75rem',
    minHeight: '2.5rem', // Touch target
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '0.25rem',
    cursor: 'pointer',
    marginRight: '0.5rem',
    fontSize: '0.85rem',
  },
  deleteBtn: {
    padding: '0.5rem 0.75rem',
    minHeight: '2.5rem',
    backgroundColor: '#dc2626',
    color: 'white',
    border: 'none',
    borderRadius: '0.25rem',
    cursor: 'pointer',
    fontSize: '0.85rem',
  },
  activeStatus: {
    color: '#10b981'
  },
  inactiveStatus: {
    color: '#9ca3af'
  },
  modalOverlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modal: {
    backgroundColor: '#1f2937',
    borderRadius: '0.75rem',
    width: '95%', // Better mobile width
    maxWidth: '600px',
    maxHeight: '90vh',
    overflow: 'auto' as const,
    border: '1px solid #374151',
    margin: '1rem',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 1.5rem',
    borderBottom: '1px solid #374151'
  },
  modalTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#fbbf24'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: '#9ca3af',
    fontSize: '1.5rem',
    cursor: 'pointer'
  },
  form: {
    padding: '1.5rem'
  },
  formGroup: {
    marginBottom: '1rem',
    flex: 1
  },
  formRow: {
    display: 'flex',
    gap: '1rem'
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontSize: '0.85rem',
    color: '#9ca3af'
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#374151',
    border: '1px solid #4b5563',
    borderRadius: '0.5rem',
    color: '#e5e7eb',
    fontSize: '0.95rem'
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#374151',
    border: '1px solid #4b5563',
    borderRadius: '0.5rem',
    color: '#e5e7eb',
    fontSize: '0.95rem',
    minHeight: '100px',
    resize: 'vertical' as const
  },
  select: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#374151',
    border: '1px solid #4b5563',
    borderRadius: '0.5rem',
    color: '#e5e7eb',
    fontSize: '0.95rem'
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '1rem',
    marginTop: '1.5rem',
    paddingTop: '1rem',
    borderTop: '1px solid #374151'
  },
  cancelButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#374151',
    color: '#e5e7eb',
    border: '1px solid #4b5563',
    borderRadius: '0.5rem',
    cursor: 'pointer'
  },
  saveButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#fbbf24',
    color: '#000',
    border: 'none',
    borderRadius: '0.5rem',
    fontWeight: 'bold',
    cursor: 'pointer'
  }
};
