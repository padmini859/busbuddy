import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, Compass, Route, ExternalLink } from 'lucide-react';
import { stopService } from '../services/stopService';
import { useLanguage } from '../contexts/LanguageContext';

const AllStopsPage = () => {
  const { t, language, getStopName } = useLanguage();
  const navigate = useNavigate();

  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchStops = async () => {
      setLoading(true);
      try {
        const data = await stopService.getAllStops();
        setStops(data || []);
      } catch (err) {
        console.error('Error fetching stops:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStops();
  }, []);

  const filteredStops = stops.filter((s) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (s.stopNameEn && s.stopNameEn.toLowerCase().includes(q)) ||
      (s.stopNameTa && s.stopNameTa.toLowerCase().includes(q))
    );
  });

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', minHeight: 'calc(100vh - 150px)' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '0.4rem' }}>
            {t('allStops')}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            {language === 'ta'
              ? 'கோயம்புத்தூர் நகரத்தில் உள்ள அனைத்து பேருந்து நிறுத்தங்களின் அடைவு.'
              : 'Complete directory of local bus stops across Coimbatore, Tamil Nadu.'}
          </p>
        </div>

        {/* Search Bar */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
          <Search
            size={18}
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
          />
          <input
            type="text"
            className="form-control"
            placeholder={language === 'ta' ? 'நிறுத்தத்தைத் தேடுங்கள்...' : 'Filter stops by name...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '38px' }}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
          {t('loading')}
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>
            Showing {filteredStops.length} of {stops.length} stops
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1rem'
          }}>
            {filteredStops.map((stop) => (
              <div key={stop.stopId} className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      backgroundColor: '#EFF6FF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--secondary)',
                      flexShrink: 0
                    }}>
                      <MapPin size={18} />
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-main)' }}>
                        {getStopName(stop)}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {language === 'ta' ? stop.stopNameEn : stop.stopNameTa}
                      </div>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: 'var(--bg-main)',
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    marginBottom: '1rem'
                  }}>
                    <span>GPS: {Number(stop.latitude).toFixed(4)}, {Number(stop.longitude).toFixed(4)}</span>
                    <span style={{ fontWeight: '700', color: 'var(--secondary)' }}>
                      {stop.servingRoutesCount || 0} Routes
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => navigate(`/route-map?stopId=${stop.stopId}`)}
                    className="btn btn-outline btn-sm"
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    <Compass size={14} />
                    <span>View on Map</span>
                  </button>

                  <button
                    onClick={() => navigate(`/?from=${stop.stopId}`)}
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    <span>Depart Here</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

    </div>
  );
};

export default AllStopsPage;
