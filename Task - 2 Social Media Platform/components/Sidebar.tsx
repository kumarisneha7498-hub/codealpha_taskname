import React from 'react';
import { Home, Search, PlusSquare, User, LogOut, Settings } from 'lucide-react';
import { User as UserType } from '../types';

interface SidebarProps {
  currentUser: UserType | null;
  onLogout: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentUser, onLogout, currentPage, onNavigate }) => {
  const navItems = [
    { id: 'feed', icon: Home, label: 'Home' },
    { id: 'explore', icon: Search, label: 'Explore' },
    { id: 'create', icon: PlusSquare, label: 'Create' },
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  if (!currentUser) return null;

  return (
    <div className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 border-r border-gray-200 bg-white z-10">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary tracking-tight">SocialSphere</h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors duration-200 group ${
              currentPage === item.id 
                ? 'bg-indigo-50 text-primary font-medium' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <item.icon className={`w-6 h-6 mr-4 ${currentPage === item.id ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600'}`} />
            <span className="text-lg">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
            onClick={onLogout}
            className="flex items-center w-full px-4 py-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
            <LogOut className="w-6 h-6 mr-4" />
            <span className="text-lg">Log out</span>
        </button>
        <div className="flex items-center mt-4 px-4 cursor-pointer" onClick={() => onNavigate('profile')}>
            <img src={currentUser.avatarUrl} alt="Profile" className="w-10 h-10 rounded-full object-cover border border-gray-200" />
            <div className="ml-3">
                <p className="text-sm font-semibold text-gray-900">{currentUser.name}</p>
                <p className="text-xs text-gray-500">@{currentUser.username}</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;