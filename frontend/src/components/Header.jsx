import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, Home, PieChart, DollarSign, User, BarChart2 } from 'lucide-react';

function Header() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3001/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        navigate('/login');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navItems = [
    { to: "/dashboard", icon: Home, label: "Home" },
    { to: "/dashboard/expense", icon: DollarSign, label: "Expense" },
    { to: "/dashboard/budget", icon: PieChart, label: "Budget" },
    { to: "/dashboard/report", icon: BarChart2, label: "Report" },
    { to: "/dashboard/user", icon: User, label: "User" },
  ];

  return (
    <header className="bg-gradient-to-r from-purple-700 to-purple-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <h1 className="text-white text-xl font-bold tracking-wider">
              Track
              <span className="text-purple-300">Take</span>
            </h1>
          </div>

          {/* Navigation Items */}
          <nav className="hidden md:flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-purple-600 ${
                      isActive
                        ? "bg-white text-purple-700 font-medium shadow-md"
                        : "text-purple-100 hover:text-white"
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white 
                     hover:bg-purple-600 transition-all duration-300 border border-purple-400"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden py-2">
          <div className="flex flex-wrap gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-300 ${
                      isActive
                        ? "bg-white text-purple-700 font-medium shadow-md"
                        : "text-purple-100 hover:bg-purple-600 hover:text-white"
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;