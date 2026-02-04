import { useState, useMemo, useEffect } from 'react';
import { RefreshCw, Building2, Check, ChevronDown, ChevronUp, Shield, Layers, Users } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import policyService from '../services/policyService';

const DEFAULT_POLICY = {
  workTime: 50,
  breakTime: 10,
  snoozeLimit: 2,
  alertMode: 'standard',
  workStart: '09:00',
  workEnd: '18:00',
  lunchExclude: true,
  workDays: [true, true, true, true, true, false, false],
  preAlertMin: 5,
  postAlertMin: 5,
};

const ALERT_MODES = [
  { id: 'soft', name: '부드러운 모드', desc: '작은 알림으로 휴식 권유, 무시 가능' },
  { id: 'standard', name: '표준 모드', desc: '단계별 알림, 스누즈 횟수 제한', recommended: true },
  { id: 'strict', name: '엄격 모드', desc: '화면 오버레이로 강제 휴식 유도', disabled: true },
];

const DAY_LABELS = ['월', '화', '수', '목', '금', '토', '일'];

const PolicyPage = () => {
  const addToast = useToast();
  const [divisions, setDivisions] = useState([]);
  const [companyPolicy, setCompanyPolicy] = useState({ ...DEFAULT_POLICY });
  // nodeId → policy overrides (division or team level)
  const [overrides, setOverrides] = useState({});
  const [expandedSection, setExpandedSection] = useState('company');
  // Track which divisions have their teams expanded
  const [expandedDivisions, setExpandedDivisions] = useState({});

  const [employeeCounts, setEmployeeCounts] = useState({});

  useEffect(() => {
    const load = async () => {
      const [divs, counts, policy] = await Promise.all([
        policyService.getDivisions(),
        policyService.getEmployeeCounts(),
        policyService.getCompanyPolicy(),
      ]);
      setDivisions(divs);
      setEmployeeCounts(counts);
      setCompanyPolicy(policy);
    };
    load();
  }, []);

  // Get effective policy for a node: node override > parent override > company
  const getEffectivePolicy = (nodeId, parentDivId) => {
    const nodeOverride = overrides[nodeId];
    if (nodeOverride?.enabled) return { ...companyPolicy, ...nodeOverride };
    if (parentDivId) {
      const parentOverride = overrides[parentDivId];
      if (parentOverride?.enabled) return { ...companyPolicy, ...parentOverride };
    }
    return { ...companyPolicy };
  };

  const getInheritSource = (nodeId, parentDivId) => {
    if (overrides[nodeId]?.enabled) return 'self';
    if (parentDivId && overrides[parentDivId]?.enabled) return 'division';
    return 'company';
  };

  const hasOverride = (nodeId) => overrides[nodeId]?.enabled === true;

  const toggleOverride = (nodeId, parentPolicy) => {
    setOverrides((prev) => {
      const existing = prev[nodeId];
      if (existing?.enabled) {
        return { ...prev, [nodeId]: { ...existing, enabled: false } };
      }
      return { ...prev, [nodeId]: { ...parentPolicy, enabled: true } };
    });
  };

  const updateOverride = (nodeId, key, value) => {
    setOverrides((prev) => ({
      ...prev,
      [nodeId]: { ...prev[nodeId], [key]: value },
    }));
  };

  const resetOverride = (nodeId, parentPolicy) => {
    setOverrides((prev) => ({
      ...prev,
      [nodeId]: { ...parentPolicy, enabled: true },
    }));
  };

  const toggleDivisionExpanded = (divId) => {
    setExpandedDivisions((prev) => ({ ...prev, [divId]: !prev[divId] }));
  };

  const overrideCount = Object.values(overrides).filter((o) => o?.enabled).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">정책 설정</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            전사 기본 정책 및 부서별 차등 정책을 설정합니다
          </p>
        </div>
        <button
          onClick={() => addToast('정책이 저장되었습니다', 'success')}
          className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700"
        >
          변경사항 저장
        </button>
      </div>

      {/* Policy Scope Overview */}
      <div className="flex gap-4">
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600">
              <Shield size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">적용 범위</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">전사 기본 정책</p>
            </div>
          </div>
        </div>
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600">
              <Layers size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">부서별 커스텀</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{overrideCount}개 부서</p>
            </div>
          </div>
        </div>
      </div>

      {/* Company Default Policy */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <button
          onClick={() => setExpandedSection(expandedSection === 'company' ? null : 'company')}
          className="w-full p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
              <Shield size={20} className="text-indigo-600" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">전사 기본 정책</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">모든 부서에 기본 적용되는 정책입니다</p>
            </div>
          </div>
          {expandedSection === 'company' ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
        </button>

        {expandedSection === 'company' && (
          <div className="px-6 pb-6 border-t border-gray-100 dark:border-gray-700 pt-6">
            <PolicyForm
              formId="company"
              policy={companyPolicy}
              onChange={(key, value) => setCompanyPolicy((prev) => ({ ...prev, [key]: value }))}
              onReset={() => { setCompanyPolicy({ ...DEFAULT_POLICY }); addToast('기본 정책으로 초기화되었습니다', 'info'); }}
            />
          </div>
        )}
      </div>

      {/* Division-level Overrides */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">부서별 정책 설정</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">본부 및 팀별로 다른 정책을 적용할 수 있습니다</p>
        </div>

        <div className="space-y-3">
          {divisions.map((div) => {
            const divHasOverride = hasOverride(div.id);
            const isExpanded = expandedSection === div.id;
            const effectivePolicy = getEffectivePolicy(div.id);
            const teamsExpanded = expandedDivisions[div.id];
            const teamsWithChildren = div.children || [];

            return (
              <div key={div.id} className="space-y-2">
                {/* Division Card */}
                <div
                  className={`bg-white dark:bg-gray-800 rounded-2xl border shadow-sm overflow-hidden transition-all ${
                    divHasOverride ? 'border-amber-200 dark:border-amber-700' : 'border-gray-100 dark:border-gray-700'
                  }`}
                >
                  {/* Division Header */}
                  <div className="flex items-center justify-between p-5">
                    <button
                      onClick={() => setExpandedSection(isExpanded ? null : div.id)}
                      className="flex items-center gap-3 flex-1 text-left"
                    >
                      <div className={`p-2 rounded-xl ${divHasOverride ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-gray-100 dark:bg-gray-600'}`}>
                        <Building2 size={18} className={divHasOverride ? 'text-amber-600' : 'text-gray-500 dark:text-gray-400'} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900 dark:text-white">{div.name}</span>
                          <span className="text-xs text-gray-400">{employeeCounts[div.id] || 0}명</span>
                          {divHasOverride && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700">커스텀</span>
                          )}
                          {!divHasOverride && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400">기본값</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          작업 {effectivePolicy.workTime}분 · 휴식 {effectivePolicy.breakTime}분 · {ALERT_MODES.find((m) => m.id === effectivePolicy.alertMode)?.name}
                        </p>
                      </div>
                    </button>

                    <div className="flex items-center gap-3">
                      {/* Team expand toggle */}
                      {teamsWithChildren.length > 0 && (
                        <button
                          onClick={() => toggleDivisionExpanded(div.id)}
                          className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 px-2 py-1 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <Users size={14} />
                          <span>{teamsWithChildren.length}팀</span>
                        </button>
                      )}
                      {/* Custom toggle */}
                      <label className="flex items-center gap-2 cursor-pointer">
                        <span className="text-xs text-gray-500 dark:text-gray-400">{divHasOverride ? '커스텀' : '기본값 사용'}</span>
                        <button
                          onClick={() => toggleOverride(div.id, companyPolicy)}
                          className={`relative w-10 h-5 rounded-full transition-colors ${
                            divHasOverride ? 'bg-amber-500' : 'bg-gray-300 dark:bg-gray-500'
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                              divHasOverride ? 'translate-x-5' : 'translate-x-0.5'
                            }`}
                          />
                        </button>
                      </label>
                      <button
                        onClick={() => setExpandedSection(isExpanded ? null : div.id)}
                        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        {isExpanded ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                      </button>
                    </div>
                  </div>

                  {/* Division Policy Form (expanded) */}
                  {isExpanded && (
                    <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-700 pt-5">
                      {!divHasOverride ? (
                        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                          <Check size={18} className="text-green-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">전사 기본 정책을 사용 중입니다</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">커스텀 토글을 켜면 이 본부만의 정책을 설정할 수 있습니다</p>
                          </div>
                        </div>
                      ) : (
                        <PolicyForm
                          formId={div.id}
                          policy={overrides[div.id]}
                          companyDefault={companyPolicy}
                          onChange={(key, value) => updateOverride(div.id, key, value)}
                          onReset={() => resetOverride(div.id, companyPolicy)}
                          isDivision
                        />
                      )}
                    </div>
                  )}
                </div>

                {/* Team-level cards (nested) */}
                {teamsExpanded && teamsWithChildren.map((team) => {
                  const teamHasOverride = hasOverride(team.id);
                  const isTeamExpanded = expandedSection === team.id;
                  const inheritSource = getInheritSource(team.id, div.id);
                  const parentPolicy = divHasOverride ? { ...companyPolicy, ...overrides[div.id] } : companyPolicy;
                  const teamEffective = getEffectivePolicy(team.id, div.id);

                  return (
                    <div
                      key={team.id}
                      className={`ml-8 bg-white dark:bg-gray-800 rounded-2xl border shadow-sm overflow-hidden transition-all ${
                        teamHasOverride ? 'border-blue-200 dark:border-blue-700' : 'border-gray-100 dark:border-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between p-4">
                        <button
                          onClick={() => setExpandedSection(isTeamExpanded ? null : team.id)}
                          className="flex items-center gap-3 flex-1 text-left"
                        >
                          <div className={`p-1.5 rounded-lg ${teamHasOverride ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-gray-50 dark:bg-gray-700'}`}>
                            <Users size={16} className={teamHasOverride ? 'text-blue-600' : 'text-gray-400'} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-800 dark:text-gray-200 text-sm">{team.name}</span>
                              <span className="text-xs text-gray-400">{employeeCounts[team.id] || 0}명</span>
                              {teamHasOverride && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700">커스텀</span>
                              )}
                              {!teamHasOverride && inheritSource === 'division' && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600">본부 정책</span>
                              )}
                              {!teamHasOverride && inheritSource === 'company' && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400">기본값</span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              작업 {teamEffective.workTime}분 · 휴식 {teamEffective.breakTime}분
                            </p>
                          </div>
                        </button>

                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <span className="text-xs text-gray-500 dark:text-gray-400">{teamHasOverride ? '커스텀' : '상위 정책'}</span>
                            <button
                              onClick={() => toggleOverride(team.id, parentPolicy)}
                              className={`relative w-10 h-5 rounded-full transition-colors ${
                                teamHasOverride ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-500'
                              }`}
                            >
                              <span
                                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                                  teamHasOverride ? 'translate-x-5' : 'translate-x-0.5'
                                }`}
                              />
                            </button>
                          </label>
                          <button
                            onClick={() => setExpandedSection(isTeamExpanded ? null : team.id)}
                            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
                          >
                            {isTeamExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                          </button>
                        </div>
                      </div>

                      {isTeamExpanded && (
                        <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700 pt-4">
                          {!teamHasOverride ? (
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                              <Check size={16} className="text-green-600" />
                              <div>
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  {inheritSource === 'division'
                                    ? `${div.name} 정책을 따르고 있습니다`
                                    : '전사 기본 정책을 따르고 있습니다'}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">커스텀 토글을 켜면 이 팀만의 정책을 설정할 수 있습니다</p>
                              </div>
                            </div>
                          ) : (
                            <PolicyForm
                              formId={team.id}
                              policy={overrides[team.id]}
                              companyDefault={parentPolicy}
                              onChange={(key, value) => updateOverride(team.id, key, value)}
                              onReset={() => resetOverride(team.id, parentPolicy)}
                              isDivision
                              labelPrefix="팀"
                            />
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// --- Policy Form (shared for company & division & team) ---
const PolicyForm = ({ formId, policy, companyDefault, onChange, onReset, isDivision, labelPrefix = '본부' }) => {
  const diffFromDefault = (key) => {
    if (!isDivision || !companyDefault) return false;
    return policy[key] !== companyDefault[key];
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Rest Policy */}
      <div className="space-y-5">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
          휴식 정책
          {isDivision && (
            <button onClick={onReset} className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex items-center gap-1 font-normal">
              <RefreshCw size={12} /> {labelPrefix === '팀' ? '상위 정책' : '기본값'} 복원
            </button>
          )}
        </h4>

        <SliderField
          label="권장 연속 작업 시간"
          value={policy.workTime}
          min={30}
          max={90}
          unit="분"
          onChange={(v) => onChange('workTime', v)}
          highlight={diffFromDefault('workTime')}
        />
        <SliderField
          label="최소 휴식 시간"
          value={policy.breakTime}
          min={5}
          max={20}
          unit="분"
          onChange={(v) => onChange('breakTime', v)}
          highlight={diffFromDefault('breakTime')}
        />
        <SliderField
          label="스누즈 허용 횟수"
          value={policy.snoozeLimit}
          min={0}
          max={5}
          unit="회"
          onChange={(v) => onChange('snoozeLimit', v)}
          highlight={diffFromDefault('snoozeLimit')}
        />

        {!isDivision && (
          <button onClick={onReset} className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1">
            <RefreshCw size={14} /> 기본값으로 복원
          </button>
        )}
      </div>

      {/* Alert Mode */}
      <div className="space-y-5">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">알림 모드</h4>
        <div className="space-y-2.5">
          {ALERT_MODES.map((mode) => (
            <label
              key={mode.id}
              className={`block p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                policy.alertMode === mode.id
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                  : mode.disabled
                    ? 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 opacity-50 cursor-not-allowed'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              } ${isDivision && diffFromDefault('alertMode') && policy.alertMode === mode.id ? 'ring-2 ring-amber-200' : ''}`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name={`alertMode-${formId}`}
                  value={mode.id}
                  checked={policy.alertMode === mode.id}
                  onChange={() => !mode.disabled && onChange('alertMode', mode.id)}
                  disabled={mode.disabled}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 dark:text-white text-sm">{mode.name}</span>
                    {mode.recommended && <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 px-2 py-0.5 rounded-full">권장</span>}
                    {mode.disabled && <span className="text-xs bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full">향후 지원</span>}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{mode.desc}</p>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Work Hours */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">근무시간 설정</h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">시작 시간</label>
            <input
              type="time"
              value={policy.workStart}
              onChange={(e) => onChange('workStart', e.target.value)}
              className={`w-full px-3 py-2 border rounded-xl text-sm dark:bg-gray-700 dark:text-white ${diffFromDefault('workStart') ? 'border-amber-300 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700' : 'border-gray-200 dark:border-gray-600'}`}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">종료 시간</label>
            <input
              type="time"
              value={policy.workEnd}
              onChange={(e) => onChange('workEnd', e.target.value)}
              className={`w-full px-3 py-2 border rounded-xl text-sm dark:bg-gray-700 dark:text-white ${diffFromDefault('workEnd') ? 'border-amber-300 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700' : 'border-gray-200 dark:border-gray-600'}`}
            />
          </div>
        </div>
        <label className="flex items-center gap-2.5 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl cursor-pointer">
          <input
            type="checkbox"
            checked={policy.lunchExclude}
            onChange={(e) => onChange('lunchExclude', e.target.checked)}
            className="rounded"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">점심시간 제외 (12:00-13:00)</span>
        </label>
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">적용 요일</label>
          <div className="flex gap-1.5">
            {DAY_LABELS.map((day, idx) => (
              <button
                key={day}
                onClick={() => {
                  const newDays = [...policy.workDays];
                  newDays[idx] = !newDays[idx];
                  onChange('workDays', newDays);
                }}
                className={`w-9 h-9 rounded-lg text-xs font-bold transition-colors ${
                  policy.workDays[idx]
                    ? 'bg-indigo-500 dark:bg-indigo-500 text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                } ${isDivision && companyDefault && policy.workDays[idx] !== companyDefault.workDays[idx] ? 'ring-2 ring-amber-300 dark:ring-amber-500' : ''}`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Alert Timing */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">알림 타이밍</h4>
        <div className="space-y-3">
          <div className={`flex items-center justify-between p-3.5 rounded-xl ${diffFromDefault('preAlertMin') ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700' : 'bg-gray-50 dark:bg-gray-700'}`}>
            <div>
              <p className="font-medium text-gray-900 dark:text-white text-sm">사전 알림</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">휴식 시간 전 미리 알림</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={policy.preAlertMin}
                onChange={(e) => onChange('preAlertMin', Number(e.target.value))}
                className="w-14 px-2 py-1.5 border border-gray-200 dark:border-gray-600 rounded-lg text-center text-sm dark:bg-gray-700 dark:text-white"
              />
              <span className="text-xs text-gray-600 dark:text-gray-400">분 전</span>
            </div>
          </div>
          <div className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <div>
              <p className="font-medium text-gray-900 dark:text-white text-sm">본 알림</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">휴식 시간 도달 시</p>
            </div>
            <span className="text-xs text-indigo-600 font-medium">자동</span>
          </div>
          <div className={`flex items-center justify-between p-3.5 rounded-xl ${diffFromDefault('postAlertMin') ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700' : 'bg-gray-50 dark:bg-gray-700'}`}>
            <div>
              <p className="font-medium text-gray-900 dark:text-white text-sm">강조 알림</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">시간 초과 후 강조</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={policy.postAlertMin}
                onChange={(e) => onChange('postAlertMin', Number(e.target.value))}
                className="w-14 px-2 py-1.5 border border-gray-200 dark:border-gray-600 rounded-lg text-center text-sm dark:bg-gray-700 dark:text-white"
              />
              <span className="text-xs text-gray-600 dark:text-gray-400">분 후</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Slider field ---
const SliderField = ({ label, value, min, max, unit, onChange, highlight }) => (
  <div>
    <div className="flex items-center justify-between mb-1.5">
      <label className="text-sm text-gray-700 dark:text-gray-300">{label}</label>
      <span className={`text-sm font-bold ${highlight ? 'text-amber-600' : 'text-indigo-600'}`}>
        {value}{unit}
        {highlight && <span className="ml-1 text-xs font-normal text-amber-500">변경됨</span>}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className={`w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer ${highlight ? 'accent-amber-500' : 'accent-indigo-600'}`}
    />
    <div className="flex justify-between text-xs text-gray-400 mt-0.5">
      <span>{min}{unit}</span>
      <span>{max}{unit}</span>
    </div>
  </div>
);

export default PolicyPage;
