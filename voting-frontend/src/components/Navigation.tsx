import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Vote, Home, UserCircle, Sun, Moon, Search } from 'lucide-react';

const Navigation: React.FC = () => {
  const [isDark, setIsDark] = useState(false);
  const location = useLocation();

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-red-100 dark:border-red-900">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Vote className="w-8 h-8 text-red-600 dark:text-red-500" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">BlockVote</span>
          </Link>

          <div className="flex items-center space-x-4">
            {[
              { path: '/', icon: Home, label: 'Home' },
              { path: '/elections', icon: Search, label: 'Browse' },
              { path: '/dashboard', icon: UserCircle, label: 'Dashboard' },
            ].map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className="relative px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 transition-colors"
              >
                <Icon className="w-5 h-5" />
                {location.pathname === path && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 bg-red-100 dark:bg-red-900/50 rounded-lg -z-10"
                  />
                )}
              </Link>
            ))}
            
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;