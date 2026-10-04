// src/components/ui/dropdown-menu.jsx
import * as React from 'react'
import { cn } from '@/lib/utils'

const DropdownMenuContext = React.createContext({
  open: false,
  setOpen: () => {},
})

export function DropdownMenu({ children }) {
  const [open, setOpen] = React.useState(false)
  const menuRef = React.useRef(null)

  React.useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
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

export function DropdownMenuTrigger({ asChild, children, ...props }) {
  const { open, setOpen } = React.useContext(DropdownMenuContext)

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: (e) => {
        e.stopPropagation()
        setOpen(!open)
        if (children.props.onClick) children.props.onClick(e)
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

export function DropdownMenuContent({ className, align = 'right', children, ...props }) {
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

export function DropdownMenuItem({ className, children, onClick, ...props }) {
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

export function DropdownMenuSeparator({ className, ...props }) {
  return <div className={cn('-mx-1 my-1 h-px bg-slate-100', className)} {...props} />
}
