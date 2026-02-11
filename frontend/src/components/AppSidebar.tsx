import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  CalendarDays,
  FileText,
  CreditCard,
  LogOut,
  Heart,
  Building2,
  UserCircle,
  Calendar,
  Pill,
  Package,
  ListOrdered,
} from 'lucide-react';

const AppSidebar = () => {
  const { profile, role, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const navItems = [
    // Admin Portal
    { to: '/admin', icon: LayoutDashboard, label: 'Admin Dashboard', roles: ['admin'] },
    { to: '/queue', icon: ListOrdered, label: 'Queue Management', roles: ['admin'] },
    { to: '/departments', icon: Building2, label: 'Departments', roles: ['admin'] },
    { to: '/inventory', icon: Package, label: 'Inventory', roles: ['admin'] },
    
    // Doctor Portal
    { to: '/doctor', icon: LayoutDashboard, label: 'Doctor Dashboard', roles: ['doctor'] },
    { to: '/queue', icon: ListOrdered, label: 'Patient Queue', roles: ['doctor'] },
    { to: '/patients', icon: Users, label: 'My Patients', roles: ['doctor'] },
    { to: '/appointments', icon: CalendarDays, label: 'My Appointments', roles: ['doctor'] },
    { to: '/calendar', icon: Calendar, label: 'Calendar View', roles: ['doctor'] },
    { to: '/prescriptions', icon: Pill, label: 'Prescriptions', roles: ['doctor'] },
    { to: '/records', icon: FileText, label: 'Medical Records', roles: ['doctor'] },
    
    // Patient Portal
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['patient'] },
    { to: '/doctors', icon: Stethoscope, label: 'Find Doctors', roles: ['patient'] },
    { to: '/appointments', icon: CalendarDays, label: 'My Appointments', roles: ['patient'] },
    { to: '/calendar', icon: Calendar, label: 'Calendar View', roles: ['patient'] },
    { to: '/prescriptions', icon: Pill, label: 'My Prescriptions', roles: ['patient'] },
    { to: '/records', icon: FileText, label: 'My Records', roles: ['patient'] },
    { to: '/billing', icon: CreditCard, label: 'Billing', roles: ['patient'] },
    
    // Common for all
    { to: '/profile', icon: UserCircle, label: 'My Profile', roles: ['admin', 'doctor', 'patient'] },
  ];

  const visibleItems = navItems.filter(item => role && item.roles.includes(role));
  const displayName = profile ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'User' : 'User';

  return (
    <aside className="gradient-sidebar flex h-screen w-64 flex-col text-sidebar-foreground fixed left-0 top-0 z-30">
      <div className="flex items-center gap-3 px-6 py-6 border-b border-sidebar-border">
        <div className="gradient-primary flex h-10 w-10 items-center justify-center rounded-xl">
          <Heart className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-heading text-base font-bold text-sidebar-accent-foreground">MedCare</h1>
          <p className="text-xs text-sidebar-muted">Healthcare System</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {visibleItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-sidebar-accent text-sidebar-primary'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
              }`
            }
          >
            <item.icon className="h-[18px] w-[18px]" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="gradient-primary flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-primary-foreground">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-accent-foreground truncate">{displayName}</p>
            <p className="text-xs text-sidebar-muted capitalize">{role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;
