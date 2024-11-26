// components/layout/TopHeader.tsx
import React from 'react';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { 
  Menu, Bell, Search, ChevronDown,
  LogOut, User, Settings 
} from 'lucide-react';
import styles from '@/styles/components/TopHeader.module.scss';

interface Props {
  toggleSidebar: () => void;
  user: any;
  isSidebarOpen: boolean;
}

const TopHeader = ({ toggleSidebar, user, isSidebarOpen }: Props) => {
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);

  return (
    <header className={styles.topHeader}>
      <div className={styles.leftSection}>
        <button 
          className={styles.menuButton} 
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu size={24} />
        </button>
        
        <div className={styles.searchBar}>
          <Search size={20} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search..." 
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.rightSection}>
        <button className={styles.notificationButton}>
          <Bell size={20} />
          <span className={styles.badge}>3</span>
        </button>

        <div className={styles.profileDropdown}>
          <button 
            className={styles.profileButton}
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            {user?.image ? (
              <Image 
                src={user.image} 
                alt="Profile" 
                width={32} 
                height={32} 
                className={styles.avatar}
              />
            ) : (
              <div className={styles.avatarPlaceholder}>
                {user?.name?.[0] || 'U'}
              </div>
            )}
            <span className={styles.userName}>{user?.name}</span>
            <ChevronDown size={16} />
          </button>

          {showProfileMenu && (
            <div className={styles.dropdownMenu}>
              <button className={styles.dropdownItem}>
                <User size={16} />
                <span>Profile</span>
              </button>
              <button className={styles.dropdownItem}>
                <Settings size={16} />
                <span>Settings</span>
              </button>
              <button 
                className={`${styles.dropdownItem} ${styles.logoutItem}`}
                onClick={() => signOut()}
              >
                <LogOut size={16} />
                <span>Sign out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopHeader;