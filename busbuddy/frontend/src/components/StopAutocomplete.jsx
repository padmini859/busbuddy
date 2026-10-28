import React, { useState, useEffect, useRef } from 'react';
import { MapPin, X, Loader2 } from 'lucide-react';
import { stopService } from '../services/stopService';
import { useLanguage } from '../contexts/LanguageContext';

const StopAutocomplete = ({ value, onChange, placeholder, label, id, error }) => {
  const { language, getStopName } = useLanguage();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef(null);

  // Sync internal display query when external value prop changes
  useEffect(() => {
    if (value && typeof value === 'object') {
      setQuery(getStopName(value));
    } else if (!value) {
      setQuery('');
    }
  }, [value, language]);

  // Click outside to dismiss dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch stops when user types
  useEffect(() => {
    if (!isOpen || query.trim().length === 0) {
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const stops = await stopService.searchStops(query.trim());
        setSuggestions(stops || []);
      } catch (err) {
        console.error('Error fetching stop suggestions:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setIsOpen(true);
    if (!e.target.value.trim()) {
      onChange(null);
      setSuggestions([]);
    }
  };

  const handleSelect = (stop) => {
    onChange(stop);
    setQuery(getStopName(stop));
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange(null);
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="form-group" style={{ position: 'relative', margin: 0 }}>
      {label && <label htmlFor={id} className="form-label">{label}</label>}

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <MapPin
          size={18}
          style={{
            position: 'absolute',
            left: '12px',
            color: value ? 'var(--secondary)' : 'var(--text-muted)',
            pointerEvents: 'none'
          }}
        />

        <input
          id={id}
          type="text"
          className="form-control"
          style={{
            paddingLeft: '38px',
            paddingRight: '36px',
            borderColor: error ? 'var(--danger)' : undefined,
            fontWeight: value ? '600' : 'normal'
          }}
          placeholder={placeholder || (language === 'ta' ? 'நிறுத்தத்தைத் தேடுங்கள்...' : 'Search bus stop...')}
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            setIsOpen(true);
            if (query.trim()) {
              stopService.searchStops(query.trim()).then(res => setSuggestions(res || []));
            }
          }}
          autoComplete="off"
        />

        {loading && (
          <Loader2
            size={16}
            className="spin"
            style={{ position: 'absolute', right: '12px', color: 'var(--secondary)' }}
          />
        )}

        {!loading && query && (
          <button
            type="button"
            onClick={handleClear}
            style={{
              position: 'absolute',
              right: '10px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              padding: '4px'
            }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {error && <span style={{ fontSize: '0.8rem', color: 'var(--danger)', marginTop: '0.2rem' }}>{error}</span>}

      {/* Autocomplete Dropdown List */}
      {isOpen && suggestions.length > 0 && (
        <ul style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '6px',
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          maxHeight: '260px',
          overflowY: 'auto',
          zIndex: 1000,
          listStyle: 'none',
          padding: '0.4rem 0',
        }}>
          {suggestions.map((stop) => {
            const isSelected = value && value.stopId === stop.stopId;
            return (
              <li
                key={stop.stopId}
                onClick={() => handleSelect(stop)}
                style={{
                  padding: '0.65rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  backgroundColor: isSelected ? '#EFF6FF' : 'transparent',
                  borderBottom: '1px solid #F8FAFC',
                  transition: 'background 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isSelected ? '#EFF6FF' : 'transparent'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <MapPin size={16} color="var(--secondary)" />
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                      {getStopName(stop)}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {language === 'ta' ? stop.stopNameEn : stop.stopNameTa}
                    </div>
                  </div>
                </div>

                {stop.servingRoutesCount !== undefined && (
                  <span style={{
                    fontSize: '0.7rem',
                    backgroundColor: '#F1F5F9',
                    color: '#475569',
                    padding: '0.15rem 0.45rem',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: '600'
                  }}>
                    {stop.servingRoutesCount} {language === 'ta' ? 'வழிகள்' : 'routes'}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <style>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default StopAutocomplete;
