import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, ArrowLeft, Search, MapPin, X } from 'lucide-react';
import { stopService } from '../services/stopService';
import { adminService } from '../services/adminService';
import ConfirmModal from '../components/ConfirmModal';
import Alert from '../components/Alert';

const AdminStopsPage = () => {
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [alert, setAlert] = useState(null);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStop, setEditingStop] = useState(null);
  const [formData, setFormData] = useState({
    cityId: 1,
    stopNameEn: '',
    stopNameTa: '',
    latitude: '',
    longitude: '',
    active: true,
  });

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [stopToDelete, setStopToDelete] = useState(null);
  const [processing, setProcessing] = useState(false);

  const loadStops = async () => {
    setLoading(true);
    try {
      const data = await stopService.getAllStops();
      setStops(data || []);
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Failed to load stops' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStops();
  }, []);

  const handleOpenAdd = () => {
    setEditingStop(null);
    setFormData({
      cityId: 1,
      stopNameEn: '',
      stopNameTa: '',
      latitude: '',
      longitude: '',
      active: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (stop) => {
    setEditingStop(stop);
    setFormData({
      cityId: stop.cityId || 1,
      stopNameEn: stop.stopNameEn || '',
      stopNameTa: stop.stopNameTa || '',
      latitude: stop.latitude || '',
      longitude: stop.longitude || '',
      active: stop.active !== false,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      const payload = {
        cityId: Number(formData.cityId),
        stopNameEn: formData.stopNameEn.trim(),
        stopNameTa: formData.stopNameTa.trim(),
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        active: formData.active,
      };

      if (editingStop) {
        await adminService.updateStop(editingStop.stopId, payload);
        setAlert({ type: 'success', message: 'Bus stop updated successfully' });
      } else {
        await adminService.createStop(payload);
        setAlert({ type: 'success', message: 'New bus stop registered successfully' });
      }

      setModalOpen(false);
      loadStops();
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Error saving stop' });
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!stopToDelete) return;
    setProcessing(true);
    try {
      await adminService.deleteStop(stopToDelete.stopId);
      setAlert({ type: 'success', message: 'Bus stop removed successfully' });
      setDeleteModalOpen(false);
      setStopToDelete(null);
      loadStops();
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Error deleting stop' });
    } finally {
      setProcessing(false);
    }
  };

  const filtered = stops.filter((s) => {
    const q = search.toLowerCase();
    return (
      (s.stopNameEn && s.stopNameEn.toLowerCase().includes(q)) ||
      (s.stopNameTa && s.stopNameTa.toLowerCase().includes(q))
    );
  });

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', minHeight: 'calc(100vh - 150px)' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <Link to="/admin/dashboard" style={{ fontSize: '0.85rem', color: 'var(--secondary)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.5rem', fontWeight: '600' }}>
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary)' }}>
            Bus Stop Management
          </h1>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary">
          <Plus size={16} />
          <span>Add New Stop</span>
        </button>
      </div>

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      {/* Filter Bar */}
      <div className="card" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', maxWidth: '350px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-control"
            placeholder="Search stops..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '36px' }}
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead style={{ backgroundColor: 'var(--bg-main)', borderBottom: '1px solid var(--border)' }}>
              <tr>
                <th style={{ padding: '0.85rem 1rem', fontWeight: '700', color: 'var(--text-muted)' }}>ID</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: '700', color: 'var(--text-muted)' }}>English Name</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: '700', color: 'var(--text-muted)' }}>Tamil Name</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: '700', color: 'var(--text-muted)' }}>Coordinates (Lat, Lng)</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: '700', color: 'var(--text-muted)' }}>Serving Routes</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: '700', color: 'var(--text-muted)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading bus stops...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No bus stops found.</td>
                </tr>
              ) : (
                filtered.map((stop) => (
                  <tr key={stop.stopId} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: '700' }}>#{stop.stopId}</td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: '600', color: 'var(--text-main)' }}>{stop.stopNameEn}</td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>{stop.stopNameTa}</td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {Number(stop.latitude).toFixed(4)}, {Number(stop.longitude).toFixed(4)}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span className="badge badge-secondary">{stop.servingRoutesCount || 0} routes</span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button onClick={() => handleOpenEdit(stop)} className="btn btn-outline btn-sm" title="Edit">
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => {
                            setStopToDelete(stop);
                            setDeleteModalOpen(true);
                          }}
                          className="btn btn-outline btn-sm"
                          style={{ color: 'var(--danger)', borderColor: 'var(--danger-bg)' }}
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '1rem',
          backdropFilter: 'blur(2px)'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-lg)',
            maxWidth: '500px',
            width: '100%',
            padding: '1.75rem',
            boxShadow: 'var(--shadow-lg)',
            position: 'relative'
          }}>
            <button
              onClick={() => setModalOpen(false)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '1.25rem' }}>
              {editingStop ? 'Edit Bus Stop' : 'Register New Bus Stop'}
            </h2>

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Stop Name (English) *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.stopNameEn}
                  onChange={(e) => setFormData({ ...formData, stopNameEn: e.target.value })}
                  placeholder="e.g. Gandhipuram Central"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Stop Name (Tamil) *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.stopNameTa}
                  onChange={(e) => setFormData({ ...formData, stopNameTa: e.target.value })}
                  placeholder="e.g. காந்திபுரம் மத்திய பேருந்து நிலையம்"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Latitude *</label>
                  <input
                    type="number"
                    step="0.0000001"
                    className="form-control"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    placeholder="11.0168"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Longitude *</label>
                  <input
                    type="number"
                    step="0.0000001"
                    className="form-control"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    placeholder="76.9678"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={processing}>
                  {processing ? 'Saving...' : 'Save Stop'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Bus Stop"
        message={`Are you sure you want to delete stop "${stopToDelete?.stopNameEn}"? This may impact routes serving this stop.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteModalOpen(false);
          setStopToDelete(null);
        }}
        confirmText="Delete Stop"
        loading={processing}
      />

    </div>
  );
};

export default AdminStopsPage;
