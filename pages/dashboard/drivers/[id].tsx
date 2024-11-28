import React, { useState } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../../components/layouts/DashboardLayout';
import Breadcrumbs from '../../../components/atoms/Breadcrumbs';
import { HomeIcon, EditIcon } from 'lucide-react';
import { useDriver, useUpdateDriver, useTrucks } from '../../../lib/api'; 
import LoadingDots from '@/components/atoms/LoadingDots';
import Button from '@/components/atoms/Button';

import styles from '../../../styles/components/truck-detail.module.scss';
import { toast } from 'react-toastify';

interface Driver {
  id: string;
  name: string;
  license_number: string;
  contact_number: string;
  assigned_truck: string;

}

const DriverDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const driverId = Array.isArray(id) ? id[0] : id;

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Driver>>({});

  // Fetch driver details using the ID
  const { data: driver, isLoading, error } = useDriver(driverId ?? '');

  const updateDriver = useUpdateDriver();

  const { data: trucks = [], isLoading: trucksLoading } = useTrucks();

  const availableTrucks = trucks.filter(truck => truck.status === 'Available');

  // Initialize edit data when driver data is loaded
  React.useEffect(() => {
    if (driver) {
      setEditData({
        name: driver.name,
        license_number: driver.license_number,
        contact_number: driver.contact_number,
        assigned_truck: driver.assigned_truck
      });
    }
  }, [driver]);

  // Breadcrumbs
  const breadcrumbs = [
    { name: 'Home', link: '/dashboard', icon: <HomeIcon /> },
    { name: 'Drivers', link: '/dashboard/drivers' },
    { name: `Driver ${driverId}`, link: `/dashboard/drivers/${driverId}` }
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
          <LoadingDots />
        </div>
      </DashboardLayout>
    );
  }

  if (!driver) {
    return (
      <DashboardLayout>
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        <div className="text-gray-500 p-4">No driver found with ID: {driverId}</div>
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
      await updateDriver.mutateAsync({
        id: driver.id,
        driver: editData
      });
      toast.success('Truck details updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update truck details');
    }
  };


  

  return (
    <DashboardLayout title="Driver">
      <Breadcrumbs breadcrumbs={breadcrumbs} />

      <div className={styles.truckDetailContainer}>
        <div className={styles.header}>
          <h1 className="text-2xl font-bold">Driver Details</h1>
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
              <label htmlFor="plateNumber">Driver Name:</label>
              <input
                type="text"
                id="plateNumber"
                name="plateNumber"
                value={editData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="license_number">License Number:</label>
              <input
                type="text"
                id="license_number"
                name="license_number"
                value={editData.license_number}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="assigned_truck">Assigned Truck:</label>
                <select
                    id="assigned_truck"
                    name="assigned_truck"
                    value={editData.assigned_truck}
                    onChange={handleInputChange}
                    
                >
                    <option value="">Select a truck</option>
                    {availableTrucks.map((truck) => (
                    <option key={truck.id} value={truck.id}>
                        {truck.plateNumber}
                    </option>
                    ))}
                </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="contact_number">Contact Number:</label>
              <input
                type="text"
                id="contact_number"
                name="contact_number"
                value={editData.contact_number}
                onChange={handleInputChange}
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
                <span>{driver.id}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Driver Name:</span> 
                <span>{driver.name}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>License Number</span> 
                <span>{driver.license_number}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Assigned Truck</span> 
                <span>{driver.assigned_truck ? availableTrucks.find(truck => truck.id === driver.assigned_truck)?.plateNumber || 'No truck' : 'No truck'}</span>
                
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Contact Number</span> 
                <span>{driver.contact_number}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DriverDetailPage;