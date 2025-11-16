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
  Users,
  List,
  ArrowRight,
  LogIn
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
 * Dark theme matching the design with proper colors, positions, and styling
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
        { label: 'Išlaidos', path: '/expenses', icon: <List className="w-5 h-5" /> },
        { label: 'AI Pagalba', path: '/ai-help', icon: <Bot className="w-5 h-5" />, badge: 'Beta' },
        { label: 'Prisijungti', path: '/login', icon: <LogIn className="w-5 h-5" /> },
      ],
    },
    {
      items: [
        { label: 'Nustatymai', path: '/settings', icon: <Settings className="w-5 h-5" /> },
        { label: 'Komanda', path: '/team', icon: <Users className="w-5 h-5" /> },
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
    <aside className="fixed left-0 top-0 h-screen w-60 bg-[#2C3E50] overflow-y-auto scrollbar-hide">
      <div className="p-6">
        <h1 className="text-xl font-bold text-white">Sąskaitų Sistema</h1>
      </div>

      <nav className="px-3 pb-6">
        {navSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className={cn(sectionIndex > 0 && 'mt-6 pt-6 border-t border-[#34495E]')}>
            {section.title && (
              <h3 className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {section.title}
              </h3>
            )}
            <ul className="space-y-1">
              {section.items.map((item) => {
                const active = isActive(item.path);
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-semibold transition-colors relative',
                        active
                          ? 'bg-[#4A6FA5] text-white'
                          : 'text-white hover:bg-[#34495E]'
                      )}
                    >
                      <span className="flex-shrink-0">{item.icon}</span>
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="px-2 py-0.5 text-xs font-bold bg-[#0A61C4] text-white rounded">
                          {item.badge}
                        </span>
                      )}
                      <ArrowRight className="w-4 h-4 flex-shrink-0 opacity-60" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        <div className="mt-6 pt-6 border-t border-[#34495E]">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm font-semibold text-white hover:bg-[#34495E] transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Atsijungti</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}

