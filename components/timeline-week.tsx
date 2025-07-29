"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Target, CheckCircle2 } from "lucide-react"
import Link from "next/link"

interface TimelineWeekProps {
  week: number
  totalGoals: number
  completedGoals: number
  startDate: Date | null
  accountId: string
}

export function TimelineWeek({ week, totalGoals, completedGoals, startDate, accountId }: TimelineWeekProps) {
  const progress = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0

  const getWeekStatus = () => {
    if (!startDate) return "upcoming"

    const now = new Date()
    const weekStart = new Date(startDate)
    weekStart.setDate(weekStart.getDate() + (week - 1) * 7)

    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 6)

    if (now < weekStart) return "upcoming"
    if (now > weekEnd) return "past"
    return "current"
  }

  const status = getWeekStatus()

  const getStatusColor = () => {
    switch (status) {
      case "current":
        return "bg-blue-500"
      case "past":
        return "bg-green-500"
      case "upcoming":
        return "bg-gray-300"
      default:
        return "bg-gray-300"
    }
  }

  const getWeekDateRange = () => {
    if (!startDate) return null

    const weekStart = new Date(startDate)
    weekStart.setDate(weekStart.getDate() + (week - 1) * 7)

    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 6)

    return {
      start: weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      end: weekEnd.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    }
  }

  const dateRange = getWeekDateRange()

  return (
    <Link href={`/week/${week}?account=${accountId}`} className="block">
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Week {week}</CardTitle>
            <div className={`w-3 h-3 rounded-full ${getStatusColor()}`} />
          </div>
          {dateRange && (
            <p className="text-sm text-muted-foreground">
              {dateRange.start} - {dateRange.end}
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{totalGoals} goals</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{completedGoals} done</span>
            </div>
          </div>

          {totalGoals > 0 && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <div className="text-xs text-muted-foreground text-center">{Math.round(progress)}% complete</div>
            </div>
          )}

          <div className="flex justify-center">
            <Badge variant={status === "current" ? "default" : "secondary"}>
              {status === "current" ? "Active" : status === "past" ? "Completed" : "Upcoming"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
