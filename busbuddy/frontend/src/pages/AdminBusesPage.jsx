import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, ArrowLeft, Search, Bus, X } from 'lucide-react';
import { busService } from '../services/busService';
import { routeService } from '../services/routeService';
import { adminService } from '../services/adminService';
import ConfirmModal from '../components/ConfirmModal';
import Alert from '../components/Alert';

const AdminBusesPage = () => {
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [alert, setAlert] = useState(null);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBus, setEditingBus] = useState(null);
  const [formData, setFormData] = useState({
    busNumber: '',
    routeId: '',
    serviceType: 'Ordinary',
    active: true,
  });

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [busToDelete, setBusToDelete] = useState(null);
  const [processing, setProcessing] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [busesData, routesData] = await Promise.all([
        busService.getAllBuses(),
        routeService.getAllRoutes(),
      ]);
      setBuses(busesData || []);
      setRoutes(routesData || []);
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Failed to load buses' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingBus(null);
    setFormData({
      busNumber: '',
      routeId: routes.length > 0 ? routes[0].routeId : '',
      serviceType: 'Ordinary',
      active: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (bus) => {
    setEditingBus(bus);
    setFormData({
      busNumber: bus.busNumber || '',
      routeId: bus.routeId || '',
      serviceType: bus.serviceType || 'Ordinary',
      active: bus.active !== false,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      const payload = {
        busNumber: formData.busNumber.trim(),
        routeId: Number(formData.routeId),
        serviceType: formData.serviceType,
        active: formData.active,
      };

      if (editingBus) {
        await adminService.updateBus(editingBus.busId, payload);
        setAlert({ type: 'success', message: 'Bus updated successfully' });
      } else {
        await adminService.createBus(payload);
        setAlert({ type: 'success', message: 'Bus registered successfully' });
      }

      setModalOpen(false);
      loadData();
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Error saving bus' });
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!busToDelete) return;
    setProcessing(true);
    try {
      await adminService.deleteBus(busToDelete.busId);
      setAlert({ type: 'success', message: 'Bus removed successfully' });
      setDeleteModalOpen(false);
      setBusToDelete(null);
      loadData();
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Error deleting bus' });
    } finally {
      setProcessing(false);
    }
  };

  const filtered = buses.filter((b) => {
    const q = search.toLowerCase();
    return (
      (b.busNumber && b.busNumber.toLowerCase().includes(q)) ||
      (b.routeName && b.routeName.toLowerCase().includes(q))
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
            Bus Fleet Management
          </h1>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary">
          <Plus size={16} />
          <span>Register New Bus</span>
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
            placeholder="Search bus number or route..."
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
                <th style={{ padding: '0.85rem 1rem', fontWeight: '700', color: 'var(--text-muted)' }}>Bus Number</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: '700', color: 'var(--text-muted)' }}>Assigned Route</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: '700', color: 'var(--text-muted)' }}>Service Type</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: '700', color: 'var(--text-muted)' }}>Schedules</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: '700', color: 'var(--text-muted)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading bus fleet...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No buses found.</td>
                </tr>
              ) : (
                filtered.map((bus) => (
                  <tr key={bus.busId} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: '700' }}>#{bus.busId}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{
                        backgroundColor: 'var(--primary)',
                        color: '#FFFFFF',
                        fontWeight: '800',
                        padding: '0.2rem 0.6rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.9rem'
                      }}>
                        {bus.busNumber}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: '600' }}>
                      {bus.routeName} ({bus.direction})
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span className="badge badge-secondary">{bus.serviceType || 'Ordinary'}</span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      {bus.schedulesCount || 0} departures
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button onClick={() => handleOpenEdit(bus)} className="btn btn-outline btn-sm" title="Edit">
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => {
                            setBusToDelete(bus);
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
              {editingBus ? 'Edit Bus' : 'Register Bus'}
            </h2>

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Bus Number *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.busNumber}
                  onChange={(e) => setFormData({ ...formData, busNumber: e.target.value })}
                  placeholder="e.g. 11A, 70, 90A"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Assigned Route *</label>
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

              <div className="form-group">
                <label className="form-label">Service Type *</label>
                <select
                  className="form-control"
                  value={formData.serviceType}
                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                >
                  <option value="Ordinary">Ordinary</option>
                  <option value="Express">Express</option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Low Floor AC">Low Floor AC</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={processing}>
                  {processing ? 'Saving...' : 'Save Bus'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Bus"
        message={`Are you sure you want to remove bus "${busToDelete?.busNumber}"?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteModalOpen(false);
          setBusToDelete(null);
        }}
        confirmText="Delete Bus"
        loading={processing}
      />

    </div>
  );
};

export default AdminBusesPage;
