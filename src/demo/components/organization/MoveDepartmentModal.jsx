import { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';

const levelLabels = { division: '본부', team: '팀', part: '파트' };

const MoveDepartmentModal = ({ node, validParents, currentParentName, onClose, onSubmit }) => {
  const [selectedParentId, setSelectedParentId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedParentId) return;
    onSubmit(selectedParentId);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">부서 이동</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">이동 대상</label>
            <div className="px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm">
              <span className="font-medium text-gray-900 dark:text-white">{node.name}</span>
              <span className="text-gray-400 ml-2">({levelLabels[node.level]})</span>
            </div>
          </div>

          <div className="flex items-center justify-center py-2">
            <ArrowRight size={20} className="text-gray-400 rotate-90" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              현재 위치: <span className="text-gray-500 dark:text-gray-400 font-normal">{currentParentName || '최상위'}</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">이동할 상위 부서</label>
            {validParents.length === 0 ? (
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-400">
                이동 가능한 부서가 없습니다
              </div>
            ) : (
              <select
                value={selectedParentId}
                onChange={(e) => setSelectedParentId(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-300"
              >
                <option value="">부서를 선택하세요</option>
                {validParents.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({levelLabels[p.level]})
                  </option>
                ))}
              </select>
            )}
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
              disabled={!selectedParentId}
              className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              이동
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MoveDepartmentModal;
