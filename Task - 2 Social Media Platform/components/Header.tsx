import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { User } from '../types';
import { mockService } from '../services/mockBackend';

interface HeaderProps {
  onUserSelect: (username: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onUserSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const doSearch = async () => {
        if (!query.trim()) {
            setResults([]);
            return;
        }
        setIsSearching(true);
        try {
            const users = await mockService.searchUsers(query);
            setResults(users);
        } catch (e) {
            console.error(e);
        } finally {
            setIsSearching(false);
        }
    };
    
    // Debounce search
    const timeoutId = setTimeout(doSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200 px-4 py-3 mb-2">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex-1 relative" ref={searchRef}>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                    type="text"
                    placeholder="Search users..."
                    className="w-full pl-10 pr-10 py-2.5 bg-gray-100 border-transparent focus:bg-white border focus:border-primary rounded-full text-sm transition-all outline-none"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setShowResults(true);
                    }}
                    onFocus={() => setShowResults(true)}
                />
                {query && (
                    <button 
                        onClick={() => {
                            setQuery('');
                            setResults([]);
                        }}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Dropdown Results */}
            {showResults && (query.trim().length > 0) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden max-h-80 overflow-y-auto">
                    {isSearching ? (
                        <div className="p-4 text-center text-gray-500 text-xs">Searching...</div>
                    ) : results.length > 0 ? (
                        results.map(user => (
                            <div 
                                key={user.id}
                                onClick={() => {
                                    onUserSelect(user.username);
                                    setShowResults(false);
                                    setQuery('');
                                }}
                                className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0"
                            >
                                <img src={user.avatarUrl} alt={user.username} className="w-10 h-10 rounded-full object-cover" />
                                <div className="ml-3">
                                    <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                                    <p className="text-xs text-gray-500">@{user.username}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                         <div className="p-4 text-center text-gray-500 text-xs">No users found</div>
                    )}
                </div>
            )}
          </div>
      </div>
    </header>
  );
};

export default Header;