import { useMemo, useState } from 'react';
import { X, Monitor, Clock, AlertTriangle, Shield, Mail, Building2, Phone, Hash, FileText, Check } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { orgDivisions } from '../../data/sampleData';
import useDarkMode from '../../hooks/useDarkMode';

// Find department path (division > team > part)
const findDeptPath = (divisions, departmentId) => {
  for (const div of divisions) {
    if (div.id === departmentId) return [div.name];
    if (div.children) {
      for (const team of div.children) {
        if (team.id === departmentId) return [div.name, team.name];
        if (team.children) {
          for (const part of team.children) {
            if (part.id === departmentId) return [div.name, team.name, part.name];
          }
        }
      }
    }
  }
  return ['미배정'];
};

// Generate mock weekly VDT data for the employee
const generateWeeklyData = (avgVDT, compliance) => {
  const days = ['월', '화', '수', '목', '금'];
  return days.map((day, i) => ({
    day,
    vdt: Math.max(2, +(avgVDT + (Math.sin(i * 1.5) * 1.2)).toFixed(1)),
    compliance: Math.min(100, Math.max(0, Math.round(compliance + Math.cos(i * 1.3) * 12))),
  }));
};

// Generate mock monthly trend
const generateMonthlyTrend = (avgVDT, compliance) => {
  const months = ['8월', '9월', '10월', '11월', '12월', '1월'];
  return months.map((month, i) => ({
    month,
    vdt: Math.max(3, +(avgVDT + (Math.sin(i * 0.8) * 0.8) - (i * 0.1)).toFixed(1)),
    compliance: Math.min(100, Math.max(20, Math.round(compliance + i * 2 + Math.cos(i) * 8))),
  }));
};

const EmployeeProfileModal = ({ employee, onClose, onUpdateMemo }) => {
  const deptPath = useMemo(() => employee ? findDeptPath(orgDivisions, employee.departmentId) : [], [employee]);
  const weeklyData = useMemo(() => employee ? generateWeeklyData(employee.avgVDT, employee.compliance) : [], [employee]);
  const monthlyTrend = useMemo(() => employee ? generateMonthlyTrend(employee.avgVDT, employee.compliance) : [], [employee]);

  const [isEditingMemo, setIsEditingMemo] = useState(false);
  const [memoText, setMemoText] = useState(employee?.memo || '');

  const isDark = useDarkMode();

  if (!employee) return null;

  const axisColor = isDark ? '#9ca3af' : '#6b7280';
  const gridColor = isDark ? '#374151' : '#e5e7eb';
  const tooltipBg = isDark ? '#1f2937' : '#fff';
  const tooltipBorder = isDark ? '#374151' : '#e5e7eb';
  const tooltipText = isDark ? '#f3f4f6' : '#111827';

  const statusConfig = {
    active: { label: '활성', color: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' },
    warning: { label: '주의', color: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800' },
    offline: { label: '오프라인', color: 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600' },
    pending: { label: '미설치', color: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800' },
  };

  const status = statusConfig[employee.status] || statusConfig.active;
  const isAtRisk = employee.compliance < 60;
  const complianceColor = employee.compliance >= 80 ? 'text-green-600' : employee.compliance >= 60 ? 'text-amber-600' : 'text-red-600';

  const handleSaveMemo = () => {
    if (onUpdateMemo) {
      onUpdateMemo(employee.id, memoText.trim());
    }
    setIsEditingMemo(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl flex items-center justify-center">
              <span className="text-white text-xl font-bold">{employee.name[0]}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{employee.name}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${status.color}`}>{status.label}</span>
                {isAtRisk && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600 border border-red-200 dark:bg-red-900/20 dark:border-red-800 flex items-center gap-1">
                    <AlertTriangle size={10} /> 위험군
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1">
                <Building2 size={12} /> {deptPath.join(' > ')} / {employee.position}
              </p>
              <div className="flex items-center flex-wrap gap-3 mt-1 text-xs text-gray-400">
                <span className="flex items-center gap-1"><Mail size={10} /> {employee.email}</span>
                {employee.extension && <span className="flex items-center gap-1"><Hash size={10} /> 내선 {employee.extension}</span>}
                {employee.phone && <span className="flex items-center gap-1"><Phone size={10} /> {employee.phone}</span>}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl">
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Monitor size={14} className="text-indigo-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{employee.avgVDT}h</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">일평균 VDT</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Clock size={14} className="text-green-500" />
              </div>
              <p className={`text-2xl font-bold ${complianceColor}`}>{employee.compliance}%</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">휴식 준수율</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Monitor size={14} className="text-purple-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{employee.todayVDT}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">오늘 VDT</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Clock size={14} className="text-gray-500" />
              </div>
              <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">{employee.lastActive}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">마지막 활동</p>
            </div>
          </div>

          {/* Admin Memo */}
          <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-amber-600 dark:text-amber-400" />
                <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-300">관리자 메모</h4>
              </div>
              {!isEditingMemo && (
                <button
                  onClick={() => { setMemoText(employee.memo || ''); setIsEditingMemo(true); }}
                  className="text-xs text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 font-medium"
                >
                  {employee.memo ? '수정' : '작성'}
                </button>
              )}
            </div>
            {isEditingMemo ? (
              <div className="space-y-2">
                <textarea
                  value={memoText}
                  onChange={(e) => setMemoText(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-amber-200 dark:border-amber-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                  placeholder="직원에 대한 메모를 작성하세요..."
                  autoFocus
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsEditingMemo(false)}
                    className="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleSaveMemo}
                    className="px-3 py-1.5 text-xs font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg flex items-center gap-1"
                  >
                    <Check size={12} /> 저장
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-amber-700 dark:text-amber-300/80">
                {employee.memo || '작성된 메모가 없습니다.'}
              </p>
            )}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-2 gap-4">
            {/* Weekly VDT Chart */}
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">이번 주 VDT 시간</h4>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: axisColor }} />
                  <YAxis domain={[0, 12]} tick={{ fontSize: 11, fill: axisColor }} />
                  <Tooltip
                    formatter={(v) => `${v}시간`}
                    contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: '8px', color: tooltipText }}
                    labelStyle={{ color: tooltipText }}
                  />
                  <Bar dataKey="vdt" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Monthly Compliance Trend */}
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">월별 휴식 준수율 추이</h4>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: axisColor }} />
                  <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11, fill: axisColor }} />
                  <Tooltip
                    formatter={(v) => `${v}%`}
                    contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: '8px', color: tooltipText }}
                    labelStyle={{ color: tooltipText }}
                  />
                  <Line type="monotone" dataKey="compliance" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Risk Assessment */}
          {isAtRisk && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={16} className="text-red-600" />
                <h4 className="text-sm font-semibold text-red-700">위험 요소 분석</h4>
              </div>
              <ul className="space-y-1.5 text-sm text-red-700">
                {employee.avgVDT > 8 && <li>- 일평균 VDT {employee.avgVDT}시간으로 권장 기준(8시간) 초과</li>}
                {employee.compliance < 50 && <li>- 휴식 준수율 {employee.compliance}%로 최소 기준(50%) 미달</li>}
                {employee.compliance < 60 && <li>- 최근 휴식 미준수 패턴 감지, 관리자 면담 권고</li>}
              </ul>
            </div>
          )}

          {/* Applied Policy Info */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Shield size={16} className="text-indigo-600" />
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">적용 정책</h4>
            </div>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">연속 작업 시간</p>
                <p className="font-medium text-gray-900 dark:text-white">50분</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">최소 휴식 시간</p>
                <p className="font-medium text-gray-900 dark:text-white">10분</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">알림 모드</p>
                <p className="font-medium text-gray-900 dark:text-white">표준 모드</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">스누즈 허용</p>
                <p className="font-medium text-gray-900 dark:text-white">2회</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">근무시간</p>
                <p className="font-medium text-gray-900 dark:text-white">09:00 - 18:00</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">정책 출처</p>
                <p className="font-medium text-indigo-600">{deptPath[0] || '전사'} 기본</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-100 dark:border-gray-700">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            닫기
          </button>
          <button
            onClick={() => { setMemoText(employee.memo || ''); setIsEditingMemo(true); }}
            className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 flex items-center gap-2"
          >
            <FileText size={16} />
            관리자 메모 {employee.memo ? '수정' : '작성'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfileModal;
