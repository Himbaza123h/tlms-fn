import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import styles from '../styles/Dashboard.module.scss';
import LoadingDots from '../components/atoms/LoadingDots';
import { fetchTrucks, fetchDrivers, fetchOrders } from '../utils/fetchers';

const Dashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [trucks, setTrucks] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [trucksData, driversData, ordersData] = await Promise.all([
          fetchTrucks(),
          fetchDrivers(),
          fetchOrders(),
        ]);
        setTrucks(trucksData);
        setDrivers(driversData);
        setOrders(ordersData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [status, router]);

  if (status === 'loading' || isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingDots />
      </div>
    );
  }

  const pendingOrdersCount = orders.filter(order => order.order_status === 'Pending').length;

  return (
    <div className={styles.dashboard}>
      <div className={styles.sidebar}>
        {session?.user?.image && (
          <div className={styles.imageCard}>
            <Image
              src={session.user.image}
              alt="User Avatar"
              width={100}
              height={100}
              className={styles.userImage}
            />
            <h3>{session.user.name}</h3>
            <p>{session.user.email}</p>
          </div>
        )}
        <button className={styles.logoutButton} onClick={() => signOut()}>
          Logout
        </button>
      </div>
      <div className={styles.content}>
        <div className={styles.welcome}>
          <h1>Welcome, {session?.user?.name}!</h1>
          <p>Email: {session?.user?.email}</p>
        </div>
        <div className={styles.dashboardContent}>
          <div className={styles.statsCard}>
            <h3>Available Trucks</h3>
            <p className={styles.stat}>{trucks.length}</p>
          </div>
          <div className={styles.statsCard}>
            <h3>Active Drivers</h3>
            <p className={styles.stat}>{drivers.length}</p>
          </div>
          <div className={styles.statsCard}>
            <h3>Pending Orders</h3>
            <p className={styles.stat}>{pendingOrdersCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
