import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Bell, Check, X } from 'lucide-react'

const notifications = [
  {
    id: 1,
    title: "New User Registration",
    description: "A new user has registered to the platform",
    time: "5 minutes ago",
    unread: true,
  },
  {
    id: 2,
    title: "System Update",
    description: "System maintenance scheduled for tonight",
    time: "1 hour ago",
    unread: false,
  },
]

export function NotificationList() {
  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <Card key={notification.id} className={notification.unread ? "border-primary" : ""}>
          <CardHeader className="flex flex-row items-center gap-4">
            <Bell className="h-5 w-5" />
            <div className="flex-1">
              <CardTitle className="text-base">{notification.title}</CardTitle>
              <CardDescription>{notification.time}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button size="icon" variant="ghost">
                <Check className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {notification.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 