import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../../components/layouts/DashboardLayout';
import Breadcrumbs from '../../../components/atoms/Breadcrumbs';
import { HomeIcon, EditIcon } from 'lucide-react';
import { useOrder, useUpdateOrder, useTrucks, useDrivers, useMarkOrderComplete, useDeleteOrder } from '../../../lib/api';
import LoadingDots from '@/components/atoms/LoadingDots';
import Button from '@/components/atoms/Button';
import { toast } from 'react-toastify';

import styles from '../../../styles/components/truck-detail.module.scss';

interface Order {
id: string;
customer_name: string;
order_status: string;
assigned_truck: string;
assigned_driver: string;
}



const OrderDetailPage: React.FC = () => {
const router = useRouter();
const { id } = router.query;
const orderId = Array.isArray(id) ? id[0] : id;

const [isEditing, setIsEditing] = useState(false);
const [editData, setEditData] = useState<Partial<Order>>({});

    const { data: order, isLoading, error } = useOrder(orderId ?? '');
    const updateOrder = useUpdateOrder();
    const deleteOrder = useDeleteOrder();
    const markOrderComplete = useMarkOrderComplete();


    const { data: trucks = [], isLoading: trucksLoading } = useTrucks();

    const availableTrucks = trucks.filter(truck => truck.status === 'Available');

    
    const { data: drivers = [], isLoading: driversLoading } = useDrivers();

    const availableDrivers = drivers;

    useEffect(() => {
    if (order) {
    setEditData({
    customer_name: order.customer_name,
    order_status: order.order_status,
    assigned_truck: order.assigned_truck,
    assigned_driver: order.assigned_driver,
    });
    }
    }, [order]);


    interface Driver {
        id: string;
        name: string;
      }
      
      interface Truck {
        id: string;
        plateNumber: string;
        status: string;
      }

    // Breadcrumbs
    const breadcrumbs = [
    { name: 'Home', link: '/dashboard', icon:
    <HomeIcon /> },
    { name: 'Orders', link: '/dashboard/orders' },
    { name: `Order ${orderId}`, link: `/dashboard/orders/${orderId}` },
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

    if (!order) {
    return (
    <DashboardLayout>
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        <div className="text-gray-500 p-4">No order found with ID: {orderId}</div>
    </DashboardLayout>
    );
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditData((prev) => ({
        ...prev,
        [name]: name === 'total_amount' ? Number(value) : value,
        }));
        };

        const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
        await updateOrder.mutateAsync({
        id: order.id,
        order: editData,
        });
        toast.success('Order updated successfully');
        setIsEditing(false);
        } catch (error) {
        toast.error('Failed to update order');
        }
        };

        const handleDelete = async () => {
        try {
        await deleteOrder.mutateAsync(order.id);
        toast.success('Order deleted successfully');
        router.push('/dashboard/orders');
        } catch (error) {
        toast.error('Failed to delete order');
        }
        };

        const handleComplete = async () => {
        try {
        await markOrderComplete.mutateAsync(order.id);
        
        toast.success('Order marked as complete');
        } catch (error) {
        toast.error('Failed to mark order as complete');
        }
        };

        return (
        <DashboardLayout title="Order">
            <Breadcrumbs breadcrumbs={breadcrumbs} />

            <div className={styles.orderDetailContainer}>
                <div className={styles.header}>
                    <h1 className="text-2xl font-bold">Order Details</h1>
                        <Button variant="outline" onClick={()=> setIsEditing(!isEditing)}>
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
                        <label htmlFor="customer_name">Customer Name:</label>
                        <input type="text" id="customer_name" name="customer_name" value={editData.customer_name}
                            onChange={handleInputChange} required />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="assigned_driver">Assigned Driver:</label>
                        <select id="assigned_driver" name="assigned_driver" value={editData.assigned_driver}
                            onChange={handleInputChange}>
                            <option value="">Select a driver</option>
                            {availableDrivers.map((driver) => (
                            <option key={driver.id} value={driver.id}>
                                {driver.name}
                            </option>
                            ))}
                        </select>
                    </div>


                    <div className={styles.formGroup}>
                        <label htmlFor="assigned_truck">Assigned Truck:</label>
                        <select id="assigned_truck" name="assigned_truck" value={editData.assigned_truck}
                            onChange={handleInputChange}>
                            <option value="">Select a truck</option>
                            {availableTrucks.map((truck) => (
                            <option key={truck.id} value={truck.id}>
                                {truck.plateNumber}
                            </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.buttonGroup}>
                        <Button type="submit" variant="primary">
                            Save Changes
                        </Button>
                        <Button type="button" variant="secondary" onClick={handleDelete}>
                            Delete Order
                        </Button>
                    </div>
                </form>
                ) : (
                <>
                    <div className={styles.orderInfo}>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>ID:</span>
                            <span>{order.id}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>Customer Name:</span>
                            <span>{order.customer_name}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>Assigned Driver:</span>
                            <span>{drivers.find((d: Driver) => d.id === order.assigned_driver)?.name || 'No driver assigned'}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>Assigned Truck:</span>
                            <span> {trucks.find((t: Truck) => t.id === order.assigned_truck)?.plateNumber || 'No truck assigned'}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>Status:</span>
                            <span>{order.order_status}</span>
                        </div>
                    </div>

                    {order.order_status !== 'Completed' && (
                    <div className={styles.buttonGroup}>
                        <Button onClick={handleComplete} variant="primary">
                            Mark as Complete
                        </Button>
                    </div>
                    )}
                </>
                )}
            </div>
        </DashboardLayout>
        );
        };

        export default OrderDetailPage;
