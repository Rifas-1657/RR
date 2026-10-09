import { BookOpen, LayoutDashboard, NotebookPen } from 'lucide-react'
import { SidebarShell, type SidebarNavItem } from '@/components/ui-kit/sidebar-shell'

const NAV: SidebarNavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard aria-hidden="true" /> },
  { href: '/read/the-focus-engine', label: 'Continue reading', icon: <BookOpen aria-hidden="true" /> },
  { href: '/admin', label: 'Admin', icon: <NotebookPen aria-hidden="true" /> },
]

export function WorkspaceShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarShell nav={NAV} navLabel="Workspace" badge="Sample data">
      {children}
    </SidebarShell>
  )
}
