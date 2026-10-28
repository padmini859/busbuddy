import React from 'react';
import { Link } from 'react-router-dom';
import { Bus, Heart, ShieldCheck, MapPin, Info } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Footer = () => {
  const { t, language } = useLanguage();

  return (
    <footer style={{
      backgroundColor: '#0F172A',
      color: '#94A3B8',
      paddingTop: '3.5rem',
      paddingBottom: '2rem',
      marginTop: 'auto',
      borderTop: '1px solid #1E293B'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2.5rem',
          marginBottom: '2.5rem'
        }}>
          
          {/* Brand & Mission */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent)'
              }}>
                <Bus size={20} />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#FFFFFF' }}>BusBuddy</span>
            </div>
            <p style={{ fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '1rem', color: '#CBD5E1' }}>
              {language === 'ta'
                ? 'தமிழ்நாட்டின் உள்ளூர் பேருந்து வழிகள், நிறுத்தங்கள் மற்றும் இணைப்புப் பேருந்துகளை கண்டறிய உதவும் நவீன தகவல் தளம்.'
                : 'Smart public transit platform providing local bus routes, intermediate stops, schedules, and 1-transfer connections across Tamil Nadu.'}
            </p>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: '#1E293B',
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              color: '#38BDF8'
            }}>
              <MapPin size={13} />
              <span>Pilot City: Coimbatore, Tamil Nadu</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '0.95rem', fontWeight: '700', marginBottom: '1rem', letterSpacing: '0.02em' }}>
              {language === 'ta' ? 'விரைவு இணைப்புகள்' : 'Quick Navigation'}
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem' }}>
              <li><Link to="/" style={{ color: '#94A3B8', transition: 'color 0.2s' }}>{t('appName')}</Link></li>
              <li><Link to="/bus-search" style={{ color: '#94A3B8' }}>{t('busDirectory')}</Link></li>
              <li><Link to="/all-stops" style={{ color: '#94A3B8' }}>{t('allStops')}</Link></li>
              <li><Link to="/route-map" style={{ color: '#94A3B8' }}>{t('routeMap')}</Link></li>
              <li><Link to="/feedback" style={{ color: '#94A3B8' }}>{t('feedback')}</Link></li>
            </ul>
          </div>

          {/* Academic Project & Disclaimer */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '0.95rem', fontWeight: '700', marginBottom: '1rem', letterSpacing: '0.02em' }}>
              {language === 'ta' ? 'கல்லூரி திட்ட விவரம்' : 'Mini Project Information'}
            </h4>
            <div style={{
              backgroundColor: '#1E293B',
              border: '1px solid #334155',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem',
              fontSize: '0.8rem',
              lineHeight: '1.5'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent)', fontWeight: '700', marginBottom: '0.3rem' }}>
                <Info size={14} />
                <span>Academic Demo Architecture</span>
              </div>
              <p style={{ color: '#94A3B8' }}>
                Full Stack Java 21 + Spring Boot 3 + MySQL 8 + React. All timetables and bus service links are labeled DEMO DATA for project simulation.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid #1E293B',
          paddingTop: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.8rem',
          color: '#64748B'
        }}>
          <div>
            &copy; {new Date().getFullYear()} BusBuddy — Smart Local Bus Information System. College Full Stack Mini Project.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span>Built with Java Spring Boot & React for Tamil Nadu Transit</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
