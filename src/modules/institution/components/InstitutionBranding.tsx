// src/modules/institution/components/InstitutionBranding.jsx
import React, { useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { UploadCloud, Image, Sparkles } from 'lucide-react'

export function InstitutionBranding({ branding = {}, onChange }: { branding?: any; onChange?: (field: string, val: any) => void }) {
  const logoInputRef = useRef(null)
  const faviconInputRef = useRef(null)

  const handleMockUpload = (field, file) => {
    if (!file) return
    const mockUrl = URL.createObjectURL(file)
    onChange && onChange(field, mockUrl)
  }

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-3 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold text-slate-900">Institution Branding</CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Visual identity, crest emblem, favicon and institutional theme tokens
            </CardDescription>
          </div>
          <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
            Design System
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-5 space-y-5 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Logo Upload & Preview */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 block">
              Official Institution Logo
            </label>
            <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="h-16 w-16 rounded-lg bg-white border border-slate-200 p-1 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                {branding.logo ? (
                  <img src={branding.logo} alt="Institution Logo" className="h-full w-full object-contain" />
                ) : (
                  <Image className="h-8 w-8 text-slate-300" />
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  ref={logoInputRef}
                  accept=".png,.svg,.jpg,.jpeg"
                  className="hidden"
                  onChange={(e) => handleMockUpload('logo', e.target.files?.[0])}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs h-8"
                  onClick={() => logoInputRef.current?.click()}
                >
                  <UploadCloud className="h-3.5 w-3.5 mr-1.5" /> Upload Logo
                </Button>
                <p className="text-[11px] text-slate-400 mt-1">
                  Recommended: SVG or high-res transparent PNG (512x512)
                </p>
              </div>
            </div>
          </div>

          {/* Favicon Upload & Preview */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 block">
              Browser Favicon (Small Icon)
            </label>
            <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="h-12 w-12 rounded-md bg-white border border-slate-200 p-1 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                {branding.favicon ? (
                  <img src={branding.favicon} alt="Favicon" className="h-full w-full object-contain" />
                ) : (
                  <Image className="h-6 w-6 text-slate-300" />
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  ref={faviconInputRef}
                  accept=".ico,.png,.svg"
                  className="hidden"
                  onChange={(e) => handleMockUpload('favicon', e.target.files?.[0])}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs h-8"
                  onClick={() => faviconInputRef.current?.click()}
                >
                  <UploadCloud className="h-3.5 w-3.5 mr-1.5" /> Upload Favicon
                </Button>
                <p className="text-[11px] text-slate-400 mt-1">
                  Format: .ico, .svg or square 32x32 / 64x64 PNG
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Color Palette Tokens */}
        <div className="pt-2 border-t border-slate-100">
          <label className="text-xs font-semibold text-slate-700 block mb-2.5">
            Institutional Brand Color Theme
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-[11px] text-slate-500 block mb-1">Primary Color (Buttons, active states, accents)</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={branding.primaryColor || '#2563eb'}
                  onChange={(e) => onChange && onChange('primaryColor', e.target.value)}
                  className="h-9 w-10 p-0.5 border border-slate-300 rounded cursor-pointer"
                />
                <Input
                  value={branding.primaryColor || '#2563eb'}
                  onChange={(e) => onChange && onChange('primaryColor', e.target.value)}
                  className="h-9 text-xs font-mono uppercase"
                  placeholder="#2563EB"
                />
              </div>
            </div>

            <div>
              <span className="text-[11px] text-slate-500 block mb-1">Secondary Color (Sidebar, dark headers)</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={branding.secondaryColor || '#0f172a'}
                  onChange={(e) => onChange && onChange('secondaryColor', e.target.value)}
                  className="h-9 w-10 p-0.5 border border-slate-300 rounded cursor-pointer"
                />
                <Input
                  value={branding.secondaryColor || '#0f172a'}
                  onChange={(e) => onChange && onChange('secondaryColor', e.target.value)}
                  className="h-9 text-xs font-mono uppercase"
                  placeholder="#0F172A"
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
