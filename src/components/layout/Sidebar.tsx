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
        { label: 'Sąskaitos', path: '/invoices', icon: <FileText className="w-5 h-5" /> },
        { label: 'CSV Įkėlimas', path: '/csv-upload', icon: <Upload className="w-5 h-5" /> },
        { label: 'Šiukšliadėžė', path: '/recycle-bin', icon: <Trash2 className="w-5 h-5" /> },
      ],
    },
    {
      items: [
        { label: 'AI Pagalba', path: '/ai-help', icon: <Bot className="w-5 h-5" />, badge: 'Beta' },
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
    <aside className="fixed left-0 top-0 h-screen w-60 bg-white border-r border-neutral-border overflow-y-auto scrollbar-hide">
      <div className="p-6">
        <h1 className="text-xl font-bold text-primary">Sąskaitų Sistema</h1>
      </div>

      <nav className="px-3 pb-6">
        {navSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-6">
            {section.title && (
              <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {section.title}
              </h3>
            )}
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive(item.path)
                        ? 'bg-primary/10 text-primary'
                        : 'text-gray-700 hover:bg-gray-100'
                    )}
                  >
                    {item.icon}
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="mt-6 pt-6 border-t border-neutral-border">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Atsijungti</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}

