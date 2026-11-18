import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { useCatalog } from '../context/CatalogContext';
import ServiceCard from '../components/ServiceCard';
import CategoryChip from '../components/CategoryChip';
import { Heart } from 'lucide-react';

export default function FavoritesPage() {
  const navigate = useNavigate();
  const { favorites, loadFavorites, removeFavorite, isLoading } = useFavorites();
  const { categories, loadCategories } = useCatalog();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    loadFavorites();
    loadCategories();
  }, []);

  const filtered = selectedCategory
    ? favorites.filter((f) => f.category === selectedCategory)
    : favorites;

  return (
    <div style={styles.page}>
      <h1 style={styles.header}>Mis favoritos</h1>

      <div style={styles.chipScroll}>
        <CategoryChip
          name="Todas"
          selected={selectedCategory === null}
          onClick={() => setSelectedCategory(null)}
        />
        {categories.map((cat) => (
          <CategoryChip
            key={cat.slug}
            name={cat.name}
            logoUrl={cat.logoUrl}
            selected={selectedCategory === cat.slug}
            onClick={() => setSelectedCategory(cat.slug)}
          />
        ))}
      </div>

      {isLoading ? (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner} />
        </div>
      ) : filtered.length === 0 ? (
        <div style={styles.empty}>
          <Heart size={48} color="var(--inactive)" />
          <p style={styles.emptyText}>
            {selectedCategory
              ? 'No tienes favoritos en esta categoría'
              : 'Aún no tienes servicios favoritos'}
          </p>
          <p style={styles.emptyHint}>
            Explora servicios y agrega los que te interesen
          </p>
        </div>
      ) : (
        <div style={styles.grid}>
          {filtered.map((item) => (
            <ServiceCard
              key={item.id}
              item={item}
              isFavorite
              onFavoriteToggle={() => removeFavorite(item.id)}
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
    padding: 16,
    paddingBottom: 80,
    maxWidth: 1200,
    margin: '0 auto',
  },
  header: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: 24,
    fontWeight: 700,
    color: 'var(--text)',
    margin: '0 0 16px',
  },
  chipScroll: {
    display: 'flex',
    gap: 8,
    overflowX: 'auto',
    paddingBottom: 8,
    marginBottom: 16,
    scrollbarWidth: 'none' as const,
  },
  grid: {
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
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    padding: 48,
  },
  emptyText: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: 18,
    fontWeight: 500,
    color: 'var(--text)',
    margin: 0,
    textAlign: 'center' as const,
  },
  emptyHint: {
    fontFamily: "'Lato', sans-serif",
    fontSize: 14,
    color: 'var(--inactive)',
    margin: 0,
    textAlign: 'center' as const,
  },
};
