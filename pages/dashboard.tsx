"use client";
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import styles from '../styles/Dashboard.module.scss';
import LoadingDots from '../components/atoms/LoadingDots';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { toast } from 'react-hot-toast';
import Head from 'next/head';

// Import custom React Query hooks
import { useTrucks, useDrivers, useOrders } from '../lib/api';



const Dashboard = () => {


  const { data: session, status } = useSession();
  const router = useRouter();

  // Use custom hooks to fetch data
  const { 
    data: trucks, 
    isLoading: isTrucksLoading 
  } = useTrucks();

  const { 
    data: drivers, 
    isLoading: isDriversLoading 
  } = useDrivers();

  const { 
    data: orders, 
    isLoading: isOrdersLoading 
  } = useOrders();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
      return;
    }

    // Check for auth message
    const message = localStorage.getItem('authMessage');
    if (message) {
      toast.success(message);
      localStorage.removeItem('authMessage'); 
    }
  }, [status, router]);

  // Loading state for session or data
  if (
    status === 'loading' || 
    isTrucksLoading || 
    isDriversLoading || 
    isOrdersLoading
  ) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingDots />
      </div>
    );
  }

  const trucksList = trucks || [];
  const driversList = drivers || [];
  const ordersList = orders || [];

  const pendingOrdersCount = ordersList.filter(order => order.order_status != 'Completed').length;
  const AvailableTrucksCount = trucksList.filter(truck => truck.status === 'Available').length;

  return (
    <DashboardLayout title="Dashboard">
      <div className={styles.dashboard}>
        <div className={styles.content}>
          <h2>Welcome back, {session?.user?.name} 
            <span className={styles.small}>[{session?.user?.email}]</span>
            </h2> 
          <div className={styles.dashboardContent}>
            <div className={styles.statsCard}>
              <h3>Available Trucks</h3>
              <p className={styles.stat}>{AvailableTrucksCount}</p>
            </div>
            <div className={styles.statsCard}>
              <h3>Active Drivers</h3>
              <p className={styles.stat}>{driversList.length}</p>
            </div>
            <div className={styles.statsCard}>
              <h3>Pending Orders</h3>
              <p className={styles.stat}>{pendingOrdersCount}</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;