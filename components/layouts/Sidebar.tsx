import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { 
  Home, Truck, Users, Package, 
  Settings, HelpCircle 
} from 'lucide-react';
import styles from '@/styles/components/Sidebar.module.scss';

interface Props {
  isOpen: boolean;
}

const Sidebar = ({ isOpen }: Props) => {
  const router = useRouter();
  
  const menuItems = [
    { 
      title: 'Dashboard', 
      icon: <Home size={20} />, 
      path: '/dashboard' 
    },
    { 
      title: 'Trucks', 
      icon: <Truck size={20} />, 
      path: '/dashboard/trucks' 
    },
    { 
      title: 'Drivers', 
      icon: <Users size={20} />, 
      path: '/dashboard/drivers' 
    },
    { 
      title: 'Orders', 
      icon: <Package size={20} />, 
      path: '/dashboard/orders' 
    },
    { 
      title: 'Settings', 
      icon: <Settings size={20} />, 
      path: '/dashboard/settings' 
    },
    { 
      title: 'Help', 
      icon: <HelpCircle size={20} />, 
      path: '/dashboard/help' 
    }
  ];

  return (
    <aside className={`${styles.sidebar} ${!isOpen ? styles.collapsed : ''}`}>
      <div className={styles.logoContainer}>
        <Link href="/dashboard" className={styles.logo}>
          <Image 
            src="/logo.png" 
            alt="Logo" 
            width={120} 
            height={40} 
            priority 
          />
        </Link>
      </div>
      
      <nav className={styles.navigation}>
        {menuItems.map((item) => (
          <Link
            href={item.path}
            key={item.title}
            className={`${styles.navItem} ${
              router.pathname === item.path ? styles.active : ''
            }`}
          >
            <span className={styles.icon}>{item.icon}</span>
            <span className={styles.title}>{item.title}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;