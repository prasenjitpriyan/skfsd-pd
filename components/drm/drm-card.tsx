'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DRMEntry } from '@/types/drm'
import { formatDistanceToNow } from 'date-fns'
import {
  AlertTriangle,
  Calendar,
  Clock,
  DollarSign,
  Edit,
  Eye,
  FileText,
  User
} from 'lucide-react'
import { Route } from 'next'
import Link from 'next/link'
import { WorkflowStepper } from './workflow-stepper'

interface DRMCardProps {
  entry: DRMEntry
}

const statusColors = {
  'Draft': 'bg-gray-100 text-gray-800',
  'Submitted': 'bg-blue-100 text-blue-800',
  'Scrutinized': 'bg-yellow-100 text-yellow-800',
  'Finalized': 'bg-green-100 text-green-800',
  'Rejected': 'bg-red-100 text-red-800',
}

const priorityColors = {
  'low': 'bg-blue-100 text-blue-800',
  'normal': 'bg-gray-100 text-gray-800',
  'high': 'bg-orange-100 text-orange-800',
  'urgent': 'bg-red-100 text-red-800',
}

const categoryIcons = {
  'revenue': DollarSign,
  'expenditure': DollarSign,
  'savings': DollarSign,
  'insurance': FileText,
  'other': FileText,
}

export function DRMCard({ entry }: DRMCardProps) {
  const CategoryIcon = categoryIcons[entry.category] || FileText
  const isOverdue = entry.metadata.deadline && new Date(entry.metadata.deadline) < new Date()

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-medium truncate">
              {entry.title}
            </CardTitle>
            <CardDescription className="mt-1">
              Entry #{entry.entryNumber} • Created {formatDistanceToNow(new Date(entry.createdAt), { addSuffix: true })}
            </CardDescription>
          </div>

          <div className="flex items-center space-x-2 ml-4">
            <Badge className={statusColors[entry.status]}>
              {entry.status}
            </Badge>
            {entry.metadata.priority !== 'normal' && (
              <Badge variant="outline" className={priorityColors[entry.metadata.priority]}>
                {entry.metadata.priority}
              </Badge>
            )}
            {isOverdue && (
              <Badge variant="destructive" className="text-xs">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Overdue
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Entry Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <CategoryIcon className="h-4 w-4 text-muted-foreground" />
            <span className="capitalize">{entry.category}</span>
          </div>

          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span>₹{entry.amount.toLocaleString()}</span>
          </div>

          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{entry.month}/{entry.year}</span>
          </div>

          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>{entry.workflow.createdBy}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {entry.description}
        </p>

        {/* Workflow Progress */}
        <WorkflowStepper
          currentStatus={entry.status}
          workflow={entry.workflow}
          size="sm"
        />

        {/* Deadline Warning */}
        {entry.metadata.deadline && (
          <div className="flex items-center space-x-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className={isOverdue ? 'text-red-600' : 'text-muted-foreground'}>
              Deadline: {new Date(entry.metadata.deadline).toLocaleDateString()}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center pt-2 border-t">
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            {entry.attachments && entry.attachments.length > 0 && (
              <span>{entry.attachments.length} attachment(s)</span>
            )}
            {entry.comments && entry.comments.length > 0 && (
              <span>{entry.comments.length} comment(s)</span>
            )}
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/drm/${entry.id}` as Route}>
                <Eye className="h-4 w-4 mr-1" />
                View
              </Link>
            </Button>

            {(entry.status === 'Draft' || entry.status === 'Rejected') && (
              <Button variant="outline" size="sm" asChild>
                <Link href={`/drm/${entry.id}/edit` as Route}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Link>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
