import { useState, useMemo, useEffect } from 'react';
import { Download, Building2, Users, Clock, Shield, AlertTriangle, ChevronRight, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import useDarkMode from '../hooks/useDarkMode';
import employeeService from '../services/employeeService';
import departmentService from '../services/departmentService';

// --- Helpers ---
function getAllNodeIds(node) {
  const ids = [node.id];
  node.children?.forEach((c) => ids.push(...getAllNodeIds(c)));
  return ids;
}

const levelLabels = { division: '본부', team: '팀', part: '파트' };
const STATUS_COLORS = {
  active: { label: '활성', color: '#22c55e' },
  warning: { label: '주의', color: '#f59e0b' },
  offline: { label: '오프라인', color: '#9ca3af' },
  pending: { label: '미설치', color: '#6366f1' },
};

const StatisticsPage = () => {
  const isDark = useDarkMode();
  const axisColor = isDark ? '#9ca3af' : '#6b7280';
  const gridColor = isDark ? '#374151' : '#e5e7eb';
  const tooltipBg = isDark ? '#1f2937' : '#fff';
  const tooltipBorder = isDark ? '#374151' : '#e5e7eb';
  const tooltipText = isDark ? '#f3f4f6' : '#111827';

  const [selectedDivisionId, setSelectedDivisionId] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [divisions, setDivisions] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [emps, divs] = await Promise.all([
        employeeService.getAll(),
        departmentService.getTree(),
      ]);
      setEmployees(emps);
      setDivisions(divs);
    };
    load();
  }, []);

  // --- Compute division-level stats ---
  const divisionStats = useMemo(() => {
    return divisions.map((div) => {
      const allIds = getAllNodeIds(div);
      const emps = employees.filter((e) => allIds.includes(e.departmentId));
      const activeEmps = emps.filter((e) => e.avgVDT > 0);
      return {
        id: div.id,
        name: div.name,
        level: div.level,
        children: div.children,
        employeeCount: emps.length,
        avgVDT: activeEmps.length > 0 ? +(activeEmps.reduce((s, e) => s + e.avgVDT, 0) / activeEmps.length).toFixed(1) : 0,
        avgCompliance: activeEmps.length > 0 ? Math.round(activeEmps.reduce((s, e) => s + e.compliance, 0) / activeEmps.length) : 0,
        warningCount: emps.filter((e) => e.status === 'warning').length,
        statusBreakdown: Object.keys(STATUS_COLORS).map((s) => ({
          name: STATUS_COLORS[s].label,
          value: emps.filter((e) => e.status === s).length,
          color: STATUS_COLORS[s].color,
        })).filter((d) => d.value > 0),
      };
    });
  }, [employees]);

  // --- Company-wide totals ---
  const companyStats = useMemo(() => {
    const activeEmps = employees.filter((e) => e.avgVDT > 0);
    return {
      total: employees.length,
      avgVDT: activeEmps.length > 0 ? +(activeEmps.reduce((s, e) => s + e.avgVDT, 0) / activeEmps.length).toFixed(1) : 0,
      avgCompliance: activeEmps.length > 0 ? Math.round(activeEmps.reduce((s, e) => s + e.compliance, 0) / activeEmps.length) : 0,
      warningCount: employees.filter((e) => e.status === 'warning').length,
    };
  }, [employees]);

  // --- Selected division detail ---
  const selectedDivision = useMemo(() => {
    if (!selectedDivisionId) return null;
    const div = divisions.find((d) => d.id === selectedDivisionId);
    if (!div) return null;

    const allIds = getAllNodeIds(div);
    const divEmps = employees.filter((e) => allIds.includes(e.departmentId));

    const teamStats = div.children.map((team) => {
      const teamIds = getAllNodeIds(team);
      const teamEmps = employees.filter((e) => teamIds.includes(e.departmentId));
      const activeTeamEmps = teamEmps.filter((e) => e.avgVDT > 0);

      const partStats = team.children?.map((part) => {
        const partEmps = employees.filter((e) => e.departmentId === part.id);
        const activePartEmps = partEmps.filter((e) => e.avgVDT > 0);
        return {
          id: part.id,
          name: part.name,
          level: part.level,
          employeeCount: partEmps.length,
          avgVDT: activePartEmps.length > 0 ? +(activePartEmps.reduce((s, e) => s + e.avgVDT, 0) / activePartEmps.length).toFixed(1) : 0,
          avgCompliance: activePartEmps.length > 0 ? Math.round(activePartEmps.reduce((s, e) => s + e.compliance, 0) / activePartEmps.length) : 0,
          warningCount: partEmps.filter((e) => e.status === 'warning').length,
        };
      }) || [];

      return {
        id: team.id,
        name: team.name,
        level: team.level,
        employeeCount: teamEmps.length,
        avgVDT: activeTeamEmps.length > 0 ? +(activeTeamEmps.reduce((s, e) => s + e.avgVDT, 0) / activeTeamEmps.length).toFixed(1) : 0,
        avgCompliance: activeTeamEmps.length > 0 ? Math.round(activeTeamEmps.reduce((s, e) => s + e.compliance, 0) / activeTeamEmps.length) : 0,
        warningCount: teamEmps.filter((e) => e.status === 'warning').length,
        parts: partStats,
      };
    });

    const riskEmps = [...divEmps]
      .filter((e) => e.avgVDT > 0)
      .sort((a, b) => a.compliance - b.compliance)
      .slice(0, 5);

    const statusBreakdown = Object.keys(STATUS_COLORS).map((s) => ({
      name: STATUS_COLORS[s].label,
      value: divEmps.filter((e) => e.status === s).length,
      color: STATUS_COLORS[s].color,
    })).filter((d) => d.value > 0);

    const activeDivEmps = divEmps.filter((e) => e.avgVDT > 0);

    return {
      ...div,
      teamStats,
      riskEmps,
      statusBreakdown,
      totalEmps: divEmps.length,
      avgVDT: activeDivEmps.length > 0 ? +(activeDivEmps.reduce((s, e) => s + e.avgVDT, 0) / activeDivEmps.length).toFixed(1) : 0,
      avgCompliance: activeDivEmps.length > 0 ? Math.round(activeDivEmps.reduce((s, e) => s + e.compliance, 0) / activeDivEmps.length) : 0,
      warningCount: divEmps.filter((e) => e.status === 'warning').length,
    };
  }, [selectedDivisionId, employees]);

  const vdtChartData = divisionStats.map((d) => ({ name: d.name, avgVDT: d.avgVDT }));
  const complianceChartData = divisionStats.map((d) => ({ name: d.name, compliance: d.avgCompliance }));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">통계 분석</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">부서별 건강 데이터를 상세 분석합니다</p>
        </div>
        <div className="flex gap-3">
          <select className="px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700">
            <option>이번 주</option>
            <option>이번 달</option>
            <option>최근 3개월</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            <Download size={18} />
            내보내기
          </button>
        </div>
      </div>

      {/* Company Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <SummaryCard icon={Users} color="blue" title="전체 직원" value={`${companyStats.total}명`} />
        <SummaryCard icon={Clock} color="purple" title="전사 평균 VDT" value={`${companyStats.avgVDT}시간`} />
        <SummaryCard icon={Shield} color="green" title="전사 휴식 준수율" value={`${companyStats.avgCompliance}%`} />
        <SummaryCard icon={AlertTriangle} color="amber" title="주의 직원" value={`${companyStats.warningCount}명`} />
      </div>

      {/* Department Overview Charts */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">본부별 평균 VDT</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={vdtChartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: axisColor }} />
              <YAxis tick={{ fontSize: 12, fill: axisColor }} unit="h" />
              <Tooltip
                formatter={(v) => `${v}시간`}
                contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: '8px', color: tooltipText }}
                labelStyle={{ color: tooltipText }}
              />
              <Bar dataKey="avgVDT" fill="#6366f1" radius={[8, 8, 0, 0]} name="평균 VDT" cursor="pointer"
                onClick={(d) => { const div = divisions.find((dv) => dv.name === d.name); if (div) setSelectedDivisionId(div.id); }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">본부별 휴식 준수율</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={complianceChartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: axisColor }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: axisColor }} tickFormatter={(v) => `${v}%`} />
              <Tooltip
                formatter={(v) => `${v}%`}
                contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: '8px', color: tooltipText }}
                labelStyle={{ color: tooltipText }}
              />
              <Bar dataKey="compliance" fill="#22c55e" radius={[8, 8, 0, 0]} name="준수율" cursor="pointer"
                onClick={(d) => { const div = divisions.find((dv) => dv.name === d.name); if (div) setSelectedDivisionId(div.id); }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Division Cards */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">본부별 상세 현황</h3>
        <div className="grid grid-cols-5 gap-4">
          {divisionStats.map((div) => (
            <button
              key={div.id}
              onClick={() => setSelectedDivisionId(selectedDivisionId === div.id ? null : div.id)}
              className={`bg-white dark:bg-gray-800 rounded-2xl border p-5 text-left transition-all hover:shadow-md ${
                selectedDivisionId === div.id
                  ? 'border-indigo-300 dark:border-indigo-500 ring-2 ring-indigo-100 dark:ring-indigo-900/50 shadow-md'
                  : 'border-gray-100 dark:border-gray-700 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <Building2 size={18} className="text-indigo-500" />
                <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">{div.name}</span>
              </div>
              <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex justify-between">
                  <span>인원</span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">{div.employeeCount}명</span>
                </div>
                <div className="flex justify-between">
                  <span>평균 VDT</span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">{div.avgVDT}h</span>
                </div>
                <div className="flex justify-between">
                  <span>준수율</span>
                  <span className={`font-medium ${div.avgCompliance >= 80 ? 'text-green-600' : div.avgCompliance >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                    {div.avgCompliance}%
                  </span>
                </div>
                {div.warningCount > 0 && (
                  <div className="flex justify-between">
                    <span>주의</span>
                    <span className="font-medium text-amber-600">{div.warningCount}명</span>
                  </div>
                )}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${div.avgCompliance >= 80 ? 'bg-green-500' : div.avgCompliance >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                    style={{ width: `${div.avgCompliance}%` }}
                  />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Division Detail Panel */}
      {selectedDivision && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-indigo-50 dark:from-indigo-900/20 to-white dark:to-gray-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl">
                <Building2 size={22} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedDivision.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{selectedDivision.children.length}개 팀 · {selectedDivision.totalEmps}명</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-4 gap-4">
              <MiniStat label="소속 인원" value={`${selectedDivision.totalEmps}명`} />
              <MiniStat label="평균 VDT" value={`${selectedDivision.avgVDT}h`} />
              <MiniStat label="평균 준수율" value={`${selectedDivision.avgCompliance}%`} />
              <MiniStat label="주의 직원" value={`${selectedDivision.warningCount}명`} warning />
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-1.5">
                  <BarChart3 size={16} className="text-indigo-500" />
                  팀별 비교
                </h4>
                {selectedDivision.teamStats.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={selectedDivision.teamStats} barGap={4}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: axisColor }} />
                      <YAxis yAxisId="vdt" tick={{ fontSize: 11, fill: axisColor }} unit="h" />
                      <YAxis yAxisId="comp" orientation="right" domain={[0, 100]} tick={{ fontSize: 11, fill: axisColor }} tickFormatter={(v) => `${v}%`} />
                      <Tooltip contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: '8px', color: tooltipText }} labelStyle={{ color: tooltipText }} />
                      <Bar yAxisId="vdt" dataKey="avgVDT" fill="#6366f1" radius={[6, 6, 0, 0]} name="평균 VDT (h)" barSize={28} />
                      <Bar yAxisId="comp" dataKey="avgCompliance" fill="#22c55e" radius={[6, 6, 0, 0]} name="준수율 (%)" barSize={28} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[220px] flex items-center justify-center text-sm text-gray-400 dark:text-gray-500">하위 팀이 없습니다</div>
                )}
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">직원 상태 분포</h4>
                {selectedDivision.statusBreakdown.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={selectedDivision.statusBreakdown} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                        {selectedDivision.statusBreakdown.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                      <Legend iconType="circle" iconSize={8} formatter={(v) => <span className="text-xs text-gray-600 dark:text-gray-400">{v}</span>} />
                      <Tooltip formatter={(v) => `${v}명`} contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: '8px', color: tooltipText }} labelStyle={{ color: tooltipText }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[220px] flex items-center justify-center text-sm text-gray-400 dark:text-gray-500">데이터 없음</div>
                )}
              </div>
            </div>

            {/* Team & Part detail table */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">팀/파트별 상세</h4>
              <div className="border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700/50">
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">조직</th>
                      <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">구분</th>
                      <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">인원</th>
                      <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">평균 VDT</th>
                      <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">준수율</th>
                      <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">주의</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedDivision.teamStats.map((team) => (
                      <TeamRow key={team.id} team={team} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Risk employees */}
            {selectedDivision.riskEmps.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-1.5">
                  <AlertTriangle size={16} className="text-amber-500" />
                  준수율 하위 직원 (Top 5)
                </h4>
                <div className="space-y-2">
                  {selectedDivision.riskEmps.map((emp) => (
                    <div key={emp.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <div className="w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-gray-600 dark:text-gray-300 text-xs font-medium">{emp.name[0]}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{emp.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{emp.position}</p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="text-right">
                          <p className="text-xs text-gray-500 dark:text-gray-400">VDT</p>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{emp.avgVDT}h</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500 dark:text-gray-400">준수율</p>
                          <p className={`text-sm font-bold ${emp.compliance >= 60 ? 'text-amber-600' : 'text-red-600'}`}>{emp.compliance}%</p>
                        </div>
                        <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${emp.compliance >= 60 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${emp.compliance}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// --- Sub-components ---

const SummaryCard = ({ icon, color, title, value }) => {
  const Icon = icon;
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    green: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  };
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-xl ${colorClasses[color]}`}>
          <Icon size={20} />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
      </div>
    </div>
  );
};

const MiniStat = ({ label, value, warning }) => (
  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
    <p className={`text-lg font-bold ${warning ? 'text-amber-600' : 'text-gray-900 dark:text-white'}`}>{value}</p>
  </div>
);

const TeamRow = ({ team }) => (
  <>
    <tr className="border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30">
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          <ChevronRight size={14} className="text-gray-400" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">{team.name}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-center">
        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">{levelLabels[team.level]}</span>
      </td>
      <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400">{team.employeeCount}명</td>
      <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400">{team.avgVDT}h</td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-center gap-2">
          <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${team.avgCompliance >= 80 ? 'bg-green-500' : team.avgCompliance >= 60 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${team.avgCompliance}%` }} />
          </div>
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{team.avgCompliance}%</span>
        </div>
      </td>
      <td className="px-4 py-3 text-center">
        {team.warningCount > 0 ? (
          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">{team.warningCount}명</span>
        ) : (
          <span className="text-xs text-gray-400">-</span>
        )}
      </td>
    </tr>
    {team.parts.map((part) => (
      <tr key={part.id} className="border-b border-gray-50 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/20 hover:bg-gray-100/50 dark:hover:bg-gray-700/40">
        <td className="px-4 py-2.5 pl-10">
          <span className="text-sm text-gray-600 dark:text-gray-400">{part.name}</span>
        </td>
        <td className="px-4 py-2.5 text-center">
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300">{levelLabels[part.level]}</span>
        </td>
        <td className="px-4 py-2.5 text-center text-sm text-gray-500 dark:text-gray-400">{part.employeeCount}명</td>
        <td className="px-4 py-2.5 text-center text-sm text-gray-500 dark:text-gray-400">{part.avgVDT}h</td>
        <td className="px-4 py-2.5">
          <div className="flex items-center justify-center gap-2">
            <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${part.avgCompliance >= 80 ? 'bg-green-500' : part.avgCompliance >= 60 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${part.avgCompliance}%` }} />
            </div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{part.avgCompliance}%</span>
          </div>
        </td>
        <td className="px-4 py-2.5 text-center">
          {part.warningCount > 0 ? (
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">{part.warningCount}명</span>
          ) : (
            <span className="text-xs text-gray-400">-</span>
          )}
        </td>
      </tr>
    ))}
  </>
);

export default StatisticsPage;
