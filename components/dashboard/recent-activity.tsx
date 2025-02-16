import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'

const activities = [
  {
    id: 1,
    user: "John Doe",
    action: "created a new post",
    date: new Date('2024-03-10'),
  },
  {
    id: 2,
    user: "Jane Smith",
    action: "updated their profile",
    date: new Date('2024-03-09'),
  },
  {
    id: 3,
    user: "Mike Johnson",
    action: "deleted a comment",
    date: new Date('2024-03-08'),
  },
]

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {activity.user}
                </p>
                <p className="text-sm text-muted-foreground">
                  {activity.action}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(activity.date)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 