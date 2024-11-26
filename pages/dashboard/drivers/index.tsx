import React, {useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../../components/layouts/DashboardLayout';
import Breadcrumbs from '../../../components/atoms/Breadcrumbs';
import { PlusIcon, EditIcon, TrashIcon, EyeIcon } from 'lucide-react';
import { HomeIcon } from 'lucide-react';
import DeleteModal from '@/components/atoms/DeleteModal';
import styles from '../../../styles/Extra.module.scss';
import Button from '../../../components/atoms/Button';
import { useDrivers, useDeleteDriver, useTrucks } from '../../../lib/api';
import Table, { TableColumn } from '../../../components/molecules/TableRow';
import LoadingDots from '@/components/atoms/LoadingDots';
import { toast } from 'react-toastify';


const DriversPage = () => {
const router = useRouter(); 
const [showForm, setShowForm] = useState(false);


const [deleteModalOpen, setDeleteModalOpen] = useState(false);
const [driverToDelete, setDriverToDelete] = useState<string | null>(null);


// Use the useDeleteDriver mutation
const { data: drivers, isLoading, isError, error } = useDrivers();

const { data: trucks, isLoading: isTrucksLoading, isError: isTrucksError } = useTrucks();


const deleteDriverMutation = useDeleteDriver();




const breadcrumbs = [
{ name: 'Home', link: '/dashboard', icon:
<HomeIcon /> },
{ name: 'Drivers', link: '/dashboard/drivers' },
];


const handleDeleteClick = (driverId: string) => {
    setDriverToDelete(driverId);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (driverToDelete) {


      try {
        await deleteDriverMutation.mutateAsync(driverToDelete);
        toast.success('Driver deleted successfully!');
        setDeleteModalOpen(false);
        setDriverToDelete(null);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'Failed to delete the driver.'
        );
      }
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setDriverToDelete(null);
  };


  const columns: TableColumn[] = useMemo(
    () => [
      { 
        Header: 'ID', 
        accessor: 'id' 
      },
      { 
        Header: 'Driver Names', 
        accessor: 'name' 
      },
      { 
        Header: 'License Number', 
        accessor: 'license_number' 
      },


      { 
        Header: 'Assigned Truck', 
        accessor: 'assigned_truck',
        Cell: ({ row }) => {
          const truck = trucks?.find(t => t.id === row.assigned_truck);
          return truck ? truck.plateNumber : 'No truck';
        }
      },

      { 
        Header: 'Contact Number', 
        accessor: 'contact_number' 
      },

      {
        Header: 'Actions',
        accessor: 'actions',
        Cell: ({ row }) => (
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button 
              variant="primary" 
              size="small" 
              leftIcon={<EyeIcon size={16} />}
              onClick={() => router.push(`/dashboard/drivers/${row.id}`)}
            >
              View
            </Button>
            <Button 
              variant="danger" 
              size="small" 
              leftIcon={<TrashIcon size={16} />}
              onClick={() => handleDeleteClick(row.id)}
              loading={deleteDriverMutation.isLoading}
            >
              Delete
            </Button>
          </div>
        )
      }
    ],
    [router, deleteDriverMutation]
  );
  const handleCreateDriver = () => {
    console.log('Attempting to navigate to create driver page');
    router.push('/dashboard/drivers/create').then(() => {
      console.log('Navigation initiated');
    }).catch((error) => {
      console.error('Navigation error:', error);
    });
  };


    // Loading state with LoadingDots
    if (isLoading) {
        return (
          <DashboardLayout>
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] space-y-4">
              <LoadingDots />
              <p className="text-gray-600 mt-4">Loading drivers...</p>
            </div>
          </DashboardLayout>
        );
      }

      // Enhanced error state
  if (isError) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] space-y-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-2">
              Error Loading Drivers
            </h2>
            <p className="text-gray-600 mb-4">
              {error instanceof Error ? error.message : 'An unknown error occurred'}
            </p>
            <Button 
              variant="primary" 
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

return (
<DashboardLayout title="Drivers">
<Breadcrumbs breadcrumbs={breadcrumbs} />
    <div className={styles.Headeractions}>
        <h1>Drivers</h1>
        <Button leftIcon={<PlusIcon />}
                  variant="primary" 
        onClick={handleCreateDriver}
        >
        Create New Driver
        </Button>
    </div>

    <div className="table-container" >
        <Table 
          columns={columns} 
          data={drivers || []} 
          onRowClick={(row) => console.log('Row clicked:', row)}
        />
      </div>
      <DeleteModal 
        isOpen={deleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        itemName="this driver"
      />
</DashboardLayout>
);
};

export default DriversPage;
