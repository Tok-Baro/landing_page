import { useState, useCallback, useMemo, useEffect } from 'react';
import { Plus, UserX, X } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import employeeService from '../services/employeeService';
import departmentService from '../services/departmentService';
import OrgTreeNode from '../components/organization/OrgTreeNode';
import DepartmentDetailPanel from '../components/organization/DepartmentDetailPanel';
import DepartmentFormModal from '../components/organization/DepartmentFormModal';
import DeleteConfirmModal from '../components/organization/DeleteConfirmModal';
import MoveDepartmentModal from '../components/organization/MoveDepartmentModal';
import EmployeeAssignModal from '../components/organization/EmployeeAssignModal';

// --- Tree helper functions (immutable) ---

function findNode(nodes, id) {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children?.length) {
      const found = findNode(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

function getAllDescendantIds(node) {
  const ids = [node.id];
  if (node.children) {
    for (const child of node.children) {
      ids.push(...getAllDescendantIds(child));
    }
  }
  return ids;
}

function countAllDescendantNodes(node) {
  let count = 0;
  if (node.children) {
    for (const child of node.children) {
      count += 1 + countAllDescendantNodes(child);
    }
  }
  return count;
}

function mapTree(nodes, id, fn) {
  return nodes.map((node) => {
    if (node.id === id) return fn(node);
    if (node.children?.length) {
      return { ...node, children: mapTree(node.children, id, fn) };
    }
    return node;
  });
}

function addChildToNode(nodes, parentId, newChild) {
  return mapTree(nodes, parentId, (node) => ({
    ...node,
    children: [...(node.children || []), newChild],
  }));
}

function removeNodeFromTree(nodes, targetId) {
  return nodes
    .filter((n) => n.id !== targetId)
    .map((n) => ({
      ...n,
      children: n.children ? removeNodeFromTree(n.children, targetId) : [],
    }));
}

function collectNodesByLevel(nodes, level) {
  const result = [];
  for (const node of nodes) {
    if (node.level === level) result.push(node);
    if (node.children?.length) {
      result.push(...collectNodesByLevel(node.children, level));
    }
  }
  return result;
}

// --- Component ---

const childLevel = { division: 'team', team: 'part' };
const parentLevel = { team: 'division', part: 'team' };

const OrganizationPage = () => {
  const addToast = useToast();
  const [divisions, setDivisions] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [divs, emps] = await Promise.all([
        departmentService.getTree(),
        employeeService.getAll(),
      ]);
      setDivisions(divs);
      setEmployees(emps);
    };
    load();
  }, []);
  const [expandedNodes, setExpandedNodes] = useState(['dev', 'frontend', 'sales']);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [modal, setModal] = useState({ type: null, data: null });

  // --- Derived data ---
  const unassignedEmployees = employees.filter((e) => !e.departmentId);
  const isUnassignedSelected = selectedNodeId === '__unassigned__';
  const selectedNode = isUnassignedSelected ? null : (selectedNodeId ? findNode(divisions, selectedNodeId) : null);

  const getEmployeeCount = useCallback(
    (nodeId) => {
      const node = findNode(divisions, nodeId);
      if (!node) return 0;
      const allIds = getAllDescendantIds(node);
      return employees.filter((e) => allIds.includes(e.departmentId)).length;
    },
    [divisions, employees]
  );

  // --- UI handlers ---
  const toggleExpand = (id) => {
    setExpandedNodes((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const selectNode = (id) => {
    setSelectedNodeId(id);
  };

  // --- Modal openers ---
  const openAddDivision = () => {
    setModal({ type: 'create', data: { level: 'division', parentNode: null } });
  };

  const openAddChild = (parentNode) => {
    const newLevel = childLevel[parentNode.level];
    if (!newLevel) return;
    setModal({ type: 'create', data: { level: newLevel, parentNode } });
    // auto-expand parent
    if (!expandedNodes.includes(parentNode.id)) {
      setExpandedNodes((prev) => [...prev, parentNode.id]);
    }
  };

  const openEdit = (node) => {
    setModal({ type: 'edit', data: { node } });
  };

  const openDelete = (node) => {
    setModal({ type: 'delete', data: { node } });
  };

  const openMove = (node) => {
    if (node.level === 'division') return; // divisions can't move
    const requiredParentLevel = parentLevel[node.level];
    const validParents = collectNodesByLevel(divisions, requiredParentLevel).filter(
      (p) => p.id !== node.parentId
    );
    const currentParent = findNode(divisions, node.parentId);
    setModal({
      type: 'move',
      data: { node, validParents, currentParentName: currentParent?.name || '' },
    });
  };

  const openAssignEmployee = (node) => {
    const available = employees.filter((e) => e.departmentId !== node.id);
    setModal({ type: 'assign', data: { node, availableEmployees: available } });
  };

  const openTransferEmployee = (emp) => {
    // Collect only leaf departments (no children) for transfer target
    const leafDepts = [];
    const collectLeaves = (nodes) => {
      for (const n of nodes) {
        if ((!n.children || n.children.length === 0) && n.id !== emp.departmentId) {
          leafDepts.push(n);
        }
        if (n.children) collectLeaves(n.children);
      }
    };
    collectLeaves(divisions);
    setModal({ type: 'transfer', data: { employee: emp, targets: leafDepts } });
  };

  // --- CRUD handlers ---
  const handleCreate = ({ name }) => {
    const { level, parentNode } = modal.data;
    const newNode = {
      id: `${level}-${Date.now()}`,
      name,
      level,
      parentId: parentNode?.id || null,
      children: [],
    };

    if (level === 'division') {
      setDivisions((prev) => [...prev, newNode]);
    } else {
      setDivisions((prev) => addChildToNode(prev, parentNode.id, newNode));
    }
    setModal({ type: null, data: null });
    addToast('부서가 추가되었습니다', 'success');
  };

  const handleEdit = ({ name }) => {
    const { node } = modal.data;
    setDivisions((prev) => mapTree(prev, node.id, (n) => ({ ...n, name })));
    setModal({ type: null, data: null });
    addToast('부서명이 변경되었습니다', 'success');
  };

  const handleDelete = () => {
    const { node } = modal.data;
    const allIds = getAllDescendantIds(node);
    // Unassign employees
    setEmployees((prev) =>
      prev.map((e) => (allIds.includes(e.departmentId) ? { ...e, departmentId: null } : e))
    );
    // Remove from tree
    setDivisions((prev) => removeNodeFromTree(prev, node.id));
    // Reset selection if deleted node was selected
    if (allIds.includes(selectedNodeId)) {
      setSelectedNodeId(null);
    }
    setModal({ type: null, data: null });
    addToast('부서가 삭제되었습니다', 'success');
  };

  const handleMove = (newParentId) => {
    const { node } = modal.data;
    // Remove from current location
    let updated = removeNodeFromTree(divisions, node.id);
    // Add to new parent
    const movedNode = { ...node, parentId: newParentId };
    updated = addChildToNode(updated, newParentId, movedNode);
    setDivisions(updated);
    // Expand new parent
    if (!expandedNodes.includes(newParentId)) {
      setExpandedNodes((prev) => [...prev, newParentId]);
    }
    setModal({ type: null, data: null });
    addToast('부서가 이동되었습니다', 'success');
  };

  const handleAssignEmployees = (employeeIds) => {
    const { node } = modal.data;
    setEmployees((prev) =>
      prev.map((e) => (employeeIds.includes(e.id) ? { ...e, departmentId: node.id } : e))
    );
    setModal({ type: null, data: null });
    addToast('직원이 배치되었습니다', 'success');
  };

  const handleTransferEmployee = (targetDeptId) => {
    const { employee } = modal.data;
    setEmployees((prev) =>
      prev.map((e) => (e.id === employee.id ? { ...e, departmentId: targetDeptId } : e))
    );
    setModal({ type: null, data: null });
    addToast('직원이 이동되었습니다', 'success');
  };

  const handleRemoveEmployee = (emp) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === emp.id ? { ...e, departmentId: null } : e))
    );
    addToast('직원 배치가 해제되었습니다', 'success');
  };

  const closeModal = () => setModal({ type: null, data: null });

  // --- Render ---
  const totalEmployees = employees.length;
  const totalDepts = divisions.reduce((acc, d) => acc + 1 + countAllDescendantNodes(d), 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">조직 관리</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            본부 · 팀 · 파트 구조를 관리합니다 — 총 {totalDepts}개 부서, {totalEmployees}명
          </p>
        </div>
        <button
          onClick={() => setModal({ type: 'create-any', data: null })}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700"
        >
          <Plus size={18} />
          부서 추가
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Tree Panel */}
        <div className="col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">조직 구조</h3>
          {divisions.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <p className="text-sm">등록된 부서가 없습니다</p>
              <button
                onClick={openAddDivision}
                className="mt-3 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                + 본부 추가하기
              </button>
            </div>
          ) : (
            <div className="space-y-0.5">
              {divisions.map((div) => (
                <OrgTreeNode
                  key={div.id}
                  node={div}
                  employeeCount={getEmployeeCount(div.id)}
                  expandedNodes={expandedNodes}
                  selectedNodeId={selectedNodeId}
                  onToggleExpand={toggleExpand}
                  onSelectNode={selectNode}
                  onAddChild={openAddChild}
                  onEdit={openEdit}
                  onDelete={openDelete}
                  onMove={openMove}
                  getEmployeeCount={getEmployeeCount}
                />
              ))}
            </div>
          )}

          {/* Unassigned employees node */}
          {unassignedEmployees.length > 0 && (
            <>
              <div className="border-t border-gray-100 dark:border-gray-700 mt-4 pt-4">
                <div
                  onClick={() => setSelectedNodeId('__unassigned__')}
                  className={`flex items-center gap-2 py-3 px-5 rounded-xl cursor-pointer transition-all ${
                    isUnassignedSelected
                      ? 'bg-amber-50 dark:bg-amber-900/20 border-l-2 border-amber-500'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700 border-l-2 border-transparent'
                  }`}
                >
                  <UserX size={18} className="text-amber-500" />
                  <span className="font-medium text-gray-700 dark:text-gray-300">미배정</span>
                  <span className="text-xs text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400 px-1.5 py-0.5 rounded-full">
                    {unassignedEmployees.length}명
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Detail Panel */}
        {isUnassignedSelected ? (
          <UnassignedPanel
            employees={unassignedEmployees}
            divisions={divisions}
            onTransferEmployee={openTransferEmployee}
          />
        ) : (
          <DepartmentDetailPanel
            node={selectedNode}
            employees={employees}
            totalEmployeeCount={selectedNode ? getEmployeeCount(selectedNode.id) : 0}
            onAssignEmployee={openAssignEmployee}
            onTransferEmployee={openTransferEmployee}
            onRemoveEmployee={handleRemoveEmployee}
          />
        )}
      </div>

      {/* Modals */}
      {modal.type === 'create-any' && (
        <CreateAnyDeptModal
          divisions={divisions}
          onClose={closeModal}
          onSubmit={(level, parentNode, name) => {
            const newNode = {
              id: `${level}-${Date.now()}`,
              name,
              level,
              parentId: parentNode?.id || null,
              children: [],
            };
            if (level === 'division') {
              setDivisions((prev) => [...prev, newNode]);
            } else {
              setDivisions((prev) => addChildToNode(prev, parentNode.id, newNode));
              if (parentNode && !expandedNodes.includes(parentNode.id)) {
                setExpandedNodes((prev) => [...prev, parentNode.id]);
              }
            }
            closeModal();
            addToast('부서가 추가되었습니다', 'success');
          }}
        />
      )}

      {modal.type === 'create' && (
        <DepartmentFormModal
          mode="create"
          node={null}
          parentNode={modal.data.parentNode}
          level={modal.data.level}
          onClose={closeModal}
          onSubmit={handleCreate}
        />
      )}

      {modal.type === 'edit' && (
        <DepartmentFormModal
          mode="edit"
          node={modal.data.node}
          parentNode={null}
          level={modal.data.node.level}
          onClose={closeModal}
          onSubmit={handleEdit}
        />
      )}

      {modal.type === 'delete' && (
        <DeleteConfirmModal
          node={modal.data.node}
          childCount={countAllDescendantNodes(modal.data.node)}
          employeeCount={getEmployeeCount(modal.data.node.id)}
          onClose={closeModal}
          onConfirm={handleDelete}
        />
      )}

      {modal.type === 'move' && (
        <MoveDepartmentModal
          node={modal.data.node}
          validParents={modal.data.validParents}
          currentParentName={modal.data.currentParentName}
          onClose={closeModal}
          onSubmit={handleMove}
        />
      )}

      {modal.type === 'assign' && (
        <EmployeeAssignModal
          node={modal.data.node}
          availableEmployees={modal.data.availableEmployees}
          onClose={closeModal}
          onSubmit={handleAssignEmployees}
        />
      )}

      {modal.type === 'transfer' && (
        <TransferEmployeeModal
          employee={modal.data.employee}
          targets={modal.data.targets}
          onClose={closeModal}
          onSubmit={handleTransferEmployee}
        />
      )}
    </div>
  );
};

// Unassigned employees panel
const UnassignedPanel = ({ employees, onTransferEmployee }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 space-y-6">
      <div className="flex items-center gap-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">미배정 직원</h3>
        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
          {employees.length}명
        </span>
      </div>

      <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100">
        <p className="text-sm text-amber-700">
          부서에 배치되지 않은 직원입니다. 각 직원의 이동 버튼을 눌러 부서에 배치하세요.
        </p>
      </div>

      <div className="space-y-2">
        {employees.map((emp) => (
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
            <button
              onClick={() => onTransferEmployee(emp)}
              className="px-2.5 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
            >
              부서 배치
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Inline transfer modal (simple dropdown)
const TransferEmployeeModal = ({ employee, targets, onClose, onSubmit }) => {
  const [targetId, setTargetId] = useState('');
  const levelLabels = { division: '본부', team: '팀', part: '파트' };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">직원 이동</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          <span className="font-medium text-gray-900 dark:text-white">{employee.name}</span>을(를) 다른 부서로 이동합니다.
        </p>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">이동할 부서</label>
          <select
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300"
          >
            <option value="">부서를 선택하세요</option>
            {targets.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({levelLabels[t.level]})
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            취소
          </button>
          <button
            onClick={() => targetId && onSubmit(targetId)}
            disabled={!targetId}
            className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            이동
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Generic department creation modal ---
const CreateAnyDeptModal = ({ divisions, onClose, onSubmit }) => {
  const [level, setLevel] = useState('division');
  const [parentId, setParentId] = useState('');
  const [name, setName] = useState('');

  const levelLabels = { division: '본부', team: '팀', part: '파트' };

  // Build parent options based on selected level
  const parentOptions = useMemo(() => {
    if (level === 'division') return [];
    if (level === 'team') {
      return divisions.map((d) => ({ id: d.id, name: d.name, path: d.name }));
    }
    // part: parent must be a team
    const teams = [];
    for (const div of divisions) {
      for (const team of div.children || []) {
        teams.push({ id: team.id, name: team.name, path: `${div.name} > ${team.name}` });
      }
    }
    return teams;
  }, [level, divisions]);

  // Find parent node from tree
  const findParentNode = (nodes, id) => {
    for (const n of nodes) {
      if (n.id === id) return n;
      if (n.children) {
        const found = findParentNode(n.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (level !== 'division' && !parentId) return;
    const parentNode = level === 'division' ? null : findParentNode(divisions, parentId);
    onSubmit(level, parentNode, name.trim());
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">부서 추가</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">유형 *</label>
            <div className="flex gap-2">
              {['division', 'team', 'part'].map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => { setLevel(l); setParentId(''); }}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    level === l
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {levelLabels[l]}
                </button>
              ))}
            </div>
          </div>

          {level !== 'division' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                상위 {level === 'team' ? '본부' : '팀'} *
              </label>
              <select
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-300"
              >
                <option value="">선택하세요</option>
                {parentOptions.map((p) => (
                  <option key={p.id} value={p.id}>{p.path}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {levelLabels[level]}명 *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder={`${levelLabels[level]}명을 입력하세요`}
              autoFocus
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
              disabled={!name.trim() || (level !== 'division' && !parentId)}
              className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              추가
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrganizationPage;
