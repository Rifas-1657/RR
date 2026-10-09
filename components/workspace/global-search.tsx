'use client'

import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { BookeyButton } from '@/components/ui-kit/bookey-button'
import { Hint } from '@/components/ui-kit/hint'
import { SearchPanel } from './search-panel'

export function GlobalSearch() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setOpen((value) => !value)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden h-10 w-64 items-center gap-2.5 rounded-full border border-border bg-card px-4 text-sm text-muted-foreground transition-colors outline-none hover:border-primary/40 focus-visible:ring-4 focus-visible:ring-ring/30 md:flex xl:w-80"
      >
        <Search aria-hidden="true" className="size-4" />
        <span className="flex-1 text-left">Search courses</span>
        <kbd className="rounded-md border border-border bg-muted px-1.5 font-mono text-[11px]">Ctrl K</kbd>
      </button>
      <Hint label="Search">
        <BookeyButton size="icon" variant="ghost" aria-label="Search courses" className="md:hidden" onClick={() => setOpen(true)}>
          <Search aria-hidden="true" />
        </BookeyButton>
      </Hint>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="top-[12%] translate-y-0 rounded-3xl p-5 sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-lg">Search Bookey</DialogTitle>
            <DialogDescription>Find a demo course or jump straight to a chapter.</DialogDescription>
          </DialogHeader>
          <SearchPanel autoFocus onNavigate={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
}
