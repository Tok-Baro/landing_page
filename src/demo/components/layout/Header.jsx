import { useState, useRef, useEffect } from 'react';
import {
  Bell, Search, ChevronDown, LogOut, AlertTriangle,
  Clock, Shield, X, Monitor
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EmptyState from '../common/EmptyState';
import authService from '../../services/authService';

const NOTIFICATIONS = [
  { id: 1, type: 'risk', title: '박민수', message: '휴식 미준수 3일 연속', time: '5분 전', read: false },
  { id: 2, type: 'risk', title: '윤재호', message: '일평균 VDT 9시간 초과', time: '12분 전', read: false },
  { id: 3, type: 'policy', title: '정책 변경', message: '개발본부 커스텀 정책이 적용되었습니다', time: '1시간 전', read: false },
  { id: 4, type: 'system', title: '리포트 생성 완료', message: '2024년 12월 월간 건강 현황 리포트', time: '2시간 전', read: true },
  { id: 5, type: 'risk', title: '이영희', message: '자세 경고 빈번 발생', time: '3시간 전', read: true },
  { id: 6, type: 'system', title: '직원 초대 완료', message: '하민석님이 초대를 수락했습니다', time: '어제', read: true },
  { id: 7, type: 'policy', title: '근무시간 변경', message: 'CS본부 근무시간이 변경되었습니다', time: '어제', read: true },
];

const NOTIFICATION_CONFIG = {
  risk: { icon: AlertTriangle, color: 'bg-red-100 text-red-600', label: '위험 알림' },
  policy: { icon: Shield, color: 'bg-amber-100 text-amber-600', label: '정책' },
  system: { icon: Monitor, color: 'bg-blue-100 text-blue-600', label: '시스템' },
};

const FILTER_TABS = [
  { id: 'all', label: '전체' },
  { id: 'risk', label: '위험' },
  { id: 'policy', label: '정책' },
  { id: 'system', label: '시스템' },
];

const Header = ({ title }) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [notifFilter, setNotifFilter] = useState('all');
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markAsRead = (id) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const dismissNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const filteredNotifications = notifFilter === 'all'
    ? notifications
    : notifications.filter((n) => n.type === notifFilter);

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 transition-colors">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="직원, 부서, 정책 검색..."
            className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm w-64 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
        </div>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
            className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <Bell size={20} className="text-gray-600 dark:text-gray-300" />
            {unreadCount > 0 && (
              <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
              {/* Header */}
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">알림</h3>
                  {unreadCount > 0 && (
                    <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-medium">{unreadCount}</span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button onClick={markAllAsRead} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                    모두 읽음
                  </button>
                )}
              </div>

              {/* Filter Tabs */}
              <div className="px-4 py-2 border-b border-gray-50 dark:border-gray-700 flex gap-1">
                {FILTER_TABS.map((tab) => {
                  const count = tab.id === 'all' ? notifications.length : notifications.filter((n) => n.type === tab.id).length;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setNotifFilter(tab.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                        notifFilter === tab.id ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {tab.label}
                      <span className="ml-1 text-[10px] opacity-60">{count}</span>
                    </button>
                  );
                })}
              </div>

              {/* Notification List */}
              <div className="max-h-80 overflow-y-auto">
                {filteredNotifications.length === 0 ? (
                  <div className="py-2">
                    <EmptyState icon="bell" title="알림이 없습니다" description="새로운 알림이 오면 여기에 표시됩니다" />
                  </div>
                ) : (
                  filteredNotifications.map((notif) => {
                    const config = NOTIFICATION_CONFIG[notif.type];
                    const NotifIcon = config.icon;
                    return (
                      <div
                        key={notif.id}
                        onClick={() => markAsRead(notif.id)}
                        className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors border-b border-gray-50 dark:border-gray-700 last:border-0 ${
                          !notif.read ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-1.5 rounded-lg flex-shrink-0 ${config.color}`}>
                            <NotifIcon size={14} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className={`text-sm ${!notif.read ? 'font-semibold text-gray-900 dark:text-white' : 'font-medium text-gray-700 dark:text-gray-300'}`}>
                                {notif.title}
                              </p>
                              {!notif.read && <span className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0" />}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{notif.message}</p>
                            <div className="flex items-center gap-1 mt-1">
                              <Clock size={10} className="text-gray-400" />
                              <span className="text-[10px] text-gray-400">{notif.time}</span>
                            </div>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); dismissNotification(notif.id); }}
                            className="p-1 hover:bg-gray-200 rounded opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                          >
                            <X size={12} className="text-gray-400" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                <button className="w-full text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-medium text-center">
                  알림 설정
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Menu */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
            className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">김</span>
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">김관리자</span>
            <ChevronDown size={16} className="text-gray-400" />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-12 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
              <button
                onClick={async () => {
                  await authService.logout();
                  navigate('/login', { replace: true });
                }}
                className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
              >
                <LogOut size={16} /> 로그아웃
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
