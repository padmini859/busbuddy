import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, ArrowLeft, Search, DollarSign, X } from 'lucide-react';
import { adminService } from '../services/adminService';
import { routeService } from '../services/routeService';
import { stopService } from '../services/stopService';
import ConfirmModal from '../components/ConfirmModal';
import Alert from '../components/Alert';

const AdminFaresPage = () => {
  const [fares, setFares] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [alert, setAlert] = useState(null);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFare, setEditingFare] = useState(null);
  const [formData, setFormData] = useState({
    routeId: '',
    sourceStopId: '',
    destinationStopId: '',
    amount: '',
    fareType: 'Regular',
  });

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [fareToDelete, setFareToDelete] = useState(null);
  const [processing, setProcessing] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [faresData, routesData, stopsData] = await Promise.all([
        adminService.getAllFares(),
        routeService.getAllRoutes(),
        stopService.getAllStops(),
      ]);
      setFares(faresData || []);
      setRoutes(routesData || []);
      setStops(stopsData || []);
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Failed to load fares' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingFare(null);
    setFormData({
      routeId: routes.length > 0 ? routes[0].routeId : '',
      sourceStopId: stops.length > 0 ? stops[0].stopId : '',
      destinationStopId: stops.length > 1 ? stops[1].stopId : '',
      amount: '10.00',
      fareType: 'Regular',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (fare) => {
    setEditingFare(fare);
    setFormData({
      routeId: fare.routeId || '',
      sourceStopId: fare.sourceStopId || '',
      destinationStopId: fare.destinationStopId || '',
      amount: fare.amount || '',
      fareType: fare.fareType || 'Regular',
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (formData.sourceStopId === formData.destinationStopId) {
      setAlert({ type: 'warning', message: 'Source and destination stops must be different.' });
      return;
    }

    setProcessing(true);
    try {
      const payload = {
        routeId: Number(formData.routeId),
        sourceStopId: Number(formData.sourceStopId),
        destinationStopId: Number(formData.destinationStopId),
        amount: parseFloat(formData.amount),
        fareType: formData.fareType,
      };

      if (editingFare) {
        await adminService.updateFare(editingFare.fareId, payload);
        setAlert({ type: 'success', message: 'Fare entry updated successfully' });
      } else {
        await adminService.createFare(payload);
        setAlert({ type: 'success', message: 'Fare entry created successfully' });
      }

      setModalOpen(false);
      loadData();
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Error saving fare entry' });
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!fareToDelete) return;
    setProcessing(true);
    try {
      await adminService.deleteFare(fareToDelete.fareId);
      setAlert({ type: 'success', message: 'Fare removed successfully' });
      setDeleteModalOpen(false);
      setFareToDelete(null);
      loadData();
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Error deleting fare' });
    } finally {
      setProcessing(false);
    }
  };

  const filtered = fares.filter((f) => {
    const q = search.toLowerCase();
    return (
      (f.routeName && f.routeName.toLowerCase().includes(q)) ||
      (f.sourceStopName && f.sourceStopName.toLowerCase().includes(q)) ||
      (f.destinationStopName && f.destinationStopName.toLowerCase().includes(q))
    );
  });

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', minHeight: 'calc(100vh - 150px)' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <Link to="/admin/dashboard" style={{ fontSize: '0.85rem', color: 'var(--secondary)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.5rem', fontWeight: '600' }}>
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary)' }}>
            Fare Stage Management
          </h1>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary">
          <Plus size={16} />
          <span>Add New Fare Stage</span>
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
            placeholder="Search by route or stops..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '36px' }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead style={{ backgroundColor: 'var(--bg-main)', borderBottom: '1px solid var(--border)' }}>
              <tr>
                <th style={{ padding: '0.85rem 1rem', fontWeight: '700', color: 'var(--text-muted)' }}>ID</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: '700', color: 'var(--text-muted)' }}>Route</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: '700', color: 'var(--text-muted)' }}>From Stop</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: '700', color: 'var(--text-muted)' }}>To Stop</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: '700', color: 'var(--text-muted)' }}>Amount</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: '700', color: 'var(--text-muted)' }}>Fare Type</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: '700', color: 'var(--text-muted)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading fare stages...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No fares recorded.</td>
                </tr>
              ) : (
                filtered.map((f) => (
                  <tr key={f.fareId} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: '700' }}>#{f.fareId}</td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: '600' }}>{f.routeName}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>{f.sourceStopName}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>{f.destinationStopName}</td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: '800', color: '#15803D' }}>
                      ₹{f.amount ? Number(f.amount).toFixed(2) : '0.00'}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span className="badge badge-secondary">{f.fareType || 'Regular'}</span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button onClick={() => handleOpenEdit(f)} className="btn btn-outline btn-sm" title="Edit">
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => {
                            setFareToDelete(f);
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
            maxWidth: '480px',
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
              {editingFare ? 'Edit Fare Stage' : 'Add Fare Stage'}
            </h2>

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Route *</label>
                <select
                  className="form-control"
                  value={formData.routeId}
                  onChange={(e) => setFormData({ ...formData, routeId: e.target.value })}
                  required
                >
                  <option value="">-- Select Route --</option>
                  {routes.map((r) => (
                    <option key={r.routeId} value={r.routeId}>
                      {r.routeName} ({r.direction})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">From Stop *</label>
                  <select
                    className="form-control"
                    value={formData.sourceStopId}
                    onChange={(e) => setFormData({ ...formData, sourceStopId: e.target.value })}
                    required
                  >
                    {stops.map((s) => (
                      <option key={s.stopId} value={s.stopId}>
                        {s.stopNameEn}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">To Stop *</label>
                  <select
                    className="form-control"
                    value={formData.destinationStopId}
                    onChange={(e) => setFormData({ ...formData, destinationStopId: e.target.value })}
                    required
                  >
                    {stops.map((s) => (
                      <option key={s.stopId} value={s.stopId}>
                        {s.stopNameEn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Fare Amount (₹) *</label>
                  <input
                    type="number"
                    step="0.50"
                    min="1"
                    className="form-control"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Fare Type</label>
                  <select
                    className="form-control"
                    value={formData.fareType}
                    onChange={(e) => setFormData({ ...formData, fareType: e.target.value })}
                  >
                    <option value="Regular">Regular</option>
                    <option value="Student">Student Concession</option>
                    <option value="Senior Citizen">Senior Citizen</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={processing}>
                  {processing ? 'Saving...' : 'Save Fare'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Fare Stage"
        message={`Are you sure you want to remove the published fare between ${fareToDelete?.sourceStopName} and ${fareToDelete?.destinationStopName}?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteModalOpen(false);
          setFareToDelete(null);
        }}
        confirmText="Delete Fare"
        loading={processing}
      />

    </div>
  );
};

export default AdminFaresPage;
