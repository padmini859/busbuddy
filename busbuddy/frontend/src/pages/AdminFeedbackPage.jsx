import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Check, Eye, Trash2, Clock, CheckCircle } from 'lucide-react';
import { adminService } from '../services/adminService';
import ConfirmModal from '../components/ConfirmModal';
import Alert from '../components/Alert';

const AdminFeedbackPage = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [processing, setProcessing] = useState(false);

  const loadFeedback = async (filter) => {
    setLoading(true);
    try {
      const data = await adminService.getAllFeedback(filter || null);
      setFeedbackList(data || []);
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Failed to load feedback' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedback(statusFilter);
  }, [statusFilter]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await adminService.updateFeedbackStatus(id, newStatus);
      setAlert({ type: 'success', message: `Feedback status changed to ${newStatus}` });
      loadFeedback(statusFilter);
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Error updating status' });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    setProcessing(true);
    try {
      await adminService.deleteFeedback(itemToDelete.feedbackId);
      setAlert({ type: 'success', message: 'Feedback entry deleted' });
      setDeleteModalOpen(false);
      setItemToDelete(null);
      loadFeedback(statusFilter);
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Error deleting feedback' });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', minHeight: 'calc(100vh - 150px)' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <Link to="/admin/dashboard" style={{ fontSize: '0.85rem', color: 'var(--secondary)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.5rem', fontWeight: '600' }}>
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary)' }}>
            User Feedback & Correction Moderation
          </h1>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { label: 'All', val: '' },
            { label: 'Pending', val: 'PENDING' },
            { label: 'Reviewed', val: 'REVIEWED' },
            { label: 'Resolved', val: 'RESOLVED' },
          ].map((tab) => (
            <button
              key={tab.label}
              onClick={() => setStatusFilter(tab.val)}
              className={`btn btn-sm ${statusFilter === tab.val ? 'btn-primary' : 'btn-outline'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      {/* Feedback List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          Loading user feedback reports...
        </div>
      ) : feedbackList.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          No feedback reports match the selected filter.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {feedbackList.map((fb) => (
            <div key={fb.feedbackId} className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: '800',
                      padding: '0.2rem 0.55rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor:
                        fb.status === 'PENDING'
                          ? '#FEF3C7'
                          : fb.status === 'REVIEWED'
                          ? '#DBEAFE'
                          : '#DCFCE7',
                      color:
                        fb.status === 'PENDING'
                          ? '#B45309'
                          : fb.status === 'REVIEWED'
                          ? '#1D4ED8'
                          : '#15803D',
                    }}>
                      {fb.status}
                    </span>

                    <span style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-main)' }}>
                      {fb.category}
                    </span>
                  </div>

                  {fb.routeName && (
                    <div style={{ fontSize: '0.82rem', color: 'var(--secondary)', fontWeight: '600' }}>
                      Associated Route: {fb.routeName}
                    </div>
                  )}
                </div>

                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {fb.createdAt ? new Date(fb.createdAt).toLocaleString() : ''}
                </div>
              </div>

              {/* Description */}
              <p style={{ fontSize: '0.92rem', color: '#334155', lineHeight: '1.6', marginBottom: '1rem', whiteSpace: 'pre-wrap' }}>
                {fb.description}
              </p>

              {/* Footer row: Contact info & Moderation actions */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                borderTop: '1px solid var(--border)',
                paddingTop: '0.85rem'
              }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Contact: <strong style={{ color: 'var(--text-main)' }}>{fb.contactInfo || 'Not provided'}</strong>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {fb.status !== 'REVIEWED' && (
                    <button
                      onClick={() => handleUpdateStatus(fb.feedbackId, 'REVIEWED')}
                      className="btn btn-outline btn-sm"
                      title="Mark as Reviewed"
                    >
                      <Eye size={14} />
                      <span>Review</span>
                    </button>
                  )}

                  {fb.status !== 'RESOLVED' && (
                    <button
                      onClick={() => handleUpdateStatus(fb.feedbackId, 'RESOLVED')}
                      className="btn btn-outline btn-sm"
                      style={{ color: 'var(--success)', borderColor: '#BBF7D0' }}
                      title="Mark as Resolved"
                    >
                      <Check size={14} />
                      <span>Resolve</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setItemToDelete(fb);
                      setDeleteModalOpen(true);
                    }}
                    className="btn btn-outline btn-sm"
                    style={{ color: 'var(--danger)', borderColor: 'var(--danger-bg)' }}
                    title="Delete Record"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Feedback Record"
        message="Are you sure you want to permanently delete this user feedback report?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        confirmText="Delete Report"
        loading={processing}
      />

    </div>
  );
};

export default AdminFeedbackPage;
