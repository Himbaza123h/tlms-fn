import React, { ReactNode } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Sidebar from './Sidebar';
import TopHeader from './TopHeader';
import styles from '@/styles/components/DashboardLayout.module.scss';

interface Props {
  children: ReactNode;
}

const DashboardLayout = ({ children }: Props) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const { data: session } = useSession();
  const router = useRouter();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={styles.dashboardLayout}>
      <Sidebar isOpen={isSidebarOpen} />
      <div className={`${styles.mainContent} ${!isSidebarOpen ? styles.expanded : ''}`}>
        <TopHeader 
          toggleSidebar={toggleSidebar} 
          user={session?.user}
          isSidebarOpen={isSidebarOpen}
        />
        <main className={styles.pageContent}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;