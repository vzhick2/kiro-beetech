'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, Bell, User, Menu, X } from 'lucide-react';
import { NotificationsDropdown } from './notifications-dropdown';
import { UserMenuDropdown } from './user-menu-dropdown';

interface InteractiveHeaderProps {
  onMobileMenuToggle: () => void;
  isMobileMenuOpen: boolean;
}

export function InteractiveHeader({
  onMobileMenuToggle,
  isMobileMenuOpen,
}: InteractiveHeaderProps) {
  const [searchValue, setSearchValue] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Refs for click outside detection
  const notificationsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setIsNotificationsOpen(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdowns when the other opens
  const handleNotificationsToggle = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    setIsUserMenuOpen(false);
  };

  const handleUserMenuToggle = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
    setIsNotificationsOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      // Navigate to search page or handle search
      console.log('Searching for:', searchValue);
    }
  };

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50 shadow-lg"
        style={{
          touchAction: 'manipulation',
          WebkitUserSelect: 'none',
          userSelect: 'none',
        }}
      >
        <div className="flex items-center justify-between h-16 px-4 gap-4">
          {/* Left Section - Mobile Menu Only */}
          <div className="flex items-center">
            {/* Mobile Menu Toggle - Always visible */}
            <button
              onClick={onMobileMenuToggle}
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/30 transition-all duration-200 hover:scale-105 active:scale-95 z-10"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              style={{ minWidth: '40px', minHeight: '40px' }}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-slate-300" />
              ) : (
                <Menu className="w-5 h-5 text-slate-300" />
              )}
            </button>
          </div>

          {/* Center Section - Search Bar (Desktop) / Search Box (Mobile) */}
          <div className="flex-1 max-w-md mx-2 sm:mx-4">
            {/* Desktop Search Bar */}
            <div className="hidden md:block relative w-full">
              <div
                className={`relative flex items-center transition-all duration-300 ${
                  isSearchFocused ? 'scale-105' : 'scale-100'
                }`}
              >
                <Search className="absolute left-3 sm:left-4 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search items, purchases, suppliers..."
                  value={searchValue}
                  onChange={e => setSearchValue(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className={`w-full pl-9 sm:pl-11 pr-10 py-2 sm:py-3 bg-slate-800/50 border rounded-lg transition-all duration-300 placeholder-slate-400 text-slate-100 text-sm sm:text-base ${
                    isSearchFocused
                      ? 'border-blue-500/50 bg-slate-800/80 shadow-lg shadow-blue-500/10'
                      : 'border-slate-600/30 hover:border-slate-500/50'
                  }`}
                />
                {/* Clear button - only show when there's text */}
                {searchValue && (
                  <button
                    onClick={() => setSearchValue('')}
                    className="absolute right-3 sm:right-4 w-4 h-4 text-slate-400 hover:text-slate-200 transition-colors"
                    aria-label="Clear search"
                    type="button"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Search Box - Always visible on mobile */}
            <div className="md:hidden relative w-full">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchValue}
                  onChange={e => setSearchValue(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className={`w-full pl-10 pr-10 py-2 bg-slate-800/50 border rounded-lg text-slate-100 placeholder-slate-400 transition-all duration-200 ${
                    isSearchFocused
                      ? 'border-blue-500/50 bg-slate-800/80'
                      : 'border-slate-600/30'
                  }`}
                />
                {/* Clear button */}
                {searchValue && (
                  <button
                    type="button"
                    onClick={() => setSearchValue('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 hover:text-slate-200 transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </form>
            </div>
          </div>

          {/* Right Section - Actions with Modern Styling */}
          <div className="flex items-center gap-2">
            {/* Notifications - Modern Badge Style with Dropdown */}
            <div className="relative" ref={notificationsRef}>
              <button
                className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/30 transition-all duration-200 hover:scale-105 active:scale-95 group"
                aria-label="Notifications"
                onClick={handleNotificationsToggle}
              >
                <Bell className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" />
                {/* Notification indicator - shows when there are alerts */}
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-900 animate-pulse"></span>
              </button>

              <NotificationsDropdown
                isOpen={isNotificationsOpen}
                onClose={() => setIsNotificationsOpen(false)}
              />
            </div>

            {/* User Menu - Enhanced Profile Button with Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 border border-blue-500/30 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-blue-600/20"
                aria-label="User menu"
                onClick={handleUserMenuToggle}
              >
                <User className="w-5 h-5 text-white" />
              </button>

              <UserMenuDropdown
                isOpen={isUserMenuOpen}
                onClose={() => setIsUserMenuOpen(false)}
                userEmail="business@example.com"
                businessName="Bee Cosmetics Co."
              />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
