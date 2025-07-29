"use client"

import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"
import { Calendar, Clock } from "lucide-react"

interface ProgressBarProps {
  startDate: Date | null
}

export function ProgressBar({ startDate }: ProgressBarProps) {
  const [progress, setProgress] = useState(0)
  const [currentWeek, setCurrentWeek] = useState(1)
  const [daysRemaining, setDaysRemaining] = useState(0)

  useEffect(() => {
    if (!startDate) {
      setProgress(0)
      setCurrentWeek(1)
      setDaysRemaining(56) // 8 weeks = 56 days
      return
    }

    const now = new Date()
    const start = new Date(startDate)
    const totalDuration = 8 * 7 * 24 * 60 * 60 * 1000 // 8 weeks in milliseconds
    const elapsed = now.getTime() - start.getTime()

    // Calculate progress percentage (0-100)
    const progressPercentage = Math.max(0, Math.min(100, (elapsed / totalDuration) * 100))

    // Calculate current week (1-8)
    const week = Math.max(1, Math.min(8, Math.floor(elapsed / (7 * 24 * 60 * 60 * 1000)) + 1))

    // Calculate days remaining
    const endDate = new Date(start.getTime() + totalDuration)
    const remaining = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)))

    setProgress(progressPercentage)
    setCurrentWeek(week)
    setDaysRemaining(remaining)
  }, [startDate])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getEndDate = () => {
    if (!startDate) return null
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 56) // 8 weeks
    return endDate
  }

  const endDate = getEndDate()

  return (
    <div className="w-full space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Week {currentWeek} of 8</span>
          </div>
          {startDate && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {daysRemaining > 0 ? `${daysRemaining} days remaining` : "Journey complete!"}
              </span>
            </div>
          )}
        </div>

        {startDate && endDate && (
          <div className="text-xs text-muted-foreground">
            {formatDate(startDate)} → {formatDate(endDate)}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Start</span>
          <span>{Math.round(progress)}% Complete</span>
          <span>End</span>
        </div>
      </div>

      {!startDate && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Set your start date to begin tracking progress</p>
        </div>
      )}
    </div>
  )
}
