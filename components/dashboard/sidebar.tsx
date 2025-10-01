'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-provider';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  Building2,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Target,
  Users,
  X,
} from 'lucide-react';
import { Route } from 'next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navigationItems = [
  {
    title: 'Overview',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['Admin', 'Supervisor', 'OfficeUser'],
  },
  {
    title: 'Daily Metrics',
    href: '/dashboard/metrics',
    icon: BarChart3,
    roles: ['Admin', 'Supervisor', 'OfficeUser'],
  },
  {
    title: 'DRM Entries',
    href: '/dashboard/drm',
    icon: FileText,
    roles: ['Admin', 'Supervisor', 'OfficeUser'],
  },
  {
    title: 'Targets',
    href: '/dashboard/targets',
    icon: Target,
    roles: ['Admin', 'Supervisor'],
  },
  {
    title: 'Users',
    href: '/dashboard/users',
    icon: Users,
    roles: ['Admin', 'Supervisor'],
  },
  {
    title: 'Offices',
    href: '/dashboard/offices',
    icon: Building2,
    roles: ['Admin'],
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    roles: ['Admin', 'Supervisor', 'OfficeUser'],
  },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const hasPermission = (roles: string[]) => {
    if (!user) return false;
    return user.roles.some((role) => roles.includes(role.role));
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X /> : <Menu />}
      </Button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-full bg-card border-r transition-all duration-300 lg:relative lg:translate-x-0',
          isCollapsed ? 'w-16' : 'w-64',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b px-4">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground">
                <Building2 className="h-4 w-4" />
              </div>
              {!isCollapsed && (
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">SKFSD Portal</span>
                  <span className="text-xs text-muted-foreground">
                    Dashboard
                  </span>
                </div>
              )}
            </Link>
          </div>

          {/* User info */}
          {!isCollapsed && user && (
            <div className="border-b p-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  {user.firstName.charAt(0)}
                  {user.lastName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.roles?.map((r) => r.role).join(', ')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-2 px-3">
              {navigationItems.map((item) => {
                if (!hasPermission(item.roles)) return null;

                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(item.href + '/');
                const Icon = item.icon;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href as Route}
                      className={cn(
                        'flex items-center space-x-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent',
                        isActive
                          ? 'bg-accent text-accent-foreground'
                          : 'text-muted-foreground'
                      )}
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <Icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="border-t p-4 space-y-2">
            <Button
              variant="ghost"
              className={cn(
                'w-full justify-start text-muted-foreground hover:text-foreground',
                isCollapsed && 'justify-center'
              )}
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <Menu className="h-4 w-4" />
              {!isCollapsed && <span className="ml-3">Collapse</span>}
            </Button>

            <Button
              variant="ghost"
              className={cn(
                'w-full justify-start text-muted-foreground hover:text-destructive',
                isCollapsed && 'justify-center'
              )}
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              {!isCollapsed && <span className="ml-3">Logout</span>}
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
