import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, Bell, CheckCircle, Clock, Info } from 'lucide-react'

const notifications = [
  {
    id: 1,
    type: 'warning',
    title: 'Target Behind Schedule',
    message: 'Letters delivery target is 5% behind schedule',
    time: '2 hours ago',
    action: 'View Details',
  },
  {
    id: 2,
    type: 'info',
    title: 'DRM Entry Pending',
    message: '3 DRM entries require your review',
    time: '4 hours ago',
    action: 'Review',
  },
  {
    id: 3,
    type: 'success',
    title: 'Daily Metrics Submitted',
    message: 'Today\'s metrics have been successfully submitted',
    time: '6 hours ago',
    action: null,
  },
  {
    id: 4,
    type: 'urgent',
    title: 'System Maintenance',
    message: 'Scheduled maintenance tomorrow at 2:00 AM',
    time: '1 day ago',
    action: 'Details',
  },
]

const typeIcons = {
  warning: AlertTriangle,
  info: Info,
  success: CheckCircle,
  urgent: Clock,
}

const typeColors = {
  warning: 'bg-yellow-100 text-yellow-800',
  info: 'bg-blue-100 text-blue-800',
  success: 'bg-green-100 text-green-800',
  urgent: 'bg-red-100 text-red-800',
}

export function Notifications() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Bell className="mr-2 h-5 w-5" />
          Notifications
        </CardTitle>
        <CardDescription>Important updates and alerts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {notifications.map((notification) => {
          const Icon = typeIcons[notification.type as keyof typeof typeIcons]

          return (
            <div key={notification.id} className="flex items-start space-x-3 p-3 rounded-lg border">
              <div className="flex-shrink-0">
                <Icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{notification.title}</p>
                  <Badge
                    variant="secondary"
                    className={typeColors[notification.type as keyof typeof typeColors]}
                  >
                    {notification.type}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{notification.message}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground">{notification.time}</span>
                  {notification.action && (
                    <Button variant="ghost" size="sm" className="h-auto p-0 text-xs">
                      {notification.action}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
