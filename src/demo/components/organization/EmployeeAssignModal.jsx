import { useState } from 'react';
import { X, Search, UserPlus } from 'lucide-react';

const EmployeeAssignModal = ({ node, availableEmployees, onClose, onSubmit }) => {
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  const filtered = availableEmployees.filter(
    (e) =>
      e.name.includes(search) ||
      e.email.includes(search) ||
      e.position.includes(search)
  );

  const toggleEmployee = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    if (selectedIds.length === 0) return;
    onSubmit(selectedIds);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">직원 배치</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              <span className="font-medium text-gray-700 dark:text-gray-300">{node.name}</span>에 배치할 직원을 선택하세요
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="relative mb-4">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="이름, 이메일, 직책으로 검색..."
            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:text-white"
          />
        </div>

        <div className="max-h-72 overflow-y-auto border border-gray-100 dark:border-gray-700 rounded-xl">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-400">
              <UserPlus size={24} className="mx-auto mb-2" />
              {search ? '검색 결과가 없습니다' : '배치 가능한 직원이 없습니다'}
            </div>
          ) : (
            filtered.map((emp) => (
              <label
                key={emp.id}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors border-b border-gray-50 dark:border-gray-700 last:border-b-0 ${
                  selectedIds.includes(emp.id) ? 'bg-indigo-50 dark:bg-indigo-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedIds.includes(emp.id)}
                  onChange={() => toggleEmployee(emp.id)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <div className="w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-600 dark:text-gray-400 text-xs font-medium">{emp.name[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{emp.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{emp.position} · {emp.email}</p>
                </div>
                {emp.departmentId && (
                  <span className="text-xs text-gray-400 flex-shrink-0">다른 부서</span>
                )}
              </label>
            ))
          )}
        </div>

        {selectedIds.length > 0 && (
          <div className="mt-3 text-sm text-indigo-600 font-medium">
            {selectedIds.length}명 선택됨
          </div>
        )}

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={selectedIds.length === 0}
            className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <UserPlus size={16} />
            배치 ({selectedIds.length}명)
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeAssignModal;
