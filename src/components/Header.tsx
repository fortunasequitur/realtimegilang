import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sun, Moon, User, LogOut, Menu, X } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Live Performs', href: '/live-performs' },
    { name: 'Statistics', href: '/statistics' },
    { name: 'Conversions', href: '/conversions' },
    { name: 'Performs Team', href: '/performs-team' },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center h-auto py-2 gap-2">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="text-lg sm:text-xl font-bold text-primary">
              GILANG TEAM
            </Link>
          </div>

          {/* Navigation */}
          {/* Mobile: horizontal scrollable */}
          <nav className="w-full flex-1 flex items-center justify-center overflow-x-auto gap-1 sm:gap-4 scrollbar-hide md:hidden">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  location.pathname === item.href
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          {/* Desktop: rata tengah, gap besar, tidak scrollable */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.href
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center space-x-1 sm:space-x-2 mt-2 sm:mt-0">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="w-8 h-8 sm:w-9 sm:h-9 p-0"
            >
              {theme === 'light' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>

            {/* User Icon: Langsung Logout */}
            <Button
              variant="ghost"
              size="sm"
              className="w-8 h-8 sm:w-9 sm:h-9 p-0"
              onClick={handleLogout}
              title="Logout"
            >
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
