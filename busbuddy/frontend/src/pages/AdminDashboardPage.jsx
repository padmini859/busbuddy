import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bus, Route, MapPin, Clock, MessageSquare, DollarSign, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { adminService } from '../services/adminService';
import { useLanguage } from '../contexts/LanguageContext';

const AdminDashboardPage = () => {
  const { t, language } = useLanguage();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const data = await adminService.getDashboardStats();
        setStats(data);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <div style={{ color: 'var(--secondary)', fontSize: '1.2rem', fontWeight: '700' }}>{t('loading')}</div>
      </div>
    );
  }

  const statCards = [
    { label: t('totalBuses'), value: stats?.totalBuses || 0, icon: Bus, link: '/admin/buses', color: '#2563EB', bg: '#EFF6FF' },
    { label: t('totalRoutes'), value: stats?.totalRoutes || 0, icon: Route, link: '/admin/routes', color: '#16A34A', bg: '#DCFCE7' },
    { label: t('totalStops'), value: stats?.totalStops || 0, icon: MapPin, link: '/admin/stops', color: '#D97706', bg: '#FEF3C7' },
    { label: t('totalSchedules'), value: stats?.totalSchedules || 0, icon: Clock, link: '/admin/schedules', color: '#9333EA', bg: '#F3E8FF' },
    { label: t('pendingFeedback'), value: stats?.pendingFeedbackCount || 0, icon: MessageSquare, link: '/admin/feedback', color: '#DC2626', bg: '#FEE2E2' },
  ];

  const recentFeedback = stats?.recentFeedback || [];

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', minHeight: 'calc(100vh - 150px)' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-primary">
              <ShieldCheck size={12} />
              Transport Authority Control Center
            </span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)' }}>
            {t('adminDashboard')}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            {language === 'ta'
              ? 'கோயம்புத்தூர் போக்குவரத்து தரவுத்தளத்தின் நேரடி புள்ளிவிவரங்கள் மற்றும் மேலாண்மை தளம்.'
              : 'Real-time overview of Coimbatore transit network, services and user feedback moderation.'}
          </p>
        </div>
      </div>

      {error && (
        <div style={{ backgroundColor: 'var(--danger-bg)', color: '#B91C1C', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {/* KPI Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2.5rem'
      }}>
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Link key={i} to={card.link} className="card" style={{ padding: '1.25rem', textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  backgroundColor: card.bg,
                  color: card.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={22} />
                </div>
                <ArrowRight size={16} color="var(--text-light)" />
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                {card.value}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                {card.label}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Main Management Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.8fr 1fr',
        gap: '2rem',
        alignItems: 'start'
      }} className="admin-grid">
        
        {/* Quick Management Links */}
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '1rem' }}>
            Data Management Modules
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '1rem'
          }}>
            <Link to="/admin/stops" className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MapPin size={20} />
              </div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-main)' }}>{t('manageStops')}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Add, edit GPS coords, bilingual names</div>
              </div>
            </Link>

            <Link to="/admin/routes" className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Route size={20} />
              </div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-main)' }}>{t('manageRoutes')}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Configure directional routes & stop sequence</div>
              </div>
            </Link>

            <Link to="/admin/buses" className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bus size={20} />
              </div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-main)' }}>{t('manageBuses')}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Register bus numbers & service types</div>
              </div>
            </Link>

            <Link to="/admin/schedules" className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#F3E8FF', color: '#9333EA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={20} />
              </div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-main)' }}>{t('manageSchedules')}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Maintain timetables & departures</div>
              </div>
            </Link>

            <Link to="/admin/fares" className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <DollarSign size={20} />
              </div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-main)' }}>{t('manageFares')}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Published fare stage amounts</div>
              </div>
            </Link>

            <Link to="/admin/feedback" className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#FEE2E2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MessageSquare size={20} />
              </div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-main)' }}>{t('manageFeedback')}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Review and resolve passenger reports</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Feedback Feed */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--primary)' }}>
              {t('recentFeedback')}
            </h3>
            <Link to="/admin/feedback" style={{ fontSize: '0.8rem', color: 'var(--secondary)', fontWeight: '700' }}>
              View All &rarr;
            </Link>
          </div>

          {recentFeedback.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>No recent feedback submissions.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {recentFeedback.map((fb) => (
                <div
                  key={fb.feedbackId}
                  style={{
                    backgroundColor: 'var(--bg-main)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.85rem',
                    border: '1px solid var(--border)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: '700',
                      backgroundColor: fb.status === 'PENDING' ? '#FEF3C7' : '#DCFCE7',
                      color: fb.status === 'PENDING' ? '#B45309' : '#15803D',
                      padding: '0.15rem 0.45rem',
                      borderRadius: 'var(--radius-sm)'
                    }}>
                      {fb.status}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>
                      {fb.createdAt ? new Date(fb.createdAt).toLocaleDateString() : ''}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                    {fb.category}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                    {fb.description.length > 70 ? fb.description.slice(0, 70) + '...' : fb.description}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .admin-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboardPage;
