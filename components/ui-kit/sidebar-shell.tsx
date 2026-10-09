'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookeyBadge } from '@/components/ui-kit/bookey-badge'
import { BookeyLogo } from '@/components/ui-kit/bookey-logo'
import { cn } from '@/lib/utils'

export interface SidebarNavItem {
  href: string
  label: string
  icon: React.ReactNode
}

interface SidebarShellProps {
  nav: SidebarNavItem[]
  navLabel: string
  badge?: string
  children: React.ReactNode
}

/** Shared app chrome for the workspace and admin route groups. */
export function SidebarShell({ nav, navLabel, badge, children }: SidebarShellProps) {
  const pathname = usePathname()

  const links = nav.map((item) => {
    const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
    return (
      <li key={item.href}>
        <Link
          href={item.href}
          aria-current={active ? 'page' : undefined}
          className={cn(
            'flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors [&_svg]:size-4',
            active ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
          )}
        >
          {item.icon}
          {item.label}
        </Link>
      </li>
    )
  })

  return (
    <div className="min-h-dvh md:grid md:grid-cols-[15rem_minmax(0,1fr)]">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-card focus:px-4 focus:py-2"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur-md md:h-dvh md:border-r md:border-b-0">
        <div className="flex items-center justify-between gap-3 px-4 py-3 md:flex-col md:items-start md:gap-8 md:px-4 md:py-6">
          <Link href="/" aria-label="Bookey design system" className="rounded-lg">
            <BookeyLogo />
          </Link>
          {badge && <BookeyBadge tone="neutral">{badge}</BookeyBadge>}
        </div>
        <nav aria-label={navLabel} className="overflow-x-auto px-3 pb-3 md:px-3">
          <ul className="flex gap-1 md:flex-col">{links}</ul>
        </nav>
      </header>
      <main id="main" className="min-w-0 px-4 py-8 sm:px-6 lg:px-10">
        {children}
      </main>
    </div>
  )
}
