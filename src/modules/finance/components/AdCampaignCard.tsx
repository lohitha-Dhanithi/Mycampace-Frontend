// src/modules/finance/components/AdCampaignCard.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '../config/financeConfig'
import { Eye, MousePointerClick, TrendingUp, Calendar, ExternalLink } from 'lucide-react'

export interface AdCampaignCardProps {
  campaign: any
  onApprove?: (id: any) => Promise<void> | void
  onReject?: (id: any) => Promise<void> | void
}

export function AdCampaignCard({ campaign, onApprove, onReject }: AdCampaignCardProps) {
  const getStatusVariant = (st) => {
    switch (st) {
      case 'Active':
        return 'success'
      case 'Scheduled':
        return 'info'
      case 'Pending Approval':
        return 'warning'
      case 'Completed':
        return 'secondary'
      case 'Rejected':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow border-slate-200 overflow-hidden flex flex-col justify-between">
      {campaign.creativeUrl && (
        <div className="relative h-32 w-full bg-slate-100 overflow-hidden border-b border-slate-200">
          <img
            src={campaign.creativeUrl}
            alt={campaign.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 left-2">
            <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded">
              Sponsored
            </span>
          </div>
          <div className="absolute top-2 right-2">
            <Badge variant={getStatusVariant(campaign.status)} className="text-[10px]">
              {campaign.status}
            </Badge>
          </div>
        </div>
      )}

      <CardHeader className="pb-2">
        {!campaign.creativeUrl && (
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              Promoted
            </span>
            <Badge variant={getStatusVariant(campaign.status)} className="text-[10px]">
              {campaign.status}
            </Badge>
          </div>
        )}
        <div className="text-[11px] font-semibold text-blue-600 truncate">{campaign.company}</div>
        <CardTitle className="text-sm font-bold text-slate-900 line-clamp-1">{campaign.name}</CardTitle>
        <p className="text-[11px] text-slate-500 truncate mt-0.5">Placement: {campaign.placementName}</p>
      </CardHeader>

      <CardContent className="space-y-3 pb-3">
        {/* Metric Badges */}
        <div className="grid grid-cols-3 gap-2 p-2 bg-slate-50 rounded border border-slate-200 text-center">
          <div>
            <div className="text-[10px] text-slate-400 font-medium">Impressions</div>
            <div className="text-xs font-bold text-slate-800">{campaign.impressions?.toLocaleString('en-IN') || 0}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium">Clicks</div>
            <div className="text-xs font-bold text-slate-800">{campaign.clicks?.toLocaleString('en-IN') || 0}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium">CTR</div>
            <div className="text-xs font-bold text-emerald-600">{campaign.ctr}%</div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
          <span className="text-slate-500">Revenue Recognized:</span>
          <span className="font-extrabold text-blue-700">{formatCurrency(campaign.revenue)}</span>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
          <Calendar className="h-3 w-3" />
          <span>{campaign.startDate} to {campaign.endDate}</span>
        </div>
      </CardContent>

      <CardFooter className="pt-2 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-b-lg">
        <a
          href={campaign.landingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] text-slate-500 hover:text-blue-600 flex items-center gap-1"
        >
          <ExternalLink className="h-3 w-3" />
          Landing URL
        </a>

        <div className="flex items-center gap-1.5">
          {campaign.status === 'Pending Approval' && onApprove && (
            <Button size="sm" variant="default" className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700" onClick={() => onApprove(campaign.id)}>
              Approve
            </Button>
          )}
          <Button variant="outline" size="sm" asChild className="h-7 text-xs">
            <Link to={`/finance/advertising/campaigns/${campaign.id}`}>
              <Eye className="h-3.5 w-3.5 mr-1" />
              Metrics
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
