import { Building2, Users, UserPlus, ArrowRightLeft, UserMinus } from 'lucide-react';
import EmptyState from '../common/EmptyState';

const levelLabels = {
  division: '본부',
  team: '팀',
  part: '파트',
};

const levelBadge = {
  division: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  team: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  part: 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300',
};

const DepartmentDetailPanel = ({
  node,
  employees,
  totalEmployeeCount,
  onAssignEmployee,
  onTransferEmployee,
  onRemoveEmployee,
}) => {
  if (!node) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 flex items-center justify-center h-full min-h-[400px]">
        <EmptyState icon="building" title="부서를 선택하세요" description="좌측 조직도에서 부서를 클릭하면 상세 정보를 확인할 수 있습니다" />
      </div>
    );
  }

  const directEmployees = employees.filter((e) => e.departmentId === node.id);
  const hasChildren = node.children && node.children.length > 0;

  // Collect all descendant department IDs (including self)
  const collectIds = (n) => {
    const ids = [n.id];
    if (n.children) n.children.forEach((c) => ids.push(...collectIds(c)));
    return ids;
  };
  const allDescendantIds = collectIds(node);
  const allDescendantEmployees = employees.filter((e) => allDescendantIds.includes(e.departmentId));
  // Use active employees (compliance > 0) for stats calculation
  const activeDescendants = allDescendantEmployees.filter((e) => e.compliance > 0);

  const avgCompliance =
    activeDescendants.length > 0
      ? Math.round(activeDescendants.reduce((sum, e) => sum + e.compliance, 0) / activeDescendants.length)
      : 0;
  const avgVDT =
    activeDescendants.length > 0
      ? (activeDescendants.reduce((sum, e) => sum + e.avgVDT, 0) / activeDescendants.length).toFixed(1)
      : '0';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{node.name}</h3>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${levelBadge[node.level]}`}>
          {levelLabels[node.level]}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
          <p className="text-xs text-gray-500 dark:text-gray-400">총 인원</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{totalEmployeeCount}명</p>
          {directEmployees.length !== totalEmployeeCount && (
            <p className="text-xs text-gray-400">직속 {directEmployees.length}명</p>
          )}
        </div>
        {hasChildren && (
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <p className="text-xs text-gray-500 dark:text-gray-400">하위 부서</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{node.children.length}개</p>
          </div>
        )}
        <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
          <p className="text-xs text-gray-500 dark:text-gray-400">휴식 준수율</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  avgCompliance >= 80 ? 'bg-green-500' : avgCompliance >= 60 ? 'bg-amber-500' : 'bg-red-500'
                }`}
                style={{ width: `${avgCompliance}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">{avgCompliance}%</span>
          </div>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
          <p className="text-xs text-gray-500 dark:text-gray-400">평균 VDT</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{avgVDT}시간</p>
        </div>
      </div>

      {/* Sub-departments with stats (parent nodes only) */}
      {hasChildren && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">하위 부서</h4>
          <div className="space-y-2">
            {node.children.map((child) => {
              const childEmps = employees.filter((e) => {
                // Collect all descendant IDs for this child
                const collectIds = (n) => {
                  const ids = [n.id];
                  if (n.children) n.children.forEach((c) => ids.push(...collectIds(c)));
                  return ids;
                };
                return collectIds(child).includes(e.departmentId);
              });
              const childTotal = childEmps.length;
              const activeChildEmps = childEmps.filter((e) => e.compliance > 0);
              const childCompliance = activeChildEmps.length > 0
                ? Math.round(activeChildEmps.reduce((sum, e) => sum + (e.compliance || 0), 0) / activeChildEmps.length)
                : 0;
              const childAvgVDT = activeChildEmps.length > 0
                ? (activeChildEmps.reduce((sum, e) => sum + (e.avgVDT || 0), 0) / activeChildEmps.length).toFixed(1)
                : '0';
              const childWarning = childEmps.filter((e) => e.status === 'warning').length;
              return (
                <div key={child.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 size={14} className="text-gray-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex-1">{child.name}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${levelBadge[child.level]}`}>
                      {levelLabels[child.level]}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Users size={12} />
                      {childTotal}명
                    </span>
                    <span className={`${
                      childCompliance >= 80 ? 'text-green-600 dark:text-green-400' :
                      childCompliance >= 60 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'
                    }`}>준수율 {childCompliance}%</span>
                    <span>VDT {childAvgVDT}h</span>
                    {childWarning > 0 && (
                      <span className="text-amber-600 dark:text-amber-400">주의 {childWarning}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Employees - only for leaf nodes (no children) */}
      {!hasChildren && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              소속 직원 ({directEmployees.length}명)
            </h4>
            <button
              onClick={() => onAssignEmployee(node)}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            >
              <UserPlus size={14} />
              직원 배치
            </button>
          </div>
          {directEmployees.length === 0 ? (
            <EmptyState icon="users" title="배치된 직원이 없습니다" description="직원 배치 버튼으로 직원을 추가하세요" />
          ) : (
            <div className="space-y-2">
              {directEmployees.map((emp) => (
                <div
                  key={emp.id}
                  className="flex items-center gap-3 p-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl group transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-600 dark:text-gray-400 text-xs font-medium">{emp.name[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{emp.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{emp.position}</p>
                  </div>
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full border flex-shrink-0 ${
                      emp.status === 'active'
                        ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400'
                        : emp.status === 'warning'
                          ? 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400'
                          : emp.status === 'offline'
                            ? 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-600 dark:text-gray-300'
                            : 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}
                  >
                    {emp.status === 'active' ? '활성' : emp.status === 'warning' ? '주의' : emp.status === 'offline' ? '오프라인' : '미설치'}
                  </span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button
                      onClick={() => onTransferEmployee(emp)}
                      className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                      title="이동"
                    >
                      <ArrowRightLeft size={14} />
                    </button>
                    <button
                      onClick={() => onRemoveEmployee(emp)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      title="배치 해제"
                    >
                      <UserMinus size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DepartmentDetailPanel;
