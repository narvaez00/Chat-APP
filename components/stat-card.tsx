import { ArrowDown, ArrowUp } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StatCardProps {
  title: string
  value: string
  description: string
  trend: "up" | "down"
}

export function StatCard({ title, value, description, trend }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 rounded-full bg-muted" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
          {trend === "up" ? (
            <ArrowUp className="h-3 w-3 text-emerald-500" />
          ) : (
            <ArrowDown className="h-3 w-3 text-rose-500" />
          )}
          <span className={trend === "up" ? "text-emerald-500" : "text-rose-500"}>{description}</span>
        </p>
      </CardContent>
    </Card>
  )
}

