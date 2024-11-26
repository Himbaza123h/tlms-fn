import React, {useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../../components/layouts/DashboardLayout';
import Breadcrumbs from '../../../components/atoms/Breadcrumbs';
import { PlusIcon, EditIcon, TrashIcon, Eye } from 'lucide-react';
import { HomeIcon } from 'lucide-react';
import styles from '../../../styles/Extra.module.scss';
import Button from '../../../components/atoms/Button';
import { useOrders, useDeleteOrder, useDrivers, useTrucks } from '../../../lib/api';
import Table, { TableColumn } from '../../../components/molecules/TableRow';
import LoadingDots from '@/components/atoms/LoadingDots';
import DeleteModal from '@/components/atoms/DeleteModal';
import { toast } from 'react-toastify';

const OrdersPage = () => {
  const router = useRouter(); 
  const [showForm, setShowForm] = useState(false);
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  
  // Fetch orders, drivers, and trucks
  const { data: orders, isLoading: isOrdersLoading, isError: isOrdersError, error: ordersError } = useOrders();
  const { data: drivers, isLoading: isDriversLoading, isError: isDriversError } = useDrivers();
  const { data: trucks, isLoading: isTrucksLoading, isError: isTrucksError } = useTrucks();
  
  const deleteOrderMutation = useDeleteOrder();
  
  const breadcrumbs = [
    { name: 'Home', link: '/dashboard', icon: <HomeIcon /> },
    { name: 'Orders', link: '/dashboard/orders' },
  ];
  
  const handleDeleteClick = (orderId: string) => {
    setOrderToDelete(orderId);
    setDeleteModalOpen(true);
  };
  
  const handleConfirmDelete = async () => {
    if (orderToDelete) {
      try {
        await deleteOrderMutation.mutateAsync(orderToDelete);
        toast.success('Order deleted successfully!');
        setDeleteModalOpen(false);
        setOrderToDelete(null);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'Failed to delete the truck.'
        );
      }
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setOrderToDelete(null);
  };
  
  // Enhanced columns with driver and truck details
  const columns: TableColumn[] = useMemo(
    () => [
      {
        Header: 'Order ID',
        accessor: 'id',
        Cell: ({ row }) => {
          const order_id = row ? row.id : undefined;
          return order_id ? `Order-${order_id}` : 'N/A';
        },
      },
      { 
        Header: 'Customer Name', 
        accessor: 'customer_name' 
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
        Header: 'Driver Assigned', 
        accessor: 'assigned_driver',
        Cell: ({ row }) => {
          const driver = drivers?.find(d => d.id === row.assigned_driver);
          return driver ? driver.name : 'N/A';
        }
      },
      { 
        Header: 'Order Status', 
        accessor: 'order_status' 
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        Cell: ({ row }) => (
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button 
              variant="primary" 
              size="small" 
              leftIcon={<Eye size={16} />}
              onClick={() => router.push(`/dashboard/orders/${row.id}`)}
            >
              View
            </Button>
            <Button 
              variant="danger" 
              size="small" 
              leftIcon={<TrashIcon size={16} />}
              onClick={() => handleDeleteClick(row.id)}
              loading={deleteOrderMutation.isLoading}
            >
              Delete
            </Button>
          </div>
        )
      }
    ],
    [router, deleteOrderMutation, trucks, drivers]
  );
  
  const handleCreateOrder = () => {
    console.log('Attempting to navigate to create order page');
    router.push('/dashboard/orders/create').then(() => {
      console.log('Navigation initiated');
    }).catch((error) => {
      console.error('Navigation error:', error);
    });
  };
  
  // Loading state with LoadingDots
  if (isOrdersLoading || isDriversLoading || isTrucksLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] space-y-4">
          <LoadingDots />
          <p className="text-gray-600 mt-4">Loading orders, drivers, and trucks...</p>
        </div>
      </DashboardLayout>
    );
  }
  
  // Enhanced error state
  if (isOrdersError || isDriversError || isTrucksError) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] space-y-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-2">
              Error Loading Data
            </h2>
            <p className="text-gray-600 mb-4">
              Unable to load orders, drivers, or trucks
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
    <DashboardLayout title="Orders">
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <div className={styles.Headeractions}>
        <h1>Orders</h1>
        <Button 
          leftIcon={<PlusIcon />}
          variant="primary" 
          onClick={handleCreateOrder}
        >
          Create New Order
        </Button>
      </div>

      <div className="table-container">
        <Table 
          columns={columns} 
          data={orders || []} 
          onRowClick={(row) => console.log('Row clicked:', row)}
        />
      </div>
      <DeleteModal 
        isOpen={deleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        itemName="this order"
      />
    </DashboardLayout>
  );
};

export default OrdersPage;