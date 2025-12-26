'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface SearchResult {
  id: string;
  name: string;
  type: 'burger' | 'restaurant' | 'city';
  subtitle?: string;
  rating?: number;
  image_url?: string;
}

interface SmartSearchProps {
  placeholder?: string;
  onSelect?: (result: SearchResult) => void;
}

export default function SmartSearch({ placeholder = 'Buscar burgers, restaurantes...', onSelect }: SmartSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    // Debounced search
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    debounceRef.current = setTimeout(() => {
      searchAll(query);
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const searchAll = async (searchQuery: string) => {
    setLoading(true);
    const supabase = createClient();
    const allResults: SearchResult[] = [];

    try {
      // Search burgers
      const { data: burgers } = await supabase
        .from('burgers')
        .select(`
          id,
          name,
          average_rating,
          image_url,
          restaurant:restaurants(name)
        `)
        .ilike('name', `%${searchQuery}%`)
        .limit(5);

      if (burgers) {
        burgers.forEach((b: any) => {
          allResults.push({
            id: b.id,
            name: b.name,
            type: 'burger',
            subtitle: `🍔 ${b.restaurant?.name || 'Restaurante'}`,
            rating: b.average_rating,
            image_url: b.image_url
          });
        });
      }

      // Search restaurants
      const { data: restaurants } = await supabase
        .from('restaurants')
        .select(`
          id,
          name,
          average_rating,
          logo_url,
          city:cities(name)
        `)
        .ilike('name', `%${searchQuery}%`)
        .limit(4);

      if (restaurants) {
        restaurants.forEach((r: any) => {
          allResults.push({
            id: r.id,
            name: r.name,
            type: 'restaurant',
            subtitle: `📍 ${r.city?.name || 'Ciudad'}`,
            rating: r.average_rating,
            image_url: r.logo_url
          });
        });
      }

      // Search cities
      const { data: cities } = await supabase
        .from('cities')
        .select('id, name')
        .ilike('name', `%${searchQuery}%`)
        .limit(3);

      if (cities) {
        cities.forEach((c: any) => {
          allResults.push({
            id: c.id,
            name: c.name,
            type: 'city',
            subtitle: '🏙️ Ciudad'
          });
        });
      }

      setResults(allResults);
      setShowResults(allResults.length > 0);
      setSelectedIndex(-1);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleSelect(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowResults(false);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSelect = (result: SearchResult) => {
    setQuery('');
    setShowResults(false);
    
    if (onSelect) {
      onSelect(result);
      return;
    }

    // Default navigation
    switch (result.type) {
      case 'burger':
        // Navigate to rate page with burger preselected
        router.push(`/rate?burger=${result.id}`);
        break;
      case 'restaurant':
        router.push(`/restaurante/${encodeURIComponent(result.name)}`);
        break;
      case 'city':
        // Filter ranking by city
        router.push(`/ranking?city=${encodeURIComponent(result.name)}`);
        break;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'burger': return '🍔';
      case 'restaurant': return '🏪';
      case 'city': return '🏙️';
      default: return '🔍';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'burger': return '#f59e0b';
      case 'restaurant': return '#10b981';
      case 'city': return '#6366f1';
      default: return '#9ca3af';
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '500px' }}>
      {/* Search Input */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            position: 'absolute',
            left: '1rem',
            fontSize: '1.1rem',
            color: '#9ca3af',
          }}
        >
          🔍
        </span>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: '0.85rem 1rem 0.85rem 2.75rem',
            backgroundColor: '#374151',
            border: '2px solid #4b5563',
            borderRadius: '0.75rem',
            color: '#fff',
            fontSize: '0.95rem',
            outline: 'none',
            transition: 'all 0.2s',
          }}
        />
        {loading && (
          <span
            style={{
              position: 'absolute',
              right: '1rem',
              fontSize: '1rem',
              animation: 'spin 1s linear infinite',
            }}
          >
            ⏳
          </span>
        )}
      </div>

      {/* Results Dropdown */}
      {showResults && results.length > 0 && (
        <div
          ref={resultsRef}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '0.5rem',
            backgroundColor: '#1f2937',
            borderRadius: '0.75rem',
            border: '1px solid #374151',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
            overflow: 'hidden',
            zIndex: 1000,
            maxHeight: '400px',
            overflowY: 'auto',
          }}
        >
          {results.map((result, index) => (
            <div
              key={`${result.type}-${result.id}`}
              onClick={() => handleSelect(result)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.85rem 1rem',
                cursor: 'pointer',
                backgroundColor: index === selectedIndex ? '#374151' : 'transparent',
                borderBottom: index < results.length - 1 ? '1px solid #374151' : 'none',
                transition: 'background-color 0.15s',
              }}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              {/* Icon or Image */}
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '0.5rem',
                  backgroundColor: `${getTypeColor(result.type)}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  flexShrink: 0,
                }}
              >
                {result.image_url ? (
                  <img
                    src={result.image_url}
                    alt={result.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).parentElement!.innerHTML = getTypeIcon(result.type);
                    }}
                  />
                ) : (
                  <span style={{ fontSize: '1.25rem' }}>{getTypeIcon(result.type)}</span>
                )}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    color: '#fff',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {result.name}
                </div>
                <div
                  style={{
                    color: '#9ca3af',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  {result.subtitle}
                  {result.rating !== undefined && result.rating > 0 && (
                    <span style={{ color: '#fbbf24' }}>
                      ★ {result.rating.toFixed(1)}
                    </span>
                  )}
                </div>
              </div>

              {/* Type Badge */}
              <span
                style={{
                  padding: '0.25rem 0.5rem',
                  backgroundColor: `${getTypeColor(result.type)}30`,
                  color: getTypeColor(result.type),
                  fontSize: '0.7rem',
                  fontWeight: '600',
                  borderRadius: '0.25rem',
                  textTransform: 'capitalize',
                }}
              >
                {result.type}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* No results message */}
      {showResults && query.length >= 2 && results.length === 0 && !loading && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '0.5rem',
            backgroundColor: '#1f2937',
            borderRadius: '0.75rem',
            border: '1px solid #374151',
            padding: '1.5rem',
            textAlign: 'center',
            zIndex: 1000,
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔍</div>
          <div style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
            No encontramos resultados para "{query}"
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
