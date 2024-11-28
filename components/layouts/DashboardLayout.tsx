import { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './TopHeader';
import LoadingDots from '../atoms/LoadingDots';
import Head from 'next/head';

interface DashboardLayoutProps {
  title?: string; 
  children: React.ReactNode; 
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ title, children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const simulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  const pageTitle = title ? `TLMS - ${title}` : 'TLMS'; 

  return (
    <div className="dashboard-layout">
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      <div className="main-wrapper">
        <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
        {isLoading ? (
          <div className="loading-overlay">
            <LoadingDots />
          </div>
        ) : (
          <main className="main-content">
            {children}
          </main>
        )}
      </div>
    </div>
  );
};

export default DashboardLayout;
