import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Users, DollarSign, ShoppingCart, Activity } from 'lucide-react'
import { formatNumber } from '@/lib/utils'

const stats = [
  {
    title: "Total Users",
    value: 2543,
    change: "+180.1%",
    icon: Users
  },
  {
    title: "Revenue",
    value: 45231,
    change: "+10.3%",
    icon: DollarSign,
    prefix: "$"
  },
  {
    title: "Orders",
    value: 1345,
    change: "+12.5%",
    icon: ShoppingCart
  },
  {
    title: "Active Users",
    value: 573,
    change: "+4.5%",
    icon: Activity
  }
]

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stat.prefix}{formatNumber(stat.value)}
            </div>
            <p className="text-xs text-muted-foreground">
              {stat.change} from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 