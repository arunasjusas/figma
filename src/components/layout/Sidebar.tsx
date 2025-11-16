import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Upload, 
  Bot,
  HelpCircle,
  Settings,
  Shield,
  FileCheck,
  LogOut,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: string;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

/**
 * Sidebar navigation component
 * Shows main app navigation with icons and labels in Lithuanian
 */
export function Sidebar() {
  const location = useLocation();
  const logout = useAuthStore(state => state.logout);

  const navSections: NavSection[] = [
    {
      items: [
        { label: 'Peržiūra', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
        { label: 'KPI Panele', path: '/kpi-panel', icon: <LayoutDashboard className="w-5 h-5" /> },
        { label: 'Sąskaitos', path: '/invoices', icon: <FileText className="w-5 h-5" /> },
        { label: 'CSV Įkėlimas', path: '/csv-upload', icon: <Upload className="w-5 h-5" /> },
        { label: 'AI Pagalba', path: '/ai-help', icon: <Bot className="w-5 h-5" />, badge: 'Beta' },
        { label: 'Šiukšliadėžė', path: '/recycle-bin', icon: <Trash2 className="w-5 h-5" /> },
      ],
    },
    {
      items: [
        { label: 'Nustatymai', path: '/settings', icon: <Settings className="w-5 h-5" /> },
        { label: 'Pagalba', path: '/help', icon: <HelpCircle className="w-5 h-5" /> },
        { label: 'Privatumo politika', path: '/privacy', icon: <Shield className="w-5 h-5" /> },
        { label: 'Naudojimo Sąlygos', path: '/terms', icon: <FileCheck className="w-5 h-5" /> },
      ],
    },
  ];

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-[#1F1F1F] border-r border-[#3A3A3A] flex flex-col scrollbar-hide">
      <div className="p-6 flex-shrink-0">
        <h1 className="text-xl font-bold text-white">Sąskaitų Sistema</h1>
      </div>

      <nav className="flex-1 flex flex-col px-3 pb-6 overflow-y-auto">
        {/* Top section - main navigation */}
        <div className="flex-shrink-0">
          {navSections[0] && (
            <ul className="space-y-1">
              {navSections[0].items.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive(item.path)
                        ? 'bg-gray-700 text-white'
                        : 'text-gray-300 hover:bg-gray-700'
                    )}
                  >
                    {item.icon}
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="px-2 py-0.5 text-xs bg-gray-700 text-white rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Bottom section - settings and footer, pushed to bottom */}
        <div className="mt-auto pt-6 border-t border-gray-700">
          {navSections[1] && (
            <ul className="space-y-1 mb-6">
              {navSections[1].items.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive(item.path)
                        ? 'bg-gray-700 text-white'
                        : 'text-gray-300 hover:bg-gray-700'
                    )}
                  >
                    {item.icon}
                    <span className="flex-1">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <div className="pt-6 border-t border-gray-700">
            <button
              onClick={logout}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-700 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Atsijungti</span>
            </button>
          </div>
        </div>
      </nav>
    </aside>
  );
}

