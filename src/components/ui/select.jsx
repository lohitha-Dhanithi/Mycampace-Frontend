// src/components/ui/select.jsx
import * as React from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const SelectContext = React.createContext(null)

const Select = React.forwardRef(({ className, children, value, onValueChange, defaultValue, onChange, ...props }, ref) => {
  // If it's used as compound select (onValueChange provided, or children has SelectTrigger)
  const isCompound = Boolean(onValueChange || (React.Children.toArray(children).some(child => child?.type?.displayName === 'SelectTrigger' || child?.type?.displayName === 'SelectContent')))

  if (!isCompound) {
    // Native select mode for older components
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          value={value}
          onChange={onChange}
          defaultValue={defaultValue}
          className={cn(
            'flex h-9 w-full appearance-none rounded-md border border-slate-300 bg-white px-3 py-1 pr-8 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 text-slate-800',
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-4 w-4 text-slate-400" />
      </div>
    )
  }

  // Compound select mode
  const [open, setOpen] = React.useState(false)
  const [currentValue, setCurrentValue] = React.useState(value !== undefined ? value : defaultValue || '')
  const [selectedLabel, setSelectedLabel] = React.useState('')
  const [placeholder, setPlaceholder] = React.useState('')
  const containerRef = React.useRef(null)

  React.useEffect(() => {
    if (value !== undefined) {
      setCurrentValue(value)
    }
  }, [value])

  React.useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleOutsideClick)
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [open])

  const handleSelect = (val, label) => {
    setCurrentValue(val)
    setSelectedLabel(label)
    if (onValueChange) {
      onValueChange(val)
    }
    setOpen(false)
  }

  return (
    <SelectContext.Provider
      value={{
        open,
        setOpen,
        value: currentValue,
        onSelect: handleSelect,
        selectedLabel,
        setSelectedLabel,
        placeholder,
        setPlaceholder,
      }}
    >
      <div ref={containerRef} className={cn('relative w-full inline-block', className)}>
        {children}
      </div>
    </SelectContext.Provider>
  )
})
Select.displayName = 'Select'

const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => {
  const ctx = React.useContext(SelectContext)
  return (
    <button
      type="button"
      ref={ref}
      onClick={() => ctx?.setOpen(!ctx?.open)}
      className={cn(
        'flex h-9 w-full items-center justify-between rounded-md border border-slate-300 bg-white px-3 py-1 text-sm shadow-xs transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 disabled:cursor-not-allowed disabled:opacity-50 text-left',
        className
      )}
      {...props}
    >
      <div className="flex-1 truncate">{children}</div>
      <ChevronDown className="h-4 w-4 text-slate-400 shrink-0 ml-1.5" />
    </button>
  )
})
SelectTrigger.displayName = 'SelectTrigger'

const SelectValue = React.forwardRef(({ placeholder, className, ...props }, ref) => {
  const ctx = React.useContext(SelectContext)

  React.useEffect(() => {
    if (placeholder && ctx?.setPlaceholder) {
      ctx.setPlaceholder(placeholder)
    }
  }, [placeholder, ctx])

  const display = ctx?.selectedLabel || ctx?.value || placeholder

  return (
    <span
      ref={ref}
      className={cn(
        'truncate block',
        !ctx?.selectedLabel && !ctx?.value && placeholder ? 'text-slate-400 font-normal' : 'text-slate-900 font-medium',
        className
      )}
      {...props}
    >
      {display}
    </span>
  )
})
SelectValue.displayName = 'SelectValue'

const SelectContent = React.forwardRef(({ className, children, ...props }, ref) => {
  const ctx = React.useContext(SelectContext)
  if (!ctx?.open) return null

  return (
    <div
      ref={ref}
      className={cn(
        'absolute z-50 mt-1 max-h-60 w-full min-w-[8rem] overflow-auto rounded-md border border-slate-200 bg-white p-1 text-slate-900 shadow-lg ring-1 ring-black/5 animate-in fade-in-80',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})
SelectContent.displayName = 'SelectContent'

const SelectItem = React.forwardRef(({ className, children, value, ...props }, ref) => {
  const ctx = React.useContext(SelectContext)
  const isSelected = String(ctx?.value) === String(value)

  React.useEffect(() => {
    if (isSelected && typeof children === 'string' && ctx?.setSelectedLabel) {
      ctx.setSelectedLabel(children)
    }
  }, [isSelected, children, ctx])

  return (
    <div
      ref={ref}
      onClick={() => ctx?.onSelect(value, typeof children === 'string' ? children : String(value))}
      className={cn(
        'relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-6 text-xs outline-none hover:bg-blue-50 hover:text-blue-900 transition-colors',
        isSelected && 'bg-blue-50 font-semibold text-blue-900',
        className
      )}
      {...props}
    >
      <span className="truncate">{children}</span>
      {isSelected && (
        <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
          <Check className="h-3.5 w-3.5 text-blue-600" />
        </span>
      )}
    </div>
  )
})
SelectItem.displayName = 'SelectItem'

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }
