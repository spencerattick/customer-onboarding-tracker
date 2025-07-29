"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, Calendar } from "lucide-react"

interface Goal {
  id: string
  week: number
  title: string
  description: string
  completed: boolean
  createdAt: string
}

interface GoalCardProps {
  goal: Goal
  onToggleComplete: (goalId: string) => void
  onEdit: (goal: Goal) => void
  onDelete: (goalId: string) => void
}

export function GoalCard({ goal, onToggleComplete, onEdit, onDelete }: GoalCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card className={`transition-all ${goal.completed ? "bg-muted/50" : ""}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox checked={goal.completed} onCheckedChange={() => onToggleComplete(goal.id)} className="mt-1" />

          <div className="flex-1 min-w-0">
            <h3 className={`font-medium ${goal.completed ? "line-through text-muted-foreground" : ""}`}>
              {goal.title}
            </h3>
            {goal.description && (
              <p
                className={`text-sm mt-1 ${goal.completed ? "line-through text-muted-foreground" : "text-muted-foreground"}`}
              >
                {goal.description}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>Created {formatDate(goal.createdAt)}</span>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(goal)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(goal.id)} className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  )
}
