import React, { useState } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../../components/layouts/DashboardLayout';
import Breadcrumbs from '../../../components/atoms/Breadcrumbs';
import { HomeIcon, EditIcon } from 'lucide-react';
import { useTruck, useUpdateTruckStatus, useUpdateTruck } from '../../../lib/api'; 
import LoadingDots from '@/components/atoms/LoadingDots';
import Button from '@/components/atoms/Button';

import styles from '../../../styles/components/truck-detail.module.scss';
import { toast } from 'react-toastify';

interface Truck {
  id: string;
  plateNumber: string;
  capacity: number;
  status: 'Available' | 'Delivering' | 'Maintenance' | undefined;
}

const TruckDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const truckId = Array.isArray(id) ? id[0] : id;

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Truck>>({});

  // Fetch truck details using the ID
  const { data: truck, isLoading, error } = useTruck(truckId ?? '');

  // Mutations
  const updateTruckStatus = useUpdateTruckStatus();
  const updateTruck = useUpdateTruck();

  // Initialize edit data when truck data is loaded
  React.useEffect(() => {
    if (truck) {
      setEditData({
        plateNumber: truck.plateNumber,
        capacity: truck.capacity
      });
    }
  }, [truck]);

  // Breadcrumbs
  const breadcrumbs = [
    { name: 'Home', link: '/dashboard', icon: <HomeIcon /> },
    { name: 'Trucks', link: '/dashboard/trucks' },
    { name: `Truck ${truckId}`, link: `/dashboard/trucks/${truckId}` }
  ];

  if (isLoading) {
    return (
      <DashboardLayout>
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        <div className="flex justify-center items-center h-full">
          <LoadingDots />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        <div className="text-red-500 p-4">
          Error loading truck details: {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      </DashboardLayout>
    );
  }

  if (!truck) {
    return (
      <DashboardLayout>
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        <div className="text-gray-500 p-4">No truck found with ID: {truckId}</div>
      </DashboardLayout>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: name === 'capacity' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateTruck.mutateAsync({
        id: truck.id,
        truck: editData
      });
      toast.success('Truck details updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update truck details');
    }
  };

  const toggleStatus = async () => {
    try {
      const newStatus = truck.status === 'Available' ? 'Delivering' : 'Available';
      await updateTruckStatus.mutateAsync({ id: truck.id, status: newStatus });
  
      toast.success(`Truck status updated to ${newStatus}`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to update truck status');
    }
  };
  

  return (
    <DashboardLayout title="Truck">
      <Breadcrumbs breadcrumbs={breadcrumbs} />

      <div className={styles.truckDetailContainer}>
        <div className={styles.header}>
          <h1 className="text-2xl font-bold">Truck Details</h1>
          <Button 
              variant="outline" 
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? (
                <>
                  <HomeIcon /> Cancel
                </>
              ) : (
                <>
                  <EditIcon /> Edit
                </>
              )}
            </Button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className={styles.editForm}>
            <div className={styles.formGroup}>
              <label htmlFor="plateNumber">Plate Number:</label>
              <input
                type="text"
                id="plateNumber"
                name="plateNumber"
                value={editData.plateNumber}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="capacity">Capacity (tons):</label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={editData.capacity}
                onChange={handleInputChange}
                min="0"
                step="0.1"
                required
              />
            </div>

            <div className={styles.buttonGroup}>
              <Button type="submit" variant="primary">
                Save Changes
              </Button>
            </div>
          </form>
        ) : (
          <>
            <div className={styles.truckInfo}>
              <div className={styles.infoRow}>
                <span className={styles.label}>ID:</span> 
                <span>{truck.id}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Plate Number:</span> 
                <span>{truck.plateNumber}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Capacity:</span> 
                <span>{truck.capacity} tons</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Status:</span> 
                <span 
                  className={styles.status}
                  style={{
                    color: truck.status === 'Available' ? 'green' : 'red',
                  }}
                >
                  {truck.status ?? 'Unknown'}
                </span>
              </div>
            </div>

            <div className={styles.buttonGroup}>
              <Button variant="primary" onClick={toggleStatus}>
                {truck.status === 'Available' ? 'Make as Delivering' : 'Mark as Available'}
              </Button>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TruckDetailPage;