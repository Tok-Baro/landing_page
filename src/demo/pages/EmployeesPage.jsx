import { useState, useMemo, useRef, useEffect } from 'react';
import { Plus, Upload, Search, ArrowUpDown, ArrowUp, ArrowDown, Mail, MoreHorizontal, Pencil, Trash2, X, Users, TrendingUp, AlertTriangle, ChevronRight } from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import EmptyState from '../components/common/EmptyState';
import EmployeeProfileModal from '../components/common/EmployeeProfileModal';
import { useToast } from '../hooks/useToast';
import employeeService from '../services/employeeService';
import departmentService from '../services/departmentService';

// Build departmentId → { division, team, part, path } map
function buildDeptMap(divisions) {
  const map = {};
  for (const div of divisions) {
    map[div.id] = { division: div.name, team: null, part: null, path: div.name };
    for (const team of div.children || []) {
      map[team.id] = { division: div.name, team: team.name, part: null, path: `${div.name} > ${team.name}` };
      for (const part of team.children || []) {
        map[part.id] = { division: div.name, team: team.name, part: part.name, path: `${div.name} > ${team.name} > ${part.name}` };
      }
    }
  }
  return map;
}

// Build flat list of all departments for filter dropdown
function buildDeptList(divisions) {
  const list = [];
  for (const div of divisions) {
    list.push({ id: div.id, name: div.name, level: 0 });
    for (const team of div.children || []) {
      list.push({ id: team.id, name: team.name, level: 1, parentDivision: div.name });
      for (const part of team.children || []) {
        list.push({ id: part.id, name: part.name, level: 2, parentDivision: div.name, parentTeam: team.name });
      }
    }
  }
  return list;
}

// Computed from divisions (initialized via service)
let _deptMap = {};
let _allDeptList = [];
let _leafDeptList = [];
let _leafDeptIds = new Set();
let _initialized = false;

async function initDeptData() {
  if (_initialized) return;
  const divisions = await departmentService.getTree();
  _deptMap = buildDeptMap(divisions);
  _allDeptList = buildDeptList(divisions);
  _leafDeptList = _allDeptList.filter((d) => {
    const hasChildren = _allDeptList.some(
      (other) =>
        (other.level === 1 && other.parentDivision === d.name && d.level === 0) ||
        (other.level === 2 && other.parentTeam === d.name && d.level === 1)
    );
    return !hasChildren;
  });
  _leafDeptIds = new Set(_leafDeptList.map((d) => d.id));
  _initialized = true;
}

function getDeptMap() { return _deptMap; }
function getAllDeptList() { return _allDeptList; }
function getLeafDeptList() { return _leafDeptList; }
function getLeafDeptIds() { return _leafDeptIds; }

// Get direct children of a department
function getDirectChildren(deptId) {
  const allDeptList = getAllDeptList();
  const dept = allDeptList.find((d) => d.id === deptId);
  if (!dept) return [];
  if (dept.level === 0) {
    return allDeptList.filter((d) => d.level === 1 && d.parentDivision === dept.name);
  }
  if (dept.level === 1) {
    return allDeptList.filter((d) => d.level === 2 && d.parentTeam === d.name && d.parentDivision === dept.parentDivision);
  }
  return [];
}

const TABS = [
  { id: 'all', label: '전체' },
  { id: 'active', label: '활성' },
  { id: 'warning', label: '주의' },
  { id: 'offline', label: '오프라인' },
  { id: 'pending', label: '미설치' },
];

const PAGE_SIZE = 8;

const EmployeesPage = () => {
  const addToast = useToast();
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const load = async () => {
      await initDeptData();
      const deptMap = getDeptMap();
      const rawEmps = await employeeService.getAll();
      setEmployees(rawEmps.map((e) => {
        const info = deptMap[e.departmentId];
        return {
          ...e,
          dept: info?.division || '미배정',
          deptInfo: info || { division: '미배정', team: null, part: null, path: '미배정' },
        };
      }));
    };
    load();
  }, []);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedTab, setSelectedTab] = useState('all');
  const [deptFilter, setDeptFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [profileEmployee, setProfileEmployee] = useState(null);

  const menuRef = useRef(null);

  // Close menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    if (openMenuId !== null) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [openMenuId]);

  // --- Filtering ---
  const filteredEmployees = useMemo(() => {
    let list = employees;

    // Tab filter
    if (selectedTab !== 'all') {
      list = list.filter((e) => e.status === selectedTab);
    }

    // Department filter (hierarchical: selecting a parent includes all children)
    if (deptFilter !== 'all') {
      const selected = getAllDeptList().find((d) => d.id === deptFilter);
      if (selected) {
        if (selected.level === 0) {
          // Division: include all employees in this division
          list = list.filter((e) => e.deptInfo.division === selected.name);
        } else if (selected.level === 1) {
          // Team: include all employees in this team
          list = list.filter((e) => e.deptInfo.team === selected.name && e.deptInfo.division === selected.parentDivision);
        } else {
          // Part: exact match
          list = list.filter((e) => e.deptInfo.part === selected.name && e.deptInfo.team === selected.parentTeam);
        }
      }
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q) ||
          e.deptInfo.path.toLowerCase().includes(q)
      );
    }

    return list;
  }, [employees, selectedTab, deptFilter, searchQuery]);

  // --- Sorting ---
  const sortedEmployees = useMemo(() => {
    if (!sortConfig.key) return filteredEmployees;
    const sorted = [...filteredEmployees].sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredEmployees, sortConfig]);

  // --- Pagination ---
  const totalPages = Math.max(1, Math.ceil(sortedEmployees.length / PAGE_SIZE));
  const paginatedEmployees = sortedEmployees.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );


  // --- Tab counts ---
  const tabCounts = useMemo(() => {
    let base = employees;
    if (deptFilter !== 'all') {
      const selected = getAllDeptList().find((d) => d.id === deptFilter);
      if (selected) {
        if (selected.level === 0) {
          base = base.filter((e) => e.deptInfo.division === selected.name);
        } else if (selected.level === 1) {
          base = base.filter((e) => e.deptInfo.team === selected.name && e.deptInfo.division === selected.parentDivision);
        } else {
          base = base.filter((e) => e.deptInfo.part === selected.name && e.deptInfo.team === selected.parentTeam);
        }
      }
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      base = base.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q) ||
          e.deptInfo.path.toLowerCase().includes(q)
      );
    }
    return {
      all: base.length,
      active: base.filter((e) => e.status === 'active').length,
      warning: base.filter((e) => e.status === 'warning').length,
      offline: base.filter((e) => e.status === 'offline').length,
      pending: base.filter((e) => e.status === 'pending').length,
    };
  }, [employees, deptFilter, searchQuery]);

  // --- Sort handler ---
  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const renderSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) return <ArrowUpDown size={14} className="text-gray-300" />;
    return sortConfig.direction === 'asc'
      ? <ArrowUp size={14} className="text-indigo-500" />
      : <ArrowDown size={14} className="text-indigo-500" />;
  };

  // --- Invite / Add ---
  const handleInvite = (formData) => {
    const info = getDeptMap()[formData.deptId];
    const newEmployee = {
      id: `emp-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      position: formData.position || '',
      departmentId: formData.deptId || null,
      dept: info?.division || '미배정',
      deptInfo: info || { division: '미배정', team: null, part: null, path: '미배정' },
      status: 'pending',
      lastActive: '-',
      todayVDT: '-',
      compliance: 0,
      avgVDT: 0,
      phone: formData.phone || '',
      extension: formData.extension || '',
      memo: formData.memo || '',
    };
    setEmployees((prev) => [...prev, newEmployee]);
    setShowInviteModal(false);
    addToast('직원이 등록되었습니다', 'success');
  };

  // --- Edit ---
  const handleEdit = (formData) => {
    const info = getDeptMap()[formData.deptId];
    setEmployees((prev) =>
      prev.map((e) =>
        e.id === editingEmployee.id
          ? {
              ...e,
              name: formData.name,
              email: formData.email,
              position: formData.position || '',
              departmentId: formData.deptId,
              dept: info?.division || '미배정',
              deptInfo: info || { division: '미배정', team: null, part: null, path: '미배정' },
              phone: formData.phone || '',
              extension: formData.extension || '',
              memo: formData.memo || '',
            }
          : e
      )
    );
    setEditingEmployee(null);
    addToast('직원 정보가 수정되었습니다', 'success');
  };

  // --- Delete ---
  const handleDelete = () => {
    setEmployees((prev) => prev.filter((e) => e.id !== deleteTarget.id));
    setDeleteTarget(null);
    setOpenMenuId(null);
    addToast('직원이 삭제되었습니다', 'success');
  };

  // --- Resend invite (mock) ---
  const handleResend = () => {
    addToast('초대를 다시 보냈습니다', 'success');
  };

  // --- Determine if current filter is a leaf (show table) or parent (show stats) ---
  const isLeafFilter = deptFilter === 'all' || getLeafDeptIds().has(deptFilter);

  // --- Parent department summary stats ---
  const parentSummary = useMemo(() => {
    if (isLeafFilter || deptFilter === 'all') return null;
    const selected = getAllDeptList().find((d) => d.id === deptFilter);
    if (!selected) return null;
    let allEmps;
    if (selected.level === 0) {
      allEmps = employees.filter((e) => e.deptInfo.division === selected.name);
    } else if (selected.level === 1) {
      allEmps = employees.filter((e) => e.deptInfo.team === selected.name && e.deptInfo.division === selected.parentDivision);
    } else {
      allEmps = employees.filter((e) => e.deptInfo.part === selected.name && e.deptInfo.team === selected.parentTeam);
    }
    const activeEmps = allEmps.filter((e) => e.compliance > 0);
    return {
      name: selected.name,
      total: allEmps.length,
      active: allEmps.filter((e) => e.status === 'active').length,
      warning: allEmps.filter((e) => e.status === 'warning').length,
      avgCompliance: activeEmps.length > 0
        ? Math.round(activeEmps.reduce((sum, e) => sum + e.compliance, 0) / activeEmps.length)
        : 0,
      avgVDT: activeEmps.length > 0
        ? (activeEmps.reduce((sum, e) => sum + e.avgVDT, 0) / activeEmps.length).toFixed(1)
        : '0',
    };
  }, [deptFilter, isLeafFilter, employees]);

  // --- Child department stats for parent filter ---
  const childDeptStats = useMemo(() => {
    if (isLeafFilter || deptFilter === 'all') return [];
    const children = getDirectChildren(deptFilter);
    return children.map((child) => {
      // Get all employees under this child (including its sub-departments)
      let childEmployees;
      if (child.level === 1) {
        childEmployees = employees.filter(
          (e) => e.deptInfo.team === child.name && e.deptInfo.division === child.parentDivision
        );
      } else {
        childEmployees = employees.filter(
          (e) => e.deptInfo.part === child.name && e.deptInfo.team === child.parentTeam
        );
      }
      const active = childEmployees.filter((e) => e.status === 'active').length;
      const warning = childEmployees.filter((e) => e.status === 'warning').length;
      const total = childEmployees.length;
      const avgCompliance = total > 0
        ? Math.round(childEmployees.reduce((sum, e) => sum + (e.compliance || 0), 0) / total)
        : 0;
      const avgVDT = total > 0
        ? (childEmployees.reduce((sum, e) => sum + (e.avgVDT || 0), 0) / total).toFixed(1)
        : '0.0';
      return {
        id: child.id,
        name: child.name,
        level: child.level,
        total,
        active,
        warning,
        offline: childEmployees.filter((e) => e.status === 'offline').length,
        pending: childEmployees.filter((e) => e.status === 'pending').length,
        avgCompliance,
        avgVDT,
        isLeaf: getLeafDeptIds().has(child.id),
      };
    });
  }, [deptFilter, isLeafFilter, employees]);

  // --- Pagination helpers ---
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">직원 관리</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">전체 {employees.length}명의 직원을 관리합니다</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            <Upload size={18} />
            CSV 업로드
          </button>
          <button
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700"
          >
            <Plus size={18} />
            직원 초대
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div className="flex gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setSelectedTab(tab.id); setCurrentPage(1); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${selectedTab === tab.id
                    ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'}`}
              >
                {tab.label}
                <span className={`ml-1.5 text-xs ${selectedTab === tab.id ? 'text-indigo-500' : 'text-gray-400'}`}>
                  {tabCounts[tab.id]}
                </span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder="이름, 이메일, 부서 검색..."
                className="pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm dark:text-white w-52 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
            </div>
            <select
              value={deptFilter}
              onChange={(e) => { setDeptFilter(e.target.value); setCurrentPage(1); }}
              className="text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-600 dark:text-gray-300 dark:bg-gray-700"
            >
              <option value="all">모든 부서</option>
              {getAllDeptList().map((d) => (
                <option key={d.id} value={d.id}>
                  {d.level === 0 ? d.name : d.level === 1 ? `\u00A0\u00A0${d.name}` : `\u00A0\u00A0\u00A0\u00A0${d.name}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Content: Child dept stats OR Employee table */}
        {!isLeafFilter ? (
          /* --- Sub-department statistics panel --- */
          <div className="p-6 space-y-6">
            {/* Parent summary stats */}
            {parentSummary && (
              <div className="grid grid-cols-4 gap-3">
                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <p className="text-xs text-gray-500 dark:text-gray-400">총 인원</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{parentSummary.total}명</p>
                  <p className="text-xs text-gray-400 mt-0.5">활성 {parentSummary.active} · 주의 {parentSummary.warning}</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <p className="text-xs text-gray-500 dark:text-gray-400">하위 부서</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{childDeptStats.length}개</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <p className="text-xs text-gray-500 dark:text-gray-400">휴식 준수율</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          parentSummary.avgCompliance >= 80 ? 'bg-green-500' : parentSummary.avgCompliance >= 60 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${parentSummary.avgCompliance}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{parentSummary.avgCompliance}%</span>
                  </div>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <p className="text-xs text-gray-500 dark:text-gray-400">평균 VDT</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{parentSummary.avgVDT}시간</p>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {childDeptStats.map((child) => (
                <button
                  key={child.id}
                  onClick={() => { setDeptFilter(child.id); setCurrentPage(1); }}
                  className="text-left bg-gray-50 dark:bg-gray-700/50 rounded-xl p-5 border border-gray-100 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {child.name}
                    </h4>
                    <ChevronRight size={16} className="text-gray-400 group-hover:text-indigo-500 transition-colors" />
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Users size={14} className="text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{child.total}명</span>
                    {child.warning > 0 && (
                      <span className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-1.5 py-0.5 rounded">
                        <AlertTriangle size={10} />
                        주의 {child.warning}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">휴식 준수율</span>
                      <span className={`font-medium ${
                        child.avgCompliance >= 80 ? 'text-green-600 dark:text-green-400' :
                        child.avgCompliance >= 60 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'
                      }`}>{child.avgCompliance}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          child.avgCompliance >= 80 ? 'bg-green-500' :
                          child.avgCompliance >= 60 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${child.avgCompliance}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">평균 VDT</span>
                      <span className="font-medium text-gray-700 dark:text-gray-300">{child.avgVDT}h</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                    <span className="text-xs px-2 py-0.5 rounded bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400">활성 {child.active}</span>
                    {child.offline > 0 && <span className="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400">오프라인 {child.offline}</span>}
                    {child.pending > 0 && <span className="text-xs px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">미설치 {child.pending}</span>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* --- Employee table (leaf or all) --- */
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-700">
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                      <button onClick={() => handleSort('name')} className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300">
                        이름 {renderSortIcon('name')}
                      </button>
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">부서</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">상태</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">최근 활동</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                      <button onClick={() => handleSort('todayVDT')} className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300">
                        오늘 VDT {renderSortIcon('todayVDT')}
                      </button>
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                      <button onClick={() => handleSort('compliance')} className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300">
                        휴식 준수 {renderSortIcon('compliance')}
                      </button>
                    </th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">액션</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedEmployees.length === 0 ? (
                    <tr>
                      <td colSpan={7}>
                        <EmptyState icon="search" title="검색 결과가 없습니다" description="다른 검색어나 필터를 시도해보세요" />
                      </td>
                    </tr>
                  ) : (
                    paginatedEmployees.map((employee) => (
                      <tr key={employee.id} className="border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setProfileEmployee(employee)}
                            className="flex items-center gap-3 text-left hover:opacity-80 transition-opacity"
                          >
                            <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-500 rounded-full flex items-center justify-center">
                              <span className="text-gray-600 dark:text-gray-400 font-medium">{employee.name[0]}</span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{employee.name}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{employee.email}</p>
                            </div>
                          </button>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{employee.deptInfo.path}</td>
                        <td className="px-6 py-4">
                          <StatusBadge status={employee.status} />
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{employee.lastActive}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{employee.todayVDT}</td>
                        <td className="px-6 py-4">
                          {employee.compliance > 0 ? (
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    employee.compliance >= 80 ? 'bg-green-500' :
                                    employee.compliance >= 60 ? 'bg-amber-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${employee.compliance}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-600 dark:text-gray-400">{employee.compliance}%</span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            {employee.status === 'pending' && (
                              <button
                                onClick={() => handleResend(employee)}
                                className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg"
                                title="초대 재발송"
                              >
                                <Mail size={18} />
                              </button>
                            )}
                            <div className="relative" ref={openMenuId === employee.id ? menuRef : undefined}>
                              <button
                                onClick={() => setOpenMenuId(openMenuId === employee.id ? null : employee.id)}
                                className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg"
                                title="더보기"
                              >
                                <MoreHorizontal size={18} />
                              </button>
                              {openMenuId === employee.id && (
                                <div className="absolute right-0 top-10 w-36 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 py-1 z-50">
                                  <button
                                    onClick={() => {
                                      setEditingEmployee(employee);
                                      setOpenMenuId(null);
                                    }}
                                    className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                                  >
                                    <Pencil size={14} /> 수정
                                  </button>
                                  <button
                                    onClick={() => {
                                      setDeleteTarget(employee);
                                      setOpenMenuId(null);
                                    }}
                                    className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center gap-2"
                                  >
                                    <Trash2 size={14} /> 삭제
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {sortedEmployees.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  총 {sortedEmployees.length}명 중 {(currentPage - 1) * PAGE_SIZE + 1}-{Math.min(currentPage * PAGE_SIZE, sortedEmployees.length)} 표시
                </p>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    이전
                  </button>
                  {getPageNumbers().map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                        currentPage === page
                          ? 'bg-indigo-600 text-white'
                          : 'border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    다음
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <EmployeeFormModal
          title="직원 초대"
          submitLabel="초대 발송"
          deptList={getLeafDeptList()}
          onClose={() => setShowInviteModal(false)}
          onSubmit={handleInvite}
        />
      )}

      {/* Edit Modal */}
      {editingEmployee && (
        <EmployeeFormModal
          title="직원 수정"
          submitLabel="저장"
          deptList={getLeafDeptList()}
          initialData={editingEmployee}
          onClose={() => setEditingEmployee(null)}
          onSubmit={handleEdit}
        />
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">직원 삭제</h3>
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-semibold">{deleteTarget.name}</span>을(를) 삭제하시겠습니까?
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                취소
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Employee Profile Modal */}
      {profileEmployee && (
        <EmployeeProfileModal
          employee={profileEmployee}
          onClose={() => setProfileEmployee(null)}
          onUpdateMemo={(empId, memo) => {
            setEmployees((prev) => prev.map((e) => e.id === empId ? { ...e, memo } : e));
            setProfileEmployee((prev) => prev && prev.id === empId ? { ...prev, memo } : prev);
            addToast('메모가 저장되었습니다', 'success');
          }}
        />
      )}
    </div>
  );
};

// --- Shared form modal for Invite / Edit ---
const EmployeeFormModal = ({ title, submitLabel, deptList, initialData, onClose, onSubmit }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [position, setPosition] = useState(initialData?.position || '');
  const [deptId, setDeptId] = useState(initialData?.departmentId || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [extension, setExtension] = useState(initialData?.extension || '');
  const [memo, setMemo] = useState(initialData?.memo || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !deptId) return;
    onSubmit({ name: name.trim(), email: email.trim(), position: position.trim(), deptId, phone: phone.trim(), extension: extension.trim(), memo: memo.trim() });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">이름 *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="홍길동"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">이메일 *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="hong@company.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">직책</label>
            <input
              type="text"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="시니어 개발자"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">전화번호</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="010-0000-0000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">내선번호</label>
              <input
                type="text"
                value={extension}
                onChange={(e) => setExtension(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="1001"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">부서 *</label>
            <select
              value={deptId}
              onChange={(e) => setDeptId(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-300"
            >
              <option value="">부서 선택</option>
              {deptList.map((d) => {
                const info = getDeptMap()[d.id];
                return (
                  <option key={d.id} value={d.id}>
                    {info?.path || d.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">관리자 메모</label>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
              placeholder="직원에 대한 메모를 작성하세요..."
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!name.trim() || !email.trim() || !deptId}
              className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeesPage;
