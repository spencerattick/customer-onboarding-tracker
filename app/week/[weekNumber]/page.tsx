"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Plus, Target, CheckCircle2, Circle } from "lucide-react"
import Link from "next/link"
import { ProgressBar } from "@/components/progress-bar"
import { GoalForm } from "@/components/goal-form"
import { GoalCard } from "@/components/goal-card"
import { AccountSelector } from "@/components/account-selector"
import { Account } from "@/lib/types"
import Header from "@/components/header"

interface Goal {
  id: string
  week: number
  title: string
  description: string
  completed: boolean
  createdAt: string
}

export default function WeekPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const weekNumber = Number.parseInt(params.weekNumber as string)
  const accountIdFromUrl = searchParams.get("account")

  const [goals, setGoals] = useState<Goal[]>([])
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)
  const [showGoalForm, setShowGoalForm] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)

  useEffect(() => {
    // Validate week number
    if (weekNumber < 1 || weekNumber > 8) {
      router.push("/")
      return
    }

    // Load accounts and set selected account
    const savedAccounts = localStorage.getItem("timeline-accounts")
    if (savedAccounts) {
      const accounts = JSON.parse(savedAccounts)
      let accountToSelect = null

      if (accountIdFromUrl) {
        accountToSelect = accounts.find((acc: Account) => acc.id === accountIdFromUrl)
      }

      if (!accountToSelect && accounts.length > 0) {
        accountToSelect = accounts[0]
      }

      if (accountToSelect) {
        setSelectedAccount(accountToSelect)
        loadAccountData(accountToSelect.id)
      } else {
        router.push("/")
      }
    } else {
      router.push("/")
    }
  }, [weekNumber, router, accountIdFromUrl])

  const loadAccountData = (accountId: string) => {
    // Load goals for this account
    const savedGoals = localStorage.getItem(`timeline-goals-${accountId}`)
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals))
    } else {
      setGoals([])
    }

    // Load start date for this account
    const savedStartDate = localStorage.getItem(`timeline-start-date-${accountId}`)
    if (savedStartDate) {
      setStartDate(new Date(savedStartDate))
    } else {
      setStartDate(null)
    }
  }

  const handleAccountChange = (account: Account | null) => {
    if (account) {
      setSelectedAccount(account)
      loadAccountData(account.id)
      // Update URL with new account
      router.push(`/week/${weekNumber}?account=${account.id}`)
    } else {
      router.push("/")
    }
  }

  const weekGoals = goals.filter((goal) => goal.week === weekNumber)
  const completedGoals = weekGoals.filter((goal) => goal.completed)

  const handleSaveGoal = (goalData: Omit<Goal, "id" | "createdAt">) => {
    if (!selectedAccount) return

    const updatedGoals = [...goals]

    if (editingGoal) {
      // Update existing goal
      const index = updatedGoals.findIndex((g) => g.id === editingGoal.id)
      if (index !== -1) {
        updatedGoals[index] = {
          ...editingGoal,
          ...goalData,
        }
      }
    } else {
      // Add new goal
      const newGoal: Goal = {
        ...goalData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      }
      updatedGoals.push(newGoal)
    }

    setGoals(updatedGoals)
    localStorage.setItem(`timeline-goals-${selectedAccount.id}`, JSON.stringify(updatedGoals))
    setShowGoalForm(false)
    setEditingGoal(null)
  }

  const handleDeleteGoal = (goalId: string) => {
    if (!selectedAccount) return

    const updatedGoals = goals.filter((goal) => goal.id !== goalId)
    setGoals(updatedGoals)
    localStorage.setItem(`timeline-goals-${selectedAccount.id}`, JSON.stringify(updatedGoals))
  }

  const handleToggleComplete = (goalId: string) => {
    if (!selectedAccount) return

    const updatedGoals = goals.map((goal) => (goal.id === goalId ? { ...goal, completed: !goal.completed } : goal))
    setGoals(updatedGoals)
    localStorage.setItem(`timeline-goals-${selectedAccount.id}`, JSON.stringify(updatedGoals))
  }

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal)
    setShowGoalForm(true)
  }

  const getWeekDateRange = () => {
    if (!startDate) return null

    const weekStart = new Date(startDate)
    weekStart.setDate(weekStart.getDate() + (weekNumber - 1) * 7)

    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 6)

    return {
      start: weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      end: weekEnd.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    }
  }

  const dateRange = getWeekDateRange()

  if (!selectedAccount) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border border-red-600">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <AccountSelector selectedAccount={selectedAccount} onAccountChange={handleAccountChange} />
            {selectedAccount && <ProgressBar startDate={startDate} />}
          </div>
        </div>
      </div>

      {/* <Header selectedAccount={selectedAccount} startDate={startDate} handleAccountChange={handleAccountChange}/> */}

      {/* Main Content */}
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  {selectedAccount.name} - Week {weekNumber}
                </h1>
                {dateRange && (
                  <p className="text-muted-foreground mt-1">
                    {dateRange.start} - {dateRange.end}
                  </p>
                )}
              </div>
              <Button onClick={() => setShowGoalForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Goal
              </Button>
            </div>
          </div>

          {/* Week Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Goals</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{weekGoals.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedGoals.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Progress</CardTitle>
                <Circle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {weekGoals.length > 0 ? Math.round((completedGoals.length / weekGoals.length) * 100) : 0}%
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Goals List */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Goals for Week {weekNumber}</h2>

            {weekGoals.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Target className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No goals yet</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Start by adding the first goal for {selectedAccount.name} in week {weekNumber}
                  </p>
                  <Button onClick={() => setShowGoalForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Goal
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {weekGoals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    onToggleComplete={handleToggleComplete}
                    onEdit={handleEditGoal}
                    onDelete={handleDeleteGoal}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Goal Form Modal */}
          {showGoalForm && (
            <GoalForm
              week={weekNumber}
              goal={editingGoal}
              onSave={handleSaveGoal}
              onCancel={() => {
                setShowGoalForm(false)
                setEditingGoal(null)
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
