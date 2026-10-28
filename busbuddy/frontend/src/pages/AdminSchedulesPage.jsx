import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, ArrowLeft, Search, Clock, X } from 'lucide-react';
import { adminService } from '../services/adminService';
import { busService } from '../services/busService';
import ConfirmModal from '../components/ConfirmModal';
import Alert from '../components/Alert';

const AdminSchedulesPage = () => {
  const [schedules, setSchedules] = useState([]);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [alert, setAlert] = useState(null);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [formData, setFormData] = useState({
    busId: '',
    departureTime: '',
    serviceDay: 'Daily',
    sourceReference: 'DEMO DATA: TNSTC Coimbatore',
  });

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState(null);
  const [processing, setProcessing] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [schedulesData, busesData] = await Promise.all([
        adminService.getAllSchedules(),
        busService.getAllBuses(),
      ]);
      setSchedules(schedulesData || []);
      setBuses(busesData || []);
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Failed to load schedules' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingSchedule(null);
    setFormData({
      busId: buses.length > 0 ? buses[0].busId : '',
      departureTime: '08:00',
      serviceDay: 'Daily',
      sourceReference: 'DEMO DATA: TNSTC Coimbatore',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      busId: schedule.busId || '',
      departureTime: String(schedule.departureTime || '').slice(0, 5),
      serviceDay: schedule.serviceDay || 'Daily',
      sourceReference: schedule.sourceReference || 'DEMO DATA: TNSTC Coimbatore',
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      const payload = {
        busId: Number(formData.busId),
        departureTime: formData.departureTime.length === 5 ? `${formData.departureTime}:00` : formData.departureTime,
        serviceDay: formData.serviceDay,
        sourceReference: formData.sourceReference,
      };

      if (editingSchedule) {
        await adminService.updateSchedule(editingSchedule.scheduleId, payload);
        setAlert({ type: 'success', message: 'Timetable entry updated successfully' });
      } else {
        await adminService.createSchedule(payload);
        setAlert({ type: 'success', message: 'Timetable departure added successfully' });
      }

      setModalOpen(false);
      loadData();
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Error saving timetable' });
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!scheduleToDelete) return;
    setProcessing(true);
    try {
      await adminService.deleteSchedule(scheduleToDelete.scheduleId);
      setAlert({ type: 'success', message: 'Timetable departure deleted successfully' });
      setDeleteModalOpen(false);
      setScheduleToDelete(null);
      loadData();
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Error deleting timetable entry' });
    } finally {
      setProcessing(false);
    }
  };

  const filtered = schedules.filter((s) => {
    const q = search.toLowerCase();
    return (
      (s.busNumber && s.busNumber.toLowerCase().includes(q)) ||
      (s.routeName && s.routeName.toLowerCase().includes(q)) ||
      (s.departureTime && String(s.departureTime).includes(q))
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
            Scheduled Timetable Management
          </h1>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary">
          <Plus size={16} />
          <span>Add Departure Time</span>
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
            placeholder="Search by bus number or time..."
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
                <th style={{ padding: '0.85rem 1rem', fontWeight: '700', color: 'var(--text-muted)' }}>Departure Time</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: '700', color: 'var(--text-muted)' }}>Service Route</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: '700', color: 'var(--text-muted)' }}>Days</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: '700', color: 'var(--text-muted)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading timetables...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No schedules found.</td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.scheduleId} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: '700' }}>#{s.scheduleId}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{
                        backgroundColor: 'var(--primary)',
                        color: '#FFFFFF',
                        fontWeight: '800',
                        padding: '0.2rem 0.6rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.9rem'
                      }}>
                        {s.busNumber}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: '800', color: 'var(--secondary)', fontSize: '1rem' }}>
                      {String(s.departureTime).slice(0, 5)}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-main)', fontWeight: '600' }}>
                      {s.routeName}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span className="badge badge-secondary">{s.serviceDay || 'Daily'}</span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button onClick={() => handleOpenEdit(s)} className="btn btn-outline btn-sm" title="Edit">
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => {
                            setScheduleToDelete(s);
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
            maxWidth: '460px',
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
              {editingSchedule ? 'Edit Departure Time' : 'Add Departure Time'}
            </h2>

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Bus & Route *</label>
                <select
                  className="form-control"
                  value={formData.busId}
                  onChange={(e) => setFormData({ ...formData, busId: e.target.value })}
                  required
                >
                  <option value="">-- Select Bus --</option>
                  {buses.map((b) => (
                    <option key={b.busId} value={b.busId}>
                      Bus {b.busNumber} &bull; {b.routeName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Departure Time (24h) *</label>
                <input
                  type="time"
                  className="form-control"
                  value={formData.departureTime}
                  onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Operating Days</label>
                <select
                  className="form-control"
                  value={formData.serviceDay}
                  onChange={(e) => setFormData({ ...formData, serviceDay: e.target.value })}
                >
                  <option value="Daily">Daily</option>
                  <option value="Mon-Sat">Monday to Saturday</option>
                  <option value="Sunday Only">Sunday Only</option>
                  <option value="Peak Hours Only">Peak Hours Only</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={processing}>
                  {processing ? 'Saving...' : 'Save Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Schedule"
        message={`Are you sure you want to remove this departure time (${scheduleToDelete?.departureTime}) for Bus ${scheduleToDelete?.busNumber}?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteModalOpen(false);
          setScheduleToDelete(null);
        }}
        confirmText="Delete Schedule"
        loading={processing}
      />

    </div>
  );
};

export default AdminSchedulesPage;
