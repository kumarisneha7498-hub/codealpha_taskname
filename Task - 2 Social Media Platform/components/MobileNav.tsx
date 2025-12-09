import React from 'react';
import { Home, Search, PlusSquare, User } from 'lucide-react';

interface MobileNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ currentPage, onNavigate }) => {
  const navItems = [
    { id: 'feed', icon: Home, label: 'Home' },
    { id: 'explore', icon: Search, label: 'Explore' },
    { id: 'create', icon: PlusSquare, label: 'Create' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 px-6 py-3 flex justify-between items-center safe-area-bottom">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all ${
            currentPage === item.id ? 'text-primary' : 'text-gray-400'
          }`}
        >
          <item.icon className={`w-6 h-6 ${currentPage === item.id ? 'scale-110' : ''} transition-transform`} />
        </button>
      ))}
    </div>
  );
};

export default MobileNav;
