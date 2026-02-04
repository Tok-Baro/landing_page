import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import DashboardPage from './pages/DashboardPage';
import EmployeesPage from './pages/EmployeesPage';
import OrganizationPage from './pages/OrganizationPage';
import StatisticsPage from './pages/StatisticsPage';
import ReportsPage from './pages/ReportsPage';
import PolicyPage from './pages/PolicyPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { ToastProvider } from './contexts/ToastContext';
import authService from './services/authService';

const PAGE_TITLES = {
  '/demo': '대시보드',
  '/demo/employees': '직원 관리',
  '/demo/organization': '조직 관리',
  '/demo/statistics': '통계 분석',
  '/demo/reports': '리포트',
  '/demo/policy': '정책 설정',
  '/demo/settings': '설정',
};

function PrivateRoute({ children }) {
  // 데모 모드: 자동 로그인
  useEffect(() => {
    if (!authService.isAuthenticated()) {
      authService.login('admin@company.com', 'admin1234').catch(() => {
        // 로그인 실패 시 무시 (이미 로그인된 상태일 수 있음)
      });
    }
  }, []);

  return children;
}

function PublicRoute({ children }) {
  return authService.isAuthenticated() ? <Navigate to="" replace /> : children;
}

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();
  const isAuthPage = location.pathname.endsWith('/login') || location.pathname.endsWith('/register');
  const title = PAGE_TITLES[location.pathname] || '대시보드';

  // Auth pages — no sidebar/header
  if (isAuthPage) {
    return (
      <Routes>
        <Route path="login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      </Routes>
    );
  }

  return (
    <div className={`h-screen bg-gray-50 dark:bg-gray-900 flex overflow-hidden transition-colors ${darkMode ? 'dark' : ''}`}>
      <ToastProvider>
        <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} />
        <div className="flex-1 flex flex-col min-w-0">
          <Header title={title} />
          <main className="flex-1 overflow-auto">
            <div key={location.pathname} className="animate-fade-in">
              <Routes>
                <Route path="/" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
                <Route path="employees" element={<PrivateRoute><EmployeesPage /></PrivateRoute>} />
                <Route path="organization" element={<PrivateRoute><OrganizationPage /></PrivateRoute>} />
                <Route path="statistics" element={<PrivateRoute><StatisticsPage /></PrivateRoute>} />
                <Route path="reports" element={<PrivateRoute><ReportsPage /></PrivateRoute>} />
                <Route path="policy" element={<PrivateRoute><PolicyPage /></PrivateRoute>} />
                <Route path="settings" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
                <Route path="*" element={<Navigate to="" replace />} />
              </Routes>
            </div>
          </main>
        </div>
      </ToastProvider>
    </div>
  );
}
