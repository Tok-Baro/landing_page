import { useState, useEffect } from 'react';
import { Shield, BarChart3, Download, Plus, FileSpreadsheet, Eye, Calendar, Building2, CheckCircle2, Clock, X, Trash2 } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import reportService from '../services/reportService';

const REPORT_TYPES = [
  { id: 'legal', name: '중대재해처벌법 대응 리포트', desc: 'VDT 작업 관리 현황 및 예방 조치 증빙', icon: Shield },
  { id: 'monthly', name: '월간 건강 현황 리포트', desc: '전사 건강 지표 요약 및 개선 권고', icon: BarChart3 },
];

const REPORT_ITEMS = [
  { id: 'vdt-summary', label: '전사 VDT 시간 현황', default: true },
  { id: 'break-status', label: '휴식 제공 현황', default: true },
  { id: 'posture-alert', label: '자세 교정 알림 현황', default: true },
  { id: 'dept-detail', label: '부서별 상세', default: true },
  { id: 'individual', label: '개인별 상세 (선택)', default: false },
];

const PERIODS = [
  { value: '2025-01', label: '2025년 1월' },
  { value: '2024-12', label: '2024년 12월' },
  { value: '2024-Q4', label: '2024년 4분기' },
  { value: '2024', label: '2024년 연간' },
];

const ReportsPage = () => {
  const addToast = useToast();
  const [divisions, setDivisions] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [divs, stats, schedules, generated] = await Promise.all([
        reportService.getDivisions(),
        reportService.getDivisionStats(),
        reportService.getSchedules(),
        reportService.getGeneratedReports(),
      ]);
      setDivisions(divs);
      setDivisionStats(stats);
      setScheduledReports(schedules);
      setGeneratedReports(generated);
      // Load employees for preview
      const { allEmployees } = await import('../data/sampleData');
      setAllEmployees(allEmployees);
    };
    load();
  }, []);

  const [selectedType, setSelectedType] = useState('legal');
  const [selectedPeriod, setSelectedPeriod] = useState('2025-01');
  const [selectedDivisions, setSelectedDivisions] = useState(['all']);
  const [selectedItems, setSelectedItems] = useState(() => REPORT_ITEMS.filter((i) => i.default).map((i) => i.id));
  const [showPreview, setShowPreview] = useState(false);
  const [generating, setGenerating] = useState(false);
  const SCHEDULE_COLORS = {
    green: {
      card: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
      badge: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    },
    blue: {
      card: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
      badge: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    },
    indigo: {
      card: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800',
      badge: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400',
    },
  };

  const [scheduledReports, setScheduledReports] = useState([]);
  const [generatedReports, setGeneratedReports] = useState([]);
  const [divisionStats, setDivisionStats] = useState([]);

  const toggleDivision = (divId) => {
    if (divId === 'all') {
      setSelectedDivisions(['all']);
      return;
    }
    setSelectedDivisions((prev) => {
      const without = prev.filter((d) => d !== 'all' && d !== divId);
      if (prev.includes(divId)) {
        return without.length === 0 ? ['all'] : without;
      }
      return [...without, divId];
    });
  };

  const toggleItem = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId) ? prev.filter((i) => i !== itemId) : [...prev, itemId]
    );
  };

  const handleGenerate = (format) => {
    setGenerating(true);
    setTimeout(() => {
      const typeName = REPORT_TYPES.find((t) => t.id === selectedType)?.name || '';
      const periodLabel = PERIODS.find((p) => p.value === selectedPeriod)?.label || '';
      setGeneratedReports((prev) => [
        {
          id: Date.now(),
          name: typeName,
          type: selectedType,
          period: periodLabel,
          createdAt: new Date().toISOString().slice(0, 10),
          creator: '김관리자',
          format,
          size: format === 'PDF' ? '3.2MB' : '1.5MB',
        },
        ...prev,
      ]);
      setGenerating(false);
      addToast('리포트가 생성되었습니다', 'success');
    }, 1500);
  };

  const handleDeleteSchedule = (id) => {
    setScheduledReports((prev) => prev.filter((r) => r.id !== id));
    addToast('예약이 삭제되었습니다', 'success');
  };

  const handleAddSchedule = () => {
    const typeName = REPORT_TYPES.find((t) => t.id === selectedType)?.name || '리포트';
    setScheduledReports((prev) => [
      ...prev,
      { id: Date.now(), name: typeName, colorKey: 'indigo', schedule: '매월 1일 자동 생성', recipient: 'admin@company.com' },
    ]);
    addToast('리포트 예약이 등록되었습니다', 'success');
  };

  const selectedPeriodLabel = PERIODS.find((p) => p.value === selectedPeriod)?.label || '';

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">리포트</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">법적 준수 문서 및 건강 현황 리포트를 생성합니다</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Report Generator */}
        <div className="col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">리포트 생성</h3>

          {/* Report Type Selection */}
          <div className="space-y-3 mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">리포트 유형</label>
            <div className="grid grid-cols-2 gap-4">
              {REPORT_TYPES.map((type) => {
                const TypeIcon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      selectedType === type.id
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <TypeIcon size={20} className={selectedType === type.id ? 'text-indigo-600' : 'text-gray-400'} />
                      <span className="font-medium text-gray-900 dark:text-white">{type.name}</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{type.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Period Selection */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                <Calendar size={14} /> 기간 선택
              </label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm dark:bg-gray-700 dark:text-gray-300"
              >
                {PERIODS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>

            {/* Division Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Building2 size={14} /> 포함 부서
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => toggleDivision('all')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedDivisions.includes('all')
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-500'
                  }`}
                >
                  {selectedDivisions.includes('all') && <CheckCircle2 size={14} />}
                  전체
                </button>
                {divisions.map((div) => (
                  <button
                    key={div.id}
                    onClick={() => toggleDivision(div.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedDivisions.includes('all') || selectedDivisions.includes(div.id)
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-500'
                    }`}
                  >
                    {(selectedDivisions.includes('all') || selectedDivisions.includes(div.id)) && <CheckCircle2 size={14} />}
                    {div.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Include Items */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">포함 항목</label>
              <div className="space-y-2">
                {REPORT_ITEMS.map((item) => (
                  <label key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleItem(item.id)}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => setShowPreview(true)}
              className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center gap-2"
            >
              <Eye size={18} />
              미리보기
            </button>
            <button
              onClick={() => handleGenerate('PDF')}
              disabled={generating}
              className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Download size={18} />
              {generating ? '생성 중...' : 'PDF 생성'}
            </button>
            <button
              onClick={() => handleGenerate('Excel')}
              disabled={generating}
              className="px-4 py-3 border border-green-200 dark:border-green-700 text-green-700 rounded-xl text-sm font-medium hover:bg-green-50 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <FileSpreadsheet size={18} />
              Excel
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Scheduled Reports */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">정기 리포트 설정</h3>
            <div className="space-y-4">
              {scheduledReports.map((sr) => {
                const colors = SCHEDULE_COLORS[sr.colorKey] || SCHEDULE_COLORS.indigo;
                return (
                  <div key={sr.id} className={`p-4 rounded-xl border ${colors.card}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900 dark:text-white text-sm">{sr.name}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${colors.badge}`}>활성</span>
                        <button
                          onClick={() => handleDeleteSchedule(sr.id)}
                          className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{sr.schedule}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">수신: {sr.recipient}</p>
                  </div>
                );
              })}
              <button
                onClick={handleAddSchedule}
                className="w-full px-4 py-2.5 border border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                정기 리포트 추가
              </button>
            </div>
          </div>

          {/* Recent Reports */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">최근 리포트</h3>
            <div className="space-y-3">
              {generatedReports.slice(0, 5).map((report) => (
                <div key={report.id} className="p-3.5 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-600 hover:border-gray-200 dark:hover:border-gray-500 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{report.name}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-xs text-gray-500 dark:text-gray-400">{report.period}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded-md font-medium ${
                          report.format === 'PDF'
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                            : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                        }`}>
                          {report.format}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">{report.size}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <Clock size={11} className="text-gray-400 dark:text-gray-500" />
                        <span className="text-[11px] text-gray-400 dark:text-gray-500">{report.createdAt} · {report.creator}</span>
                      </div>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg flex-shrink-0">
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">리포트 미리보기</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  {REPORT_TYPES.find((t) => t.id === selectedType)?.name} · {selectedPeriodLabel}
                </p>
              </div>
              <button onClick={() => setShowPreview(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-xl">
                <X size={20} className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-6 space-y-6">
              {/* Summary Section */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">전사 요약</h4>
                <div className="grid grid-cols-4 gap-3">
                  {(() => {
                    const activeEmps = allEmployees.filter((e) => e.status === 'active' || e.status === 'warning');
                    const avgComp = activeEmps.length > 0 ? Math.round(activeEmps.reduce((s, e) => s + e.compliance, 0) / activeEmps.length) : 0;
                    const avgVdt = activeEmps.length > 0 ? (activeEmps.reduce((s, e) => s + e.avgVDT, 0) / activeEmps.length).toFixed(1) : '0';
                    const riskCount = activeEmps.filter((e) => e.compliance < 60).length;
                    return [
                      { label: '전체 직원', value: `${allEmployees.length}명` },
                      { label: '평균 준수율', value: `${avgComp}%` },
                      { label: '평균 VDT', value: `${avgVdt}h` },
                      { label: '위험군', value: `${riskCount}명` },
                    ].map((s) => (
                      <div key={s.label} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">{s.value}</p>
                      </div>
                    ));
                  })()}
                </div>
              </div>

              {/* Division Breakdown */}
              {selectedItems.includes('dept-detail') && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">부서별 현황</h4>
                  <div className="border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-700/50">
                          <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">부서</th>
                          <th className="text-center px-4 py-3 font-medium text-gray-600 dark:text-gray-400">인원</th>
                          <th className="text-center px-4 py-3 font-medium text-gray-600 dark:text-gray-400">준수율</th>
                          <th className="text-center px-4 py-3 font-medium text-gray-600 dark:text-gray-400">평균 VDT</th>
                          <th className="text-center px-4 py-3 font-medium text-gray-600 dark:text-gray-400">위험군</th>
                        </tr>
                      </thead>
                      <tbody>
                        {divisionStats
                          .filter((d) => selectedDivisions.includes('all') || selectedDivisions.includes(d.id))
                          .map((div) => (
                            <tr key={div.id} className="border-t border-gray-100 dark:border-gray-700">
                              <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{div.name}</td>
                              <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">{div.total}명</td>
                              <td className="px-4 py-3 text-center">
                                <span className={`font-medium ${div.avgCompliance >= 80 ? 'text-green-600' : div.avgCompliance >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                                  {div.avgCompliance}%
                                </span>
                              </td>
                              <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">{div.avgVDT}h</td>
                              <td className="px-4 py-3 text-center">
                                {div.riskCount > 0 ? (
                                  <span className="text-red-600 font-medium">{div.riskCount}명</span>
                                ) : (
                                  <span className="text-green-600">-</span>
                                )}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Included Items Summary */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">포함 항목</h4>
                <div className="space-y-2">
                  {REPORT_ITEMS.filter((i) => selectedItems.includes(i.id)).map((item) => (
                    <div key={item.id} className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle2 size={14} className="text-green-600" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-100 dark:border-gray-700">
              <button onClick={() => setShowPreview(false)} className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                닫기
              </button>
              <button
                onClick={() => { setShowPreview(false); handleGenerate('PDF'); }}
                className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 flex items-center justify-center gap-2"
              >
                <Download size={16} /> PDF 생성
              </button>
              <button
                onClick={() => { setShowPreview(false); handleGenerate('Excel'); }}
                className="px-4 py-2.5 border border-green-200 dark:border-green-700 text-green-700 rounded-xl text-sm font-medium hover:bg-green-50 flex items-center justify-center gap-2"
              >
                <FileSpreadsheet size={16} /> Excel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
