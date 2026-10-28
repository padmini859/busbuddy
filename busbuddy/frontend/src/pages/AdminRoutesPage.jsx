import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, ArrowLeft, Search, Route as RouteIcon, X, MoveUp, MoveDown } from 'lucide-react';
import { routeService } from '../services/routeService';
import { stopService } from '../services/stopService';
import { adminService } from '../services/adminService';
import ConfirmModal from '../components/ConfirmModal';
import Alert from '../components/Alert';

const AdminRoutesPage = () => {
  const [routes, setRoutes] = useState([]);
  const [availableStops, setAvailableStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [alert, setAlert] = useState(null);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRouteId, setEditingRouteId] = useState(null);
  const [formData, setFormData] = useState({
    cityId: 1,
    routeName: '',
    direction: 'UP',
    active: true,
    stopIds: [],
  });

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [routeToDelete, setRouteToDelete] = useState(null);
  const [processing, setProcessing] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [routesData, stopsData] = await Promise.all([
        routeService.getAllRoutes(),
        stopService.getAllStops(),
      ]);
      setRoutes(routesData || []);
      setAvailableStops(stopsData || []);
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Failed to load routes' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingRouteId(null);
    setFormData({
      cityId: 1,
      routeName: '',
      direction: 'UP',
      active: true,
      stopIds: [],
    });
    setModalOpen(true);
  };

  const handleOpenEdit = async (route) => {
    setEditingRouteId(route.routeId);
    try {
      const detail = await routeService.getRouteById(route.routeId);
      setFormData({
        cityId: detail.cityId || 1,
        routeName: detail.routeName || '',
        direction: detail.direction || 'UP',
        active: detail.active !== false,
        stopIds: (detail.stops || []).map((s) => s.stopId),
      });
      setModalOpen(true);
    } catch (err) {
      setAlert({ type: 'error', message: 'Failed to load route details for editing' });
    }
  };

  const handleAddStopToSequence = (stopId) => {
    if (!stopId) return;
    const numId = Number(stopId);
    if (!formData.stopIds.includes(numId)) {
      setFormData({ ...formData, stopIds: [...formData.stopIds, numId] });
    }
  };

  const handleRemoveStopFromSequence = (index) => {
    const updated = [...formData.stopIds];
    updated.splice(index, 1);
    setFormData({ ...formData, stopIds: updated });
  };

  const handleMoveStop = (index, dir) => {
    const updated = [...formData.stopIds];
    const target = index + dir;
    if (target < 0 || target >= updated.length) return;
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    setFormData({ ...formData, stopIds: updated });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (formData.stopIds.length < 2) {
      setAlert({ type: 'warning', message: 'A route requires at least 2 ordered stops (starting and ending terminus).' });
      return;
    }

    setProcessing(true);
    try {
      const payload = {
        cityId: Number(formData.cityId),
        routeName: formData.routeName.trim(),
        direction: formData.direction.trim(),
        active: formData.active,
        stopIds: formData.stopIds,
      };

      if (editingRouteId) {
        await adminService.updateRoute(editingRouteId, payload);
        setAlert({ type: 'success', message: 'Route updated successfully' });
      } else {
        await adminService.createRoute(payload);
        setAlert({ type: 'success', message: 'Route created successfully' });
      }

      setModalOpen(false);
      loadData();
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Error saving route' });
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!routeToDelete) return;
    setProcessing(true);
    try {
      await adminService.deleteRoute(routeToDelete.routeId);
      setAlert({ type: 'success', message: 'Route removed successfully' });
      setDeleteModalOpen(false);
      setRouteToDelete(null);
      loadData();
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Error deleting route' });
    } finally {
      setProcessing(false);
    }
  };

  const filtered = routes.filter((r) => {
    const q = search.toLowerCase();
    return (
      (r.routeName && r.routeName.toLowerCase().includes(q)) ||
      (r.direction && r.direction.toLowerCase().includes(q))
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
            Route & Alignment Management
          </h1>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary">
          <Plus size={16} />
          <span>Create New Route</span>
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
            placeholder="Search routes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '36px' }}
          />
        </div>
      </div>

      {/* Routes Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead style={{ backgroundColor: 'var(--bg-main)', borderBottom: '1px solid var(--border)' }}>
              <tr>
                <th style={{ padding: '0.85rem 1rem', fontWeight: '700', color: 'var(--text-muted)' }}>ID</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: '700', color: 'var(--text-muted)' }}>Route Name</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: '700', color: 'var(--text-muted)' }}>Direction</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: '700', color: 'var(--text-muted)' }}>Total Stops</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: '700', color: 'var(--text-muted)' }}>Buses Operating</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: '700', color: 'var(--text-muted)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading routes...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No routes found.</td>
                </tr>
              ) : (
                filtered.map((route) => (
                  <tr key={route.routeId} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: '700' }}>#{route.routeId}</td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: '700', color: 'var(--text-main)' }}>{route.routeName}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span className="badge badge-primary">{route.direction}</span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>{route.totalStops || 0} stops</td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      {(route.busNumbers || []).join(', ') || 'No buses assigned'}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button onClick={() => handleOpenEdit(route)} className="btn btn-outline btn-sm" title="Edit">
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => {
                            setRouteToDelete(route);
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

      {/* Add / Edit Modal with Stop Sequence Ordering */}
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
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
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
              {editingRouteId ? 'Edit Route & Stop Sequence' : 'Create New Route'}
            </h2>

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Route Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.routeName}
                  onChange={(e) => setFormData({ ...formData, routeName: e.target.value })}
                  placeholder="e.g. 11A: Gandhipuram to Ukkadam"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Direction *</label>
                  <select
                    className="form-control"
                    value={formData.direction}
                    onChange={(e) => setFormData({ ...formData, direction: e.target.value })}
                  >
                    <option value="UP">UP (Forward)</option>
                    <option value="DOWN">DOWN (Return)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    className="form-control"
                    value={formData.active ? 'true' : 'false'}
                    onChange={(e) => setFormData({ ...formData, active: e.target.value === 'true' })}
                  >
                    <option value="true">Active Service</option>
                    <option value="false">Inactive / Suspended</option>
                  </select>
                </div>
              </div>

              {/* Stop Sequence Selector */}
              <div style={{ marginTop: '1rem', marginBottom: '1.25rem' }}>
                <label className="form-label">Ordered Stop Sequence ({formData.stopIds.length} stops) *</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <select
                    id="add-stop-select"
                    className="form-control"
                    defaultValue=""
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAddStopToSequence(e.target.value);
                        e.target.value = '';
                      }
                    }}
                  >
                    <option value="">-- Add a bus stop to route sequence --</option>
                    {availableStops.map((s) => (
                      <option key={s.stopId} value={s.stopId}>
                        {s.stopNameEn} ({s.stopNameTa})
                      </option>
                    ))}
                  </select>
                </div>

                {formData.stopIds.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No stops added yet. Select stops from above dropdown in sequence order.</p>
                ) : (
                  <div style={{
                    maxHeight: '200px',
                    overflowY: 'auto',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.5rem'
                  }}>
                    {formData.stopIds.map((stopId, index) => {
                      const stopObj = availableStops.find((s) => s.stopId === stopId);
                      return (
                        <div
                          key={stopId}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0.4rem 0.6rem',
                            backgroundColor: index % 2 === 0 ? '#F8FAFC' : '#FFFFFF',
                            borderRadius: '4px',
                            fontSize: '0.85rem'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontWeight: '700', color: 'var(--secondary)' }}>#{index + 1}</span>
                            <span>{stopObj?.stopNameEn || `Stop ID: ${stopId}`}</span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <button
                              type="button"
                              onClick={() => handleMoveStop(index, -1)}
                              disabled={index === 0}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
                            >
                              <MoveUp size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveStop(index, 1)}
                              disabled={index === formData.stopIds.length - 1}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
                            >
                              <MoveDown size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveStopFromSequence(index)}
                              style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '2px' }}
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={processing}>
                  {processing ? 'Saving...' : 'Save Route'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Route"
        message={`Are you sure you want to delete route "${routeToDelete?.routeName}"?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteModalOpen(false);
          setRouteToDelete(null);
        }}
        confirmText="Delete Route"
        loading={processing}
      />

    </div>
  );
};

export default AdminRoutesPage;
