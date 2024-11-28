import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { 
  LayoutDashboard, 
  Truck, 
  Users, 
  ShoppingBag, 
  LogOut, 
  X,
  Menu
} from 'lucide-react';
import LoadingDots from '../atoms/LoadingDots';

const Sidebar = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsOpen(false);
      }
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { 
      title: 'Dashboard', 
      icon: <LayoutDashboard className="w-5 h-5" />, 
      path: '/dashboard' 
    },
    { 
      title: 'Truck Management', 
      icon: <Truck className="w-5 h-5" />, 
      path: '/dashboard/trucks' 
    },
    { 
      title: 'Driver Management', 
      icon: <Users className="w-5 h-5" />, 
      path: '/dashboard/drivers' 
    },
    { 
      title: 'Order Management', 
      icon: <ShoppingBag className="w-5 h-5" />, 
      path: '/dashboard/orders' 
    }
  ];

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut({ redirect: false });
      toast.success('Successfully logged out');
      router.push('/');
    } catch (error) {
      toast.error('Logout failed');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        className={`sidebar-toggle ${isOpen ? 'sidebar-open' : ''}`}
        onClick={toggleSidebar}
      >
        {isOpen ? <X /> : <Menu />}
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <Image 
              src="/logo.png"
              alt="Logo"
              width={180}
              height={40}
              priority
            />
          </div>
        </div>

        <div className="nav-section">
          <nav className="sidebar-nav">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`nav-item ${
                  router.pathname.startsWith(item.path) ? 'active' : ''
                }`}
                onClick={() => isMobile && setIsOpen(false)}
              >
                {item.icon}
                <span className="nav-item-text">{item.title}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="sidebar-footer">
          <button 
            className="logout-button" 
            onClick={handleLogout}
            disabled={isLoading}
          >
            <LogOut className="w-5 h-5" />
            {isLoading ? <LoadingDots /> : <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Overlay */}
      <div 
        className={`sidebar-overlay ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(false)}
      />
    </>
  );
};

export default Sidebar;