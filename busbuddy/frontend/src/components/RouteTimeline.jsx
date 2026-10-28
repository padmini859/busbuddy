import React from 'react';
import { MapPin, Navigation, ArrowDown, Flag } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const RouteTimeline = ({ stops = [], transferStopId = null, compact = false }) => {
  const { language, getStopName } = useLanguage();

  if (!stops || stops.length === 0) {
    return <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No stops defined for this route.</div>;
  }

  return (
    <div style={{ position: 'relative', paddingLeft: '1.75rem', margin: '1rem 0' }}>
      {/* Continuous Timeline Line */}
      <div
        style={{
          position: 'absolute',
          left: '9px',
          top: '12px',
          bottom: '12px',
          width: '3px',
          backgroundColor: '#CBD5E1',
          zIndex: 1,
        }}
      />

      {stops.map((stop, index) => {
        const isFirst = index === 0;
        const isLast = index === stops.length - 1;
        const isTransfer = transferStopId && stop.stopId === transferStopId;

        return (
          <div
            key={stop.stopId || index}
            style={{
              position: 'relative',
              marginBottom: isLast ? 0 : (compact ? '1rem' : '1.5rem'),
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              zIndex: 2,
            }}
          >
            {/* Timeline Bullet Node */}
            <div
              style={{
                position: 'absolute',
                left: '-1.75rem',
                top: '2px',
                width: isFirst || isLast || isTransfer ? '22px' : '16px',
                height: isFirst || isLast || isTransfer ? '22px' : '16px',
                marginLeft: isFirst || isLast || isTransfer ? '-1px' : '2px',
                borderRadius: '50%',
                backgroundColor: isTransfer
                  ? '#F59E0B'
                  : isFirst
                  ? '#16A34A'
                  : isLast
                  ? '#DC2626'
                  : '#FFFFFF',
                border: isFirst || isLast || isTransfer ? '3px solid #FFFFFF' : '3px solid #2563EB',
                boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            />

            {/* Stop Information */}
            <div style={{ width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span
                  style={{
                    fontWeight: isFirst || isLast || isTransfer ? '700' : '600',
                    fontSize: isFirst || isLast ? '1rem' : '0.92rem',
                    color: isTransfer ? '#B45309' : 'var(--text-main)',
                  }}
                >
                  {getStopName(stop)}
                </span>

                {isFirst && (
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: '700',
                      backgroundColor: '#DCFCE7',
                      color: '#15803D',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '999px',
                    }}
                  >
                    {language === 'ta' ? 'புறப்படும் இடம்' : 'Boarding'}
                  </span>
                )}

                {isLast && (
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: '700',
                      backgroundColor: '#FEE2E2',
                      color: '#B91C1C',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '999px',
                    }}
                  >
                    {language === 'ta' ? 'இலக்கு' : 'Destination'}
                  </span>
                )}

                {isTransfer && (
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: '700',
                      backgroundColor: '#FEF3C7',
                      color: '#B45309',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '999px',
                    }}
                  >
                    {language === 'ta' ? 'பேருந்து மாறும் நிறுத்தம்' : 'Transfer Stop'}
                  </span>
                )}
              </div>

              {/* Bilingual Subtitle */}
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {language === 'ta' ? stop.stopNameEn : stop.stopNameTa}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RouteTimeline;
