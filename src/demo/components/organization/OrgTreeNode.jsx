import { useState, useRef, useEffect } from 'react';
import { ChevronRight, Building2, Plus, MoreHorizontal, Pencil, Trash2, ArrowRightLeft } from 'lucide-react';

const levelConfig = {
  division: { iconColor: 'text-indigo-500', indent: 'pl-3', addLabel: '팀 추가', badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' },
  team: { iconColor: 'text-blue-400', indent: 'pl-10', addLabel: '파트 추가', badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  part: { iconColor: 'text-gray-400', indent: 'pl-[4.5rem]', badge: 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300' },
};

const OrgTreeNode = ({
  node,
  employeeCount,
  expandedNodes,
  selectedNodeId,
  onToggleExpand,
  onSelectNode,
  onAddChild,
  onEdit,
  onDelete,
  onMove,
  getEmployeeCount,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const config = levelConfig[node.level];
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedNodes.includes(node.id);
  const isSelected = selectedNodeId === node.id;
  const canAddChild = node.level !== 'part';

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  return (
    <div>
      <div
        className={`flex items-center justify-between group rounded-xl cursor-pointer transition-all ${config.indent} ${
          isSelected
            ? 'bg-indigo-50 dark:bg-indigo-900/20 border-l-2 border-indigo-500'
            : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 border-l-2 border-transparent'
        }`}
      >
        <div
          className="flex items-center gap-2 py-3 px-2 flex-1 min-w-0"
          onClick={() => onSelectNode(node.id)}
        >
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand(node.id);
              }}
              className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors flex-shrink-0"
            >
              <ChevronRight
                size={16}
                className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
              />
            </button>
          ) : (
            <div className="w-[22px] flex-shrink-0" />
          )}
          <Building2 size={18} className={`${config.iconColor} flex-shrink-0`} />
          <span className={`truncate ${node.level === 'division' ? 'font-semibold text-gray-900 dark:text-white' : node.level === 'team' ? 'font-medium text-gray-800 dark:text-gray-200' : 'text-gray-700 dark:text-gray-300'}`}>
            {node.name}
          </span>
          <span className="text-xs text-gray-400 flex-shrink-0">({employeeCount}명)</span>
        </div>

        <div className="flex items-center gap-1 pr-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          {canAddChild && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddChild(node);
              }}
              className="flex items-center gap-1 px-2 py-1 text-xs text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
            >
              <Plus size={14} />
              {config.addLabel}
            </button>
          )}
          <div className="relative" ref={menuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1.5 text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              <MoreHorizontal size={16} />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-8 w-36 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 py-1 z-50">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                    onEdit(node);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <Pencil size={14} /> 수정
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                    onMove(node);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <ArrowRightLeft size={14} /> 이동
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                    onDelete(node);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 size={14} /> 삭제
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isExpanded && hasChildren && (
        <div>
          {node.children.map((child) => (
            <OrgTreeNode
              key={child.id}
              node={child}
              employeeCount={getEmployeeCount(child.id)}
              expandedNodes={expandedNodes}
              selectedNodeId={selectedNodeId}
              onToggleExpand={onToggleExpand}
              onSelectNode={onSelectNode}
              onAddChild={onAddChild}
              onEdit={onEdit}
              onDelete={onDelete}
              onMove={onMove}
              getEmployeeCount={getEmployeeCount}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrgTreeNode;
