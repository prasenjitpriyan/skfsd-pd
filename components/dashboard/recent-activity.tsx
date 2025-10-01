import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDistanceToNow } from "date-fns"

const activities = [
  {
    id: 1,
    user: { name: 'John Doe', avatar: '', initials: 'JD' },
    action: 'submitted daily metrics',
    target: 'South Kolkata GPO',
    time: new Date(Date.now() - 1000 * 60 * 30),
    type: 'metrics',
  },
  {
    id: 2,
    user: { name: 'Jane Smith', avatar: '', initials: 'JS' },
    action: 'created DRM entry',
    target: 'Monthly Revenue Report',
    time: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    type: 'drm',
  },
  {
    id: 3,
    user: { name: 'Admin User', avatar: '', initials: 'AU' },
    action: 'approved DRM entry',
    target: 'September Revenue Report',
    time: new Date(Date.now() - 1000 * 60 * 60 * 4),
    type: 'approval',
  },
  {
    id: 4,
    user: { name: 'Mike Johnson', avatar: '', initials: 'MJ' },
    action: 'updated office targets',
    target: 'Ballygunge SO',
    time: new Date(Date.now() - 1000 * 60 * 60 * 6),
    type: 'target',
  },
]

const typeColors = {
  metrics: 'bg-blue-100 text-blue-800',
  drm: 'bg-green-100 text-green-800',
  approval: 'bg-purple-100 text-purple-800',
  target: 'bg-orange-100 text-orange-800',
}

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
        <CardDescription>Latest actions across the system</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={activity.user.avatar} />
              <AvatarFallback className="text-xs">
                {activity.user.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm">
                  <span className="font-medium">{activity.user.name}</span>
                  {' '}
                  <span className="text-muted-foreground">{activity.action}</span>
                </p>
                <Badge
                  variant="secondary"
                  className={typeColors[activity.type as keyof typeof typeColors]}
                >
                  {activity.type}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{activity.target}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(activity.time, { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
