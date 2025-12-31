import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminApi from '../../api/adminApi';
import { adminAuth } from '../../auth/adminAuth';
import Toast from '../../components/admin/Toast';
import ConfirmModal from '../../components/admin/ConfirmModal';
import Sidebar from '../../components/admin/Sidebar';

const AdminParking = () => {
  const navigate = useNavigate();
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddSpotsModal, setShowAddSpotsModal] = useState(false);
  const [selectedLot, setSelectedLot] = useState(null);
  const [toast, setToast] = useState(null);
  const [deleteLotId, setDeleteLotId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    lotId: '',
    spotNumbers: '',
  });

  useEffect(() => {
    fetchLots();
  }, []);

  const fetchLots = async () => {
    try {
      const response = await adminApi.get('/admin/parking/lots');
      setLots(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch parking lots');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLot = async (e) => {
    e.preventDefault();
    const spotNumbers = formData.spotNumbers
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s);

    if (!formData.lotId || spotNumbers.length === 0) {
      setToast({ message: 'Please provide lot ID and at least one spot number', type: 'error' });
      return;
    }

    try {
      await adminApi.post('/admin/parking/lots', {
        lotId: formData.lotId,
        spotNumbers,
      });
      setShowCreateModal(false);
      setFormData({ lotId: '', spotNumbers: '' });
      fetchLots();
      setToast({ message: 'Parking lot created successfully', type: 'success' });
    } catch (err) {
      setToast({ message: err.response?.data?.error || 'Failed to create parking lot', type: 'error' });
    }
  };

  const handleAddSpots = async (e) => {
    e.preventDefault();
    const spotNumbers = formData.spotNumbers
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s);

    if (spotNumbers.length === 0) {
      setToast({ message: 'Please provide at least one spot number', type: 'error' });
      return;
    }

    try {
      await adminApi.post('/admin/parking/spots', {
        lotId: selectedLot.id,
        spotNumbers,
      });
      setShowAddSpotsModal(false);
      setFormData({ lotId: '', spotNumbers: '' });
      setSelectedLot(null);
      fetchLots();
      setToast({ message: 'Parking spots added successfully', type: 'success' });
    } catch (err) {
      setToast({ message: err.response?.data?.error || 'Failed to add parking spots', type: 'error' });
    }
  };

  const handleDeleteClick = (lotId) => {
    setDeleteLotId(lotId);
    setShowDeleteModal(true);
  };

  const handleDeleteLot = async () => {
    setShowDeleteModal(false);
    try {
      await adminApi.delete(`/admin/parking/lots/${deleteLotId}`);
      fetchLots();
      setToast({ message: 'Parking lot deleted successfully', type: 'success' });
      setDeleteLotId(null);
    } catch (err) {
      setToast({ message: err.response?.data?.error || 'Failed to delete parking lot', type: 'error' });
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen dark-bg flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400 font-medium">Loading parking lots...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dark-bg flex">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        {/* Top Navbar */}
        <nav className="dark-navbar shadow-lg sticky top-0 z-20">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 gradient-accent rounded-lg flex items-center justify-center shadow-md">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h1 className="text-xl font-bold text-white">Parking Management</h1>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="btn-primary px-5 py-2.5"
                >
                  + Create Lot
                </button>
                <div className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700">
                  <div className="w-8 h-8 rounded-full gradient-accent flex items-center justify-center shadow-md">
                    <span className="text-white font-semibold text-xs">
                      {adminAuth.getUser()?.email?.charAt(0).toUpperCase() || 'A'}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-200 hidden md:block">
                    {adminAuth.getUser()?.email || 'Admin'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <main className="p-6">
          {error && (
            <div className="mb-6 bg-red-900/20 border-l-4 border-red-500 text-red-300 px-4 py-3 rounded-r-lg">
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="dark-card rounded-xl overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-700">
              <h2 className="text-xl font-semibold text-white">Parking Lots</h2>
              <p className="mt-1 text-sm text-gray-400">Manage parking lots and spots</p>
            </div>
            
            <div className="divide-y divide-slate-700">
              {lots.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="mt-4 text-sm text-gray-400 font-medium">No parking lots found</p>
                </div>
              ) : (
                lots.map((lot) => (
                  <div key={lot.id} className="px-6 py-5 hover:bg-slate-800/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          </div>
                          <div>
                            <p className="text-lg font-semibold text-white">
                              {lot.id}
                            </p>
                          </div>
                        </div>
                        <div className="ml-15 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                          <div>
                            <p className="text-gray-400 font-medium">Total Spots</p>
                            <p className="text-white mt-0.5 font-semibold">{lot.totalSpots}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 font-medium">Available</p>
                            <p className="text-green-400 mt-0.5 font-semibold">{lot.availableSpots}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 font-medium">Reserved</p>
                            <p className="text-orange-400 mt-0.5 font-semibold">{lot.reservedSpots || 0}</p>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 flex space-x-2 flex-shrink-0">
                        <button
                          onClick={() => {
                            setSelectedLot(lot);
                            setShowAddSpotsModal(true);
                          }}
                          className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-5 py-2.5 rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5 active:scale-95 transition-all duration-200 text-sm"
                        >
                          Add Spots
                        </button>
                        <button
                          onClick={() => handleDeleteClick(lot.id)}
                          className="btn-danger text-sm px-5 py-2.5"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Create Lot Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative dark-card rounded-xl w-full max-w-md transform transition-all duration-300">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Create Parking Lot</h3>
              <form onSubmit={handleCreateLot} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Lot ID</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 dark-input border rounded-lg focus:outline-none input-focus"
                    placeholder="e.g., lot3"
                    value={formData.lotId}
                    onChange={(e) => setFormData({ ...formData, lotId: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Spot Numbers (comma-separated)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="A1, A2, A3"
                    className="w-full px-4 py-3 dark-input border rounded-lg focus:outline-none input-focus"
                    value={formData.spotNumbers}
                    onChange={(e) => setFormData({ ...formData, spotNumbers: e.target.value })}
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setFormData({ lotId: '', spotNumbers: '' });
                    }}
                    className="btn-secondary text-sm px-5 py-2.5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary text-sm px-5 py-2.5"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Spots Modal */}
      {showAddSpotsModal && selectedLot && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative dark-card rounded-xl w-full max-w-md transform transition-all duration-300">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-6">
                Add Spots to {selectedLot.id}
              </h3>
              <form onSubmit={handleAddSpots} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Spot Numbers (comma-separated)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="B1, B2, B3"
                    className="w-full px-4 py-3 dark-input border rounded-lg focus:outline-none input-focus"
                    value={formData.spotNumbers}
                    onChange={(e) => setFormData({ ...formData, spotNumbers: e.target.value })}
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddSpotsModal(false);
                      setFormData({ lotId: '', spotNumbers: '' });
                      setSelectedLot(null);
                    }}
                    className="btn-secondary text-sm px-5 py-2.5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-5 py-2.5 rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5 active:scale-95 transition-all duration-200 text-sm"
                  >
                    Add Spots
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteLotId(null);
        }}
        onConfirm={handleDeleteLot}
        title="Delete Parking Lot"
        message="Are you sure you want to delete this parking lot? This will delete all spots and cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default AdminParking;

