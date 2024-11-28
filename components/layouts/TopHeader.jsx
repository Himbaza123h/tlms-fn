import { useState } from 'react';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { 
  Menu, 
  Bell, 
  Search,
  ChevronDown,
  MessageSquare
} from 'lucide-react';

const Topbar = ({ onMenuClick }) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { data: session, status } = useSession();

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="menu-button" onClick={onMenuClick}>
          <Menu className="w-6 h-6" />
        </button>

        <div className="search-container">
        <Search className="search-icon" />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="search-input"
          />
        </div>
      </div>

      <div className="topbar-right">
        <div className="divider" />

        <div className="user-profile">
          <div 
            className="profile-trigger"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <div className="user-avatar">
              <Image
                src={session?.user.image}
                alt="User Avatar"
                width={40}
                height={40}
                className="avatar-image"
              />
              <span className="status-badge" />
            </div>
            
            <div className="user-info">
              <span className="user-name">{session?.user.name}</span>
            </div>
            
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;