import { ArrowLeft, Users } from 'lucide-react'
import { SidebarShell, type SidebarNavItem } from '@/components/ui-kit/sidebar-shell'

const NAV: SidebarNavItem[] = [
  { href: '/admin', label: 'Members', icon: <Users aria-hidden="true" /> },
  { href: '/dashboard', label: 'Back to workspace', icon: <ArrowLeft aria-hidden="true" /> },
]

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarShell nav={NAV} navLabel="Admin" badge="Admin · demo">
      {children}
    </SidebarShell>
  )
}
