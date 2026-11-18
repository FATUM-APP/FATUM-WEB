import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ShoppingBag, Search, Mic, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCatalog } from '../context/CatalogContext';
import { useFavorites } from '../context/FavoritesContext';
import ServiceCard from '../components/ServiceCard';
import CategoryChip from '../components/CategoryChip';
import type { FatumCategory } from '../types';

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { categories, items, loadCategories, loadItems, isLoading } = useCatalog();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [addressOpen, setAddressOpen] = useState(false);

  useEffect(() => {
    loadCategories();
    loadItems();
  }, []);

  const handleCategorySelect = (cat: FatumCategory | null) => {
    const slug = cat?.slug ?? null;
    setSelectedCategory(slug);
    if (slug) loadItems(slug);
    else loadItems();
  };

  const filteredItems = searchQuery
    ? items.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : items;

  return (
    <div style={styles.page}>
      {/* Top Bar */}
      <div style={styles.topBar}>
        <button
          onClick={() => setAddressOpen(!addressOpen)}
          style={styles.addressButton}
        >
          <span style={styles.addressLabel}>Mi ubicación</span>
          <ChevronDown size={16} color="var(--brand-primary)" />
        </button>
        <div style={styles.topIcons}>
          <button
            onClick={() => navigate('/orders')}
            style={styles.iconButton}
            aria-label="Órdenes"
          >
            <ShoppingBag size={22} color="var(--brand-primary)" />
          </button>
          <button style={styles.iconButton} aria-label="Notificaciones">
            <Bell size={22} color="var(--brand-primary)" />
          </button>
        </div>
      </div>

      {/* Greeting Card */}
      <div style={styles.greetingCard}>
        <h2 style={styles.greeting}>
          ¡Hola, {user?.name?.split(' ')[0] ?? 'Usuario'}!
        </h2>
        <p style={styles.greetingBody}>
          ¿Qué servicio estás buscando hoy?
        </p>
      </div>

      {/* Search */}
      <div style={styles.searchContainer}>
        <Search size={20} color="var(--text)" />
        <input
          type="text"
          placeholder="Buscar servicios..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchInput}
        />
        <button style={styles.micButton} aria-label="Búsqueda por voz">
          <Mic size={20} color="var(--brand-primary)" />
        </button>
      </div>

      {/* Category Chips */}
      <div style={styles.chipScroll}>
        <CategoryChip
          name="Todas"
          selected={selectedCategory === null}
          onClick={() => handleCategorySelect(null)}
        />
        {categories.map((cat) => (
          <CategoryChip
            key={cat.slug}
            name={cat.name}
            logoUrl={cat.logoUrl}
            selected={selectedCategory === cat.slug}
            onClick={() => handleCategorySelect(cat)}
          />
        ))}
      </div>

      {/* Service List */}
      {isLoading ? (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner} />
        </div>
      ) : filteredItems.length === 0 ? (
        <div style={styles.empty}>
          <p style={styles.emptyText}>No se encontraron servicios</p>
        </div>
      ) : (
        <div style={styles.serviceGrid}>
          {filteredItems.map((item) => (
            <ServiceCard
              key={item.id}
              item={item}
              isFavorite={isFavorite(item.id)}
              onFavoriteToggle={() =>
                isFavorite(item.id)
                  ? removeFavorite(item.id)
                  : addFavorite(item.id)
              }
              onClick={() => navigate(`/service/${item.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    backgroundColor: 'var(--brand-secondary)',
    minHeight: '100vh',
    padding: '16px',
    paddingBottom: 80,
    maxWidth: 1200,
    margin: '0 auto',
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addressButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
  },
  addressLabel: {
    fontFamily: "'Lato', sans-serif",
    fontSize: 14,
    fontWeight: 700,
    color: 'var(--brand-primary)',
  },
  topIcons: {
    display: 'flex',
    gap: 12,
  },
  iconButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 4,
    display: 'flex',
    alignItems: 'center',
  },
  greetingCard: {
    background: 'rgba(212, 226, 208, 0.5)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: 16,
    padding: '20px 24px',
    marginBottom: 16,
    border: '1px solid rgba(18, 63, 53, 0.1)',
  },
  greeting: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: 24,
    fontWeight: 700,
    color: 'var(--brand-primary)',
    margin: 0,
  },
  greetingBody: {
    fontFamily: "'Lato', sans-serif",
    fontSize: 16,
    color: 'var(--text)',
    margin: '4px 0 0',
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '12px 16px',
    backgroundColor: 'var(--brand-secondary)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontFamily: "'Lato', sans-serif",
    fontSize: 16,
    color: 'var(--text)',
    backgroundColor: 'transparent',
  },
  micButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 4,
    display: 'flex',
  },
  chipScroll: {
    display: 'flex',
    gap: 8,
    overflowX: 'auto',
    paddingBottom: 8,
    marginBottom: 16,
    scrollbarWidth: 'none' as const,
  },
  serviceGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: 16,
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: 48,
  },
  spinner: {
    width: 32,
    height: 32,
    border: '3px solid var(--border)',
    borderTopColor: 'var(--brand-primary)',
    borderRadius: '50%',
    animation: 'fatum-spin 0.6s linear infinite',
  },
  empty: {
    textAlign: 'center' as const,
    padding: 48,
  },
  emptyText: {
    fontFamily: "'Lato', sans-serif",
    fontSize: 16,
    color: 'var(--inactive)',
  },
};
