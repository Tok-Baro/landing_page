import { useState, useMemo, useEffect } from 'react';
import { Users, Monitor, Clock, AlertTriangle, ChevronRight, Plus, FileText, Settings, X } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/common/StatCard';
import EmployeeProfileModal from '../components/common/EmployeeProfileModal';
import useDarkMode from '../hooks/useDarkMode';
import dashboardService from '../services/dashboardService';

const DashboardPage = () => {
  const navigate = useNavigate();
  const isDark = useDarkMode();
  const [showWelcome, setShowWelcome] = useState(true);
  const [profileEmployee, setProfileEmployee] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [weeklyTrendData, setWeeklyTrendData] = useState([]);
  const [stats, setStats] = useState({ activeCount: 0, avgVDT: '0', avgCompliance: 0, riskCount: 0 });

  useEffect(() => {
    const load = async () => {
      const [emps, deptChart, trend, dashStats] = await Promise.all([
        dashboardService.getAllEmployees(),
        dashboardService.getDepartmentChart(),
        dashboardService.getWeeklyTrend(),
        dashboardService.getStats(),
      ]);
      setEmployees(emps);
      setDepartmentData(deptChart);
      setWeeklyTrendData(trend);
      setStats(dashStats);
    };
    load();
  }, []);

  const riskEmployees = useMemo(
    () => employees.filter((e) => e.compliance > 0 && e.compliance < 60),
    [employees]
  );
  const axisColor = isDark ? '#9ca3af' : '#6b7280';
  const gridColor = isDark ? '#374151' : '#e5e7eb';
  const tooltipBg = isDark ? '#1f2937' : '#fff';
  const tooltipBorder = isDark ? '#374151' : '#e5e7eb';
  const tooltipText = isDark ? '#f3f4f6' : '#111827';

  const quickActions = [
    { label: '직원 초대하기', desc: '새 직원 등록', icon: Plus, color: 'indigo', to: '/employees' },
    { label: '리포트 생성', desc: '법적 준수 문서', icon: FileText, color: 'green', to: '/reports' },
    { label: '정책 수정', desc: '휴식 규칙 설정', icon: Settings, color: 'purple', to: '/policy' },
  ];

  const colorMap = {
    indigo: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  };

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      {showWelcome && (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white relative">
          <button
            onClick={() => setShowWelcome(false)}
            className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/20 transition-colors"
          >
            <X size={18} />
          </button>
          <h2 className="text-2xl font-bold mb-1">안녕하세요, 김관리자님 👋</h2>
          <p className="text-indigo-100">오늘은 2025년 1월 20일 월요일입니다</p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard title="활성 직원" value={`${stats.activeCount}명`} subtext={`전체 ${employees.length}명`} icon={Users} color="blue" />
        <StatCard title="평균 VDT 시간" value={`${stats.avgVDT}시간`} subtext="전일 대비" trend={-5} icon={Monitor} color="purple" />
        <StatCard title="휴식 준수율" value={`${stats.avgCompliance}%`} subtext="전일 대비" trend={5} icon={Clock} color="green" />
        <StatCard title="위험군" value={`${stats.riskCount}명`} subtext="즉시 확인 필요" icon={AlertTriangle} color="amber" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Department Chart */}
        <div className="col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">부서별 휴식 준수율</h3>
            <select className="text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1.5 text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700">
              <option>오늘</option>
              <option>이번 주</option>
              <option>이번 달</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={departmentData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke={gridColor} />
              <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fill: axisColor }} />
              <YAxis type="category" dataKey="name" width={80} tick={{ fill: axisColor }} />
              <Tooltip
                formatter={(v) => `${v}%`}
                contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: '8px', color: tooltipText }}
                labelStyle={{ color: tooltipText }}
              />
              <Bar dataKey="compliance" radius={[0, 8, 8, 0]} fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Alerts */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">⚠️ 위험군 알림</h3>
            <button
              onClick={() => navigate('/employees')}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-medium"
            >
              모두 보기
            </button>
          </div>
          <div className="space-y-3">
            {riskEmployees.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">위험군 직원이 없습니다</p>
            ) : (
              riskEmployees.map((emp) => (
                <button
                  key={emp.id}
                  onClick={() => setProfileEmployee(emp)}
                  className="w-full text-left p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800/30 hover:border-red-300 dark:hover:border-red-700 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg">
                      <AlertTriangle size={16} className="text-red-600 dark:text-red-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">{emp.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                        {emp.avgVDT > 8 ? `일평균 VDT ${emp.avgVDT}시간 초과` : `휴식 준수율 ${emp.compliance}%`}
                        {emp.compliance < 50 ? ' · 최소 기준 미달' : ''}
                      </p>
                    </div>
                    <ChevronRight size={18} className="text-gray-400" />
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Weekly Trend */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">이번 주 추이</h3>
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-indigo-500 rounded-full"></span>
              평균 VDT (시간)
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              휴식 준수율 (%)
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={weeklyTrendData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
            <XAxis dataKey="day" tick={{ fill: axisColor }} />
            <YAxis yAxisId="left" domain={[0, 10]} tick={{ fill: axisColor }} />
            <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fill: axisColor }} />
            <Tooltip
              contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: '8px', color: tooltipText }}
              labelStyle={{ color: tooltipText }}
            />
            <Line yAxisId="left" type="monotone" dataKey="vdt" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1' }} />
            <Line yAxisId="right" type="monotone" dataKey="compliance" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-4">
        {quickActions.map((action) => (
          <button
            key={action.to}
            onClick={() => navigate(action.to)}
            className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4"
          >
            <div className={`p-3 rounded-xl ${colorMap[action.color]}`}>
              <action.icon size={20} />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900 dark:text-white">{action.label}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{action.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Employee Profile Modal */}
      {profileEmployee && (
        <EmployeeProfileModal
          employee={profileEmployee}
          onClose={() => setProfileEmployee(null)}
          onUpdateMemo={(empId, memo) => {
            setEmployees((prev) => prev.map((e) => e.id === empId ? { ...e, memo } : e));
            setProfileEmployee((prev) => prev && prev.id === empId ? { ...prev, memo } : prev);
          }}
        />
      )}
    </div>
  );
};

export default DashboardPage;
