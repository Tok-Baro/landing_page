import { AlertTriangle, X } from 'lucide-react';

const DeleteConfirmModal = ({ node, childCount, employeeCount, onClose, onConfirm }) => {
  const hasWarning = childCount > 0 || employeeCount > 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">부서 삭제</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            <span className="font-semibold">'{node.name}'</span>을(를) 삭제하시겠습니까?
          </p>

          {hasWarning && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100">
              <div className="flex items-start gap-3">
                <AlertTriangle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-700 space-y-1">
                  {childCount > 0 && <p>하위 부서 {childCount}개가 함께 삭제됩니다.</p>}
                  {employeeCount > 0 && <p>소속 직원 {employeeCount}명이 미배치 상태가 됩니다.</p>}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
