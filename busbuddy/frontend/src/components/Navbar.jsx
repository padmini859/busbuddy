import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bus, MapPin, Route, MessageSquare, Shield, LogOut, Menu, X, Languages } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: t('appName'), icon: Bus },
    { to: '/bus-search', label: t('busDirectory'), icon: Route },
    { to: '/all-stops', label: t('allStops'), icon: MapPin },
    { to: '/route-map', label: t('routeMap'), icon: MapPin },
    { to: '/feedback', label: t('feedback'), icon: MessageSquare },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header style={{
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>
        
        {/* Brand */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            backgroundColor: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent)'
          }}>
            <Bus size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '-0.02em' }}>
                BusBuddy
              </span>
              <span style={{
                fontSize: '0.65rem',
                fontWeight: '700',
                backgroundColor: '#EFF6FF',
                color: 'var(--secondary)',
                padding: '0.15rem 0.5rem',
                borderRadius: '999px',
                border: '1px solid #BFDBFE'
              }}>
                Tamil Nadu
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '500' }}>
              {language === 'ta' ? 'ஸ்மார்ட் உள்ளூர் பேருந்து வழிகாட்டி' : 'Smart Local Transit'}
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: 'none', gap: '0.5rem', alignItems: 'center' }} className="desktop-nav">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.9rem',
                  fontWeight: active ? '700' : '500',
                  color: active ? 'var(--secondary)' : 'var(--text-main)',
                  backgroundColor: active ? '#EFF6FF' : 'transparent',
                  transition: 'background 0.2s',
                }}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions (Language Toggle & Admin) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          
          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="btn btn-outline btn-sm"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontWeight: '700',
              padding: '0.45rem 0.75rem',
              borderColor: 'var(--border)'
            }}
            title="Switch Language / மொழியை மாற்றுக"
          >
            <Languages size={16} color="var(--secondary)" />
            <span>{language === 'en' ? 'தமிழ்' : 'English'}</span>
          </button>

          {/* Admin Link / Status */}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/admin/dashboard" className="btn btn-primary btn-sm">
                <Shield size={15} />
                <span>Admin</span>
              </Link>
              <button onClick={handleLogout} className="btn btn-outline btn-sm" title="Logout">
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <Link to="/admin/login" className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Shield size={15} />
              <span className="admin-btn-text">{t('adminPortal')}</span>
            </Link>
          )}

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn btn-outline btn-sm mobile-toggle"
            style={{ display: 'none', padding: '0.4rem' }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid var(--border)',
          padding: '1rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}>
          {navLinks.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0',
                borderBottom: '1px solid #F1F5F9',
                fontWeight: isActive(item.to) ? '700' : '500',
                color: isActive(item.to) ? 'var(--secondary)' : 'var(--text-main)',
              }}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (min-width: 900px) {
          .desktop-nav {
            display: flex !important;
          }
        }
        @media (max-width: 899px) {
          .mobile-toggle {
            display: inline-flex !important;
          }
          .admin-btn-text {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
