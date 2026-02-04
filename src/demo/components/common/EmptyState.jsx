import { Search, Users, Building2, FileText, Bell, Inbox } from 'lucide-react';

const ICONS = {
  search: Search,
  users: Users,
  building: Building2,
  file: FileText,
  bell: Bell,
  inbox: Inbox,
};

const EmptyState = ({ icon = 'inbox', title, description, action }) => {
  const Icon = ICONS[icon] || Inbox;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center mb-4">
        <Icon size={36} className="text-gray-300 dark:text-gray-500" />
      </div>
      <h4 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">{title}</h4>
      {description && (
        <p className="text-sm text-gray-400 dark:text-gray-500 max-w-xs">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
