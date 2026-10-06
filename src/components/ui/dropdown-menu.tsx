// src/components/ui/dropdown-menu.tsx
import * as React from 'react'
import { cn } from '@/lib/utils'

interface DropdownMenuContextValue {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DropdownMenuContext = React.createContext<DropdownMenuContextValue>({
  open: false,
  setOpen: () => {},
})

export interface DropdownMenuProps {
  children: React.ReactNode;
}

export function DropdownMenu({ children }: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleOutsideClick)
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [open])

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block text-left" ref={menuRef}>
        {children}
      </div>
    </DropdownMenuContext.Provider>
  )
}

export interface DropdownMenuTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export function DropdownMenuTrigger({ asChild, children, ...props }: DropdownMenuTriggerProps) {
  const { open, setOpen } = React.useContext(DropdownMenuContext)

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation()
        setOpen(!open)
        if ((children as any).props?.onClick) (children as any).props.onClick(e)
      },
    })
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        setOpen(!open)
      }}
      {...props}
    >
      {children}
    </button>
  )
}

export interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'left' | 'right' | 'start' | 'end' | 'center';
}

export function DropdownMenuContent({ className, align = 'right', children, ...props }: DropdownMenuContentProps) {
  const { open, setOpen } = React.useContext(DropdownMenuContext)
  if (!open) return null

  const alignmentClass =
    align === 'end' || align === 'right'
      ? 'right-0 origin-top-right'
      : align === 'start' || align === 'left'
      ? 'left-0 origin-top-left'
      : 'left-1/2 -translate-x-1/2 origin-top'

  return (
    <div
      className={cn(
        'absolute z-50 mt-1 min-w-[8rem] overflow-hidden rounded-md border border-slate-200 bg-white p-1 text-slate-950 shadow-md animate-in fade-in-0 zoom-in-95',
        alignmentClass,
        className
      )}
      onClick={() => setOpen(false)}
      {...props}
    >
      {children}
    </div>
  )
}

export interface DropdownMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DropdownMenuItem({ className, children, onClick, ...props }: DropdownMenuItemProps) {
  const { setOpen } = React.useContext(DropdownMenuContext)
  return (
    <div
      role="menuitem"
      className={cn(
        'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-xs outline-none transition-colors hover:bg-slate-100 hover:text-slate-900 focus:bg-slate-100 focus:text-slate-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className
      )}
      onClick={(e) => {
        if (onClick) onClick(e)
        setOpen(false)
      }}
      {...props}
    >
      {children}
    </div>
  )
}

export function DropdownMenuSeparator({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('-mx-1 my-1 h-px bg-slate-100', className)} {...props} />
}
