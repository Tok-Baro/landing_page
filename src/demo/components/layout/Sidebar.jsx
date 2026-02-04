import {
  LayoutDashboard, Users, Building2, BarChart3, FileText, Settings, Shield, Eye, Moon, Sun,
  PanelLeftClose, PanelLeftOpen
} from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ darkMode, setDarkMode }) => {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { to: '/', label: '대시보드', icon: LayoutDashboard },
    { to: '/employees', label: '직원 관리', icon: Users },
    { to: '/organization', label: '조직 관리', icon: Building2 },
    { to: '/statistics', label: '통계 분석', icon: BarChart3 },
    { to: '/reports', label: '리포트', icon: FileText },
    { to: '/policy', label: '정책 설정', icon: Shield },
  ];

  return (
    <aside className={`${collapsed ? 'w-[72px]' : 'w-64'} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-full flex flex-col transition-all duration-200 flex-shrink-0`}>
      {/* Logo */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Eye className="text-white" size={20} />
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-bold text-gray-900 dark:text-white">똑바로</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">for Business</p>
            </div>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === '/'}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `w-full flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200'
                  }`
                }
              >
                <item.icon size={20} className="flex-shrink-0" />
                {!collapsed && item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-100 dark:border-gray-700 space-y-1">
        <button
          onClick={() => setDarkMode(!darkMode)}
          title={collapsed ? (darkMode ? '라이트 모드' : '다크 모드') : undefined}
          className={`w-full flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors`}
        >
          {darkMode ? <Sun size={20} className="flex-shrink-0" /> : <Moon size={20} className="flex-shrink-0" />}
          {!collapsed && (darkMode ? '라이트 모드' : '다크 모드')}
        </button>
        <NavLink
          to="/settings"
          title={collapsed ? '설정' : undefined}
          className={({ isActive }) =>
            `w-full flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isActive
                ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700'
            }`
          }
        >
          <Settings size={20} className="flex-shrink-0" />
          {!collapsed && '설정'}
        </NavLink>
        <button
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? '사이드바 펼치기' : '사이드바 접기'}
          className={`w-full flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-50 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition-colors`}
        >
          {collapsed ? <PanelLeftOpen size={20} className="flex-shrink-0" /> : <PanelLeftClose size={20} className="flex-shrink-0" />}
          {!collapsed && '사이드바 접기'}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
