import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import { feedbackService } from '../services/feedbackService';
import { routeService } from '../services/routeService';
import { useLanguage } from '../contexts/LanguageContext';

const FeedbackPage = () => {
  const { t, language } = useLanguage();

  const [routes, setRoutes] = useState([]);
  const [formData, setFormData] = useState({
    routeId: '',
    category: 'Incorrect route',
    description: '',
    contactInfo: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    routeService.getAllRoutes().then((data) => setRoutes(data || [])).catch(() => {});
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description.trim()) {
      setErrorMessage(language === 'ta' ? 'விளக்கத்தை உள்ளிடவும்' : 'Please provide details in the description field');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    try {
      await feedbackService.submitFeedback({
        routeId: formData.routeId ? Number(formData.routeId) : null,
        category: formData.category,
        description: formData.description.trim(),
        contactInfo: formData.contactInfo.trim(),
      });

      setSuccessMessage(t('successFeedback'));
      setFormData({
        routeId: '',
        category: 'Incorrect route',
        description: '',
        contactInfo: '',
      });
    } catch (err) {
      setErrorMessage(err.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', minHeight: 'calc(100vh - 150px)' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '14px',
            backgroundColor: '#EFF6FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--secondary)',
            margin: '0 auto 1rem'
          }}>
            <MessageSquare size={26} />
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '0.5rem' }}>
            {t('feedbackTitle')}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
            {t('feedbackDesc')}
          </p>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div style={{
            backgroundColor: 'var(--success-bg)',
            border: '1px solid #BBF7D0',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            marginBottom: '1.5rem',
            color: '#15803D',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            fontSize: '0.92rem'
          }}>
            <CheckCircle2 size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: '700' }}>Submission Successful</div>
              <div>{successMessage}</div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div style={{
            backgroundColor: 'var(--danger-bg)',
            border: '1px solid #FECACA',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            marginBottom: '1.5rem',
            color: '#B91C1C',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '0.92rem'
          }}>
            <AlertCircle size={20} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Card */}
        <div className="card" style={{ padding: '2rem' }}>
          <form onSubmit={handleSubmit}>
            
            {/* Route Association */}
            <div className="form-group">
              <label htmlFor="routeId" className="form-label">
                {language === 'ta' ? 'தொடர்புடைய வழித்தடம் (விருப்பத்தேர்வு)' : 'Related Route (Optional)'}
              </label>
              <select
                id="routeId"
                name="routeId"
                className="form-control"
                value={formData.routeId}
                onChange={handleChange}
              >
                <option value="">-- General / City Wide Feedback --</option>
                {routes.map((r) => (
                  <option key={r.routeId} value={r.routeId}>
                    {r.routeName} ({r.direction})
                  </option>
                ))}
              </select>
            </div>

            {/* Category Dropdown */}
            <div className="form-group">
              <label htmlFor="category" className="form-label">
                {t('feedbackCategory')} *
              </label>
              <select
                id="category"
                name="category"
                className="form-control"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="Incorrect route">Incorrect route</option>
                <option value="Incorrect stop">Incorrect stop</option>
                <option value="Incorrect schedule">Incorrect schedule</option>
                <option value="Missing bus">Missing bus</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Description Textarea */}
            <div className="form-group">
              <label htmlFor="description" className="form-label">
                {t('feedbackDescription')} *
              </label>
              <textarea
                id="description"
                name="description"
                className="form-control"
                rows="5"
                placeholder={language === 'ta' ? 'பேருந்து நிறுத்தம், நேரம் அல்லது வழித்தடம் பற்றிய பிழையை விவரிக்கவும்...' : 'Describe what is incorrect or what information needs updating...'}
                value={formData.description}
                onChange={handleChange}
                required
                maxLength="2000"
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                {formData.description.length}/2000 characters
              </span>
            </div>

            {/* Optional Contact Info */}
            <div className="form-group">
              <label htmlFor="contactInfo" className="form-label">
                {t('contactInfo')}
              </label>
              <input
                id="contactInfo"
                type="text"
                name="contactInfo"
                className="form-control"
                placeholder="passenger@example.com or +91 98765 43210"
                value={formData.contactInfo}
                onChange={handleChange}
                maxLength="150"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '0.5rem', fontWeight: '700' }}
              disabled={loading}
            >
              <Send size={18} />
              <span>{loading ? 'Submitting Feedback...' : t('submitBtn')}</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default FeedbackPage;
