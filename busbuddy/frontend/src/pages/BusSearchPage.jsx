import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Bus, Search, ArrowRight, Route, Clock, CheckCircle } from 'lucide-react';
import { busService } from '../services/busService';
import { useLanguage } from '../contexts/LanguageContext';

const BusSearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialNumber = searchParams.get('number') || '';
  const { t, language } = useLanguage();

  const [query, setQuery] = useState(initialNumber);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchBuses = async (numberToSearch) => {
    setLoading(true);
    setHasSearched(true);
    try {
      const data = await busService.searchBuses(numberToSearch);
      setBuses(data || []);
    } catch (err) {
      console.error('Error searching buses:', err);
      setBuses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuses(initialNumber);
  }, [initialNumber]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchParams(query.trim() ? { number: query.trim() } : {});
    fetchBuses(query.trim());
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', minHeight: 'calc(100vh - 150px)' }}>
      
      {/* Header */}
      <div style={{ maxWidth: '640px', margin: '0 auto 2.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '0.5rem' }}>
          {language === 'ta' ? 'பேருந்து எண் தேடல்' : 'Bus Number Directory'}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
          {language === 'ta'
            ? 'குறிப்பிட்ட பேருந்து எண்ணை உள்ளிட்டு அதன் வழித்தடம் மற்றும் நேரங்களைக் கண்டறியுங்கள்.'
            : 'Look up any local bus number to view its directional routes, terminus stops and timetables.'}
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Bus
              size={18}
              style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
            />
            <input
              type="text"
              className="form-control"
              placeholder={language === 'ta' ? 'பேருந்து எண்ணை உள்ளிடவும் (உதா: 11A, 70, 33A)...' : 'Enter bus number (e.g. 11A, 70, 33A, 90A)...'}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ paddingLeft: '42px', fontSize: '1rem', height: '48px' }}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: '0 1.5rem' }}>
            <Search size={18} />
            <span>Search</span>
          </button>
        </form>

        {/* Quick Filter Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', alignSelf: 'center' }}>Popular:</span>
          {['11A', '70', '33A', '90A', '102', '20C', '45B'].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => {
                setQuery(num);
                setSearchParams({ number: num });
                fetchBuses(num);
              }}
              style={{
                background: '#FFFFFF',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-full)',
                padding: '0.2rem 0.65rem',
                fontSize: '0.78rem',
                fontWeight: '700',
                color: 'var(--primary)',
                cursor: 'pointer'
              }}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
          {t('loading')}
        </div>
      ) : buses.length === 0 && hasSearched ? (
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center', padding: '2.5rem' }}>
          <p style={{ color: 'var(--text-muted)', fontWeight: '600' }}>
            {language === 'ta' ? 'பொருத்தமான பேருந்துகள் எதுவும் கிடைக்கவில்லை.' : `No buses found matching "${query}".`}
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.25rem'
        }}>
          {buses.map((bus) => (
            <div key={bus.busId} className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  fontSize: '1.3rem',
                  fontWeight: '800',
                  padding: '0.25rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  letterSpacing: '0.02em'
                }}>
                  {bus.busNumber}
                </span>

                <span className="badge badge-primary">
                  {bus.serviceType || 'Ordinary'}
                </span>
              </div>

              <div style={{ fontWeight: '700', fontSize: '1.05rem', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                {bus.routeName}
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Direction: {bus.direction || 'UP'} &bull; {bus.schedulesCount || 0} Scheduled Departures
              </div>

              <Link
                to={`/routes/${bus.routeId}`}
                className="btn btn-outline btn-sm"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <span>{t('viewRoute')}</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default BusSearchPage;
