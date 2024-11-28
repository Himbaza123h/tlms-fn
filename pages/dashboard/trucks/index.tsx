import React, { useMemo, useState } from 'react';
import { PlusIcon,EyeIcon, EditIcon, TrashIcon } from 'lucide-react';
import DashboardLayout from '../../../components/layouts/DashboardLayout';
import Breadcrumbs from '../../../components/atoms/Breadcrumbs';
import Button from '../../../components/atoms/Button';
import LoadingDots from '@/components/atoms/LoadingDots';
import Table, { TableColumn } from '../../../components/molecules/TableRow';
import DeleteModal from '@/components/atoms/DeleteModal';
import { HomeIcon } from 'lucide-react';
import { useRouter } from 'next/router';
import styles from '../../../styles/Extra.module.scss';
import { toast } from 'react-toastify';

// Import the new React Query hook
import { useTrucks, useDeleteTruck } from '../../../lib/api';

const TrucksPage = () => {
  const router = useRouter(); 
  
  // State for delete confirmation modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [truckToDelete, setTruckToDelete] = useState<string | null>(null);
  
  // Use the useTrucks hook to fetch data
  const { data: trucks, isLoading, isError, error } = useTrucks();
  
  // Use the useDeleteTruck mutation
  const deleteTruckMutation = useDeleteTruck();

  const breadcrumbs = [
    { name: 'Home', link: '/dashboard', icon: <HomeIcon /> },
    { name: 'Trucks', link: '/dashboard/trucks' },
  ];

  const handleDeleteClick = (truckId: string) => {
    setTruckToDelete(truckId);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (truckToDelete) {
      try {
        await deleteTruckMutation.mutateAsync(truckToDelete);
        toast.success('Truck deleted successfully!');
        setDeleteModalOpen(false);
        setTruckToDelete(null);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'Failed to delete the truck.'
        );
      }
    }
  };
  

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setTruckToDelete(null);
  };

  const columns: TableColumn[] = useMemo(
    () => [
      { 
        Header: 'Truck ID', 
        accessor: 'id' 
      },
      
      { 
        Header: 'Plate Number', 
        accessor: 'plateNumber' 
      },
      { 
        Header: 'Capacity (tons)', 
        accessor: 'capacity' 
      },
      { 
        Header: 'Status', 
        accessor: 'status',
        Cell: ({ value }) => (
          <span 
            style={{
              color: value === 'Available' ? 'green' : 'red',
              fontWeight: 600
            }}
          >
            {value}
          </span>
        )
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
              onClick={() => router.push(`/dashboard/trucks/${row.id}`)} 
            >
              View
            </Button>
            <Button 
              variant="danger" 
              size="small" 
              leftIcon={<TrashIcon size={16} />}
              onClick={() => handleDeleteClick(row.id)}
              loading={deleteTruckMutation.isLoading}
            >
              Delete
            </Button>

          </div>
        )
      }
    ],
    [router, deleteTruckMutation]
  );

  const handleCreateTruck = () => {
    console.log('Attempting to navigate to create truck page');
    router.push('/dashboard/trucks/create').then(() => {
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
          <p className="text-gray-600 mt-4">Loading trucks...</p>
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
              Error Loading Trucks
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
    <DashboardLayout  title="Trucks">
      <Breadcrumbs breadcrumbs={breadcrumbs} />

      <div className={styles.Headeractions}>
        <h1>Trucks</h1>
        <Button 
          variant="primary" 
          leftIcon={<PlusIcon />} 
          onClick={handleCreateTruck}
        >
          Create New Truck
        </Button>
      </div>

      <div className="table-container">
        <Table 
          columns={columns} 
          data={trucks || []} 
        />
      </div>

      <DeleteModal 
        isOpen={deleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        itemName="this truck"
      />
    </DashboardLayout>
  );
};

export default TrucksPage;