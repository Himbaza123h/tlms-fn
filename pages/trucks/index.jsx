import React, { useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { PlusIcon, EditIcon, TrashIcon } from 'lucide-react';
// import styles from '../../styles/Trucks.module.scss';

const TrucksPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingTruck, setEditingTruck] = useState(null);
  const [trucks, setTrucks] = useState([
    { 
      id: 1, 
      plateNumber: 'ABC123', 
      capacity: '20000', 
      status: 'Available' 
    },
  ]);

  const initialFormState = {
    plateNumber: '',
    capacity: '',
    status: 'Available'
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingTruck) {
      setTrucks(trucks.map(truck => 
        truck.id === editingTruck.id 
          ? { ...formData, id: truck.id }
          : truck
      ));
    } else {
      setTrucks([...trucks, { ...formData, id: Date.now() }]);
    }
    setFormData(initialFormState);
    setShowForm(false);
    setEditingTruck(null);
  };

  const handleEdit = (truck) => {
    setEditingTruck(truck);
    setFormData(truck);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setTrucks(trucks.filter(truck => truck.id !== id));
  };

  return (
    <DashboardLayout>
      <div className={styles.trucksPage}>
        <div className={styles.header}>
          <h1>Truck Management</h1>
          <button 
            className={styles.addButton}
            onClick={() => setShowForm(true)}
          >
            <PlusIcon size={20} />
            Add New Truck
          </button>
        </div>

        {showForm && (
          <div className={styles.formOverlay}>
            <div className={styles.formCard}>
              <h2>{editingTruck ? 'Edit Truck' : 'Add New Truck'}</h2>
              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label>Plate Number</label>
                  <input
                    type="text"
                    value={formData.plateNumber}
                    onChange={(e) => setFormData({
                      ...formData,
                      plateNumber: e.target.value
                    })}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Capacity (kg)</label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({
                      ...formData,
                      capacity: e.target.value
                    })}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({
                      ...formData,
                      status: e.target.value
                    })}
                  >
                    <option value="Available">Available</option>
                    <option value="Delivering">Delivering</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>

                <div className={styles.formActions}>
                  <button 
                    type="button" 
                    className={styles.cancelButton}
                    onClick={() => {
                      setShowForm(false);
                      setEditingTruck(null);
                      setFormData(initialFormState);
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className={styles.submitButton}
                  >
                    {editingTruck ? 'Save Changes' : 'Add Truck'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Plate Number</th>
                <th>Capacity (kg)</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {trucks.map(truck => (
                <tr key={truck.id}>
                  <td>{truck.plateNumber}</td>
                  <td>{truck.capacity}</td>
                  <td>
                    <span className={`${styles.status} ${styles[truck.status.toLowerCase()]}`}>
                      {truck.status}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button 
                        onClick={() => handleEdit(truck)}
                        className={styles.editButton}
                      >
                        <EditIcon size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(truck.id)}
                        className={styles.deleteButton}
                      >
                        <TrashIcon size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TrucksPage;