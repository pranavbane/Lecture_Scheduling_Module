import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Calendar,
  UserCircle,
  Settings,
  LogOut,
  X,
  GraduationCap,
  Clock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, isMobile, toggleSidebar }) => {
  const { user, logout } = useAuth();

  const adminLinks = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/courses', icon: BookOpen, label: 'Courses' },
    { to: '/admin/instructors', icon: Users, label: 'Instructors' },
    { to: '/admin/lectures', icon: Calendar, label: 'Lectures' },
    { to: '/admin/profile', icon: UserCircle, label: 'Profile' },
  ];

  const instructorLinks = [
    { to: '/instructor/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/instructor/lectures', icon: Calendar, label: 'My Lectures' },
    { to: '/instructor/profile', icon: UserCircle, label: 'Profile' },
  ];

  const links = user?.role === 'admin' ? adminLinks : instructorLinks;

  const sidebarVariants = {
    open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { x: -280, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={toggleSidebar}
        />
      )}

      <motion.aside
        initial={false}
        animate={isOpen ? 'open' : 'closed'}
        variants={sidebarVariants}
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col ${
          isMobile ? 'shadow-xl' : ''
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-primary-500" />
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">LectureHub</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">College Scheduler</p>
            </div>
          </div>
          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <div className="space-y-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `sidebar-link ${
                    isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'
                  }`
                }
                onClick={() => isMobile && toggleSidebar()}
              >
                <link.icon className="w-5 h-5" />
                <span className="font-medium">{link.label}</span>
              </NavLink>
            ))}
          </div>

          {/* Bottom Section */}
          <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={logout}
              className="sidebar-link sidebar-link-inactive w-full"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </nav>

        {/* User Info */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.role === 'admin' ? 'Administrator' : 'Instructor'}
              </p>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;