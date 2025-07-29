"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, Target, TrendingUp, Building2 } from "lucide-react";
import Link from "next/link";
import { ProgressBar } from "@/components/progress-bar";
import { StartDatePicker } from "@/components/start-date-picker";
import { TimelineWeek } from "@/components/timeline-week";
import { AccountSelector } from "@/components/account-selector";
import Header from "@/components/header";

interface Goal {
  id: string;
  week: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
}

interface Account {
  id: string;
  name: string;
  createdAt: string;
}

export default function Dashboard() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  useEffect(() => {
    if (selectedAccount) {
      loadAccountData(selectedAccount.id);
    } else {
      // Clear data when no account is selected
      setGoals([]);
      setStartDate(null);
    }
  }, [selectedAccount]);

  const loadAccountData = (accountId: string) => {
    // Load goals for this account
    const savedGoals = localStorage.getItem(`timeline-goals-${accountId}`);
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    } else {
      setGoals([]);
    }

    // Load start date for this account
    const savedStartDate = localStorage.getItem(
      `timeline-start-date-${accountId}`
    );
    if (savedStartDate) {
      setStartDate(new Date(savedStartDate));
    } else {
      setStartDate(null);
    }
  };

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
    if (selectedAccount && date) {
      localStorage.setItem(
        `timeline-start-date-${selectedAccount.id}`,
        date.toISOString()
      );
    }
  };

  const getWeekGoals = (week: number) => {
    return goals.filter((goal) => goal.week === week);
  };

  const getCompletedGoalsCount = (week: number) => {
    return getWeekGoals(week).filter((goal) => goal.completed).length;
  };

  const getTotalGoalsCount = (week: number) => {
    return getWeekGoals(week).length;
  };

  const weeks = Array.from({ length: 8 }, (_, i) => i + 1);

  if (!selectedAccount) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <Building2 className="h-16 w-16 mx-auto text-muted-foreground" />
              <h1 className="text-3xl font-bold tracking-tight">
                Account Management Dashboard
              </h1>
              <p className="text-muted-foreground text-lg">
                Select or create an account to start tracking 8-week progress
                timelines
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Get Started</CardTitle>
                <CardDescription>
                  Create your first account to begin managing progress timelines
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AccountSelector
                  selectedAccount={selectedAccount}
                  onAccountChange={setSelectedAccount}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Progress Bar */}
      <Header
        selectedAccount={selectedAccount}
        setSelectedAccount={setSelectedAccount}
        startDate={startDate}
      />

      {/* Main Content */}
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  {selectedAccount
                    ? `${selectedAccount.name} - 8-Week Timeline`
                    : "8-Week Timeline Dashboard"}
                </h1>
                <p className="text-muted-foreground mt-2">
                  Track progress through an 8-week journey of goal achievement
                </p>
              </div>
              {selectedAccount && (
                <StartDatePicker
                  startDate={startDate}
                  onStartDateChange={handleStartDateChange}
                />
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Goals
                </CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{goals.length}</div>
                <p className="text-xs text-muted-foreground">
                  Across all weeks
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Completed Goals
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {goals.filter((goal) => goal.completed).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {goals.length > 0
                    ? Math.round(
                        (goals.filter((goal) => goal.completed).length /
                          goals.length) *
                          100
                      )
                    : 0}
                  % completion rate
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Week
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  Week{" "}
                  {startDate
                    ? Math.min(
                        8,
                        Math.max(
                          1,
                          Math.floor(
                            (Date.now() - startDate.getTime()) /
                              (7 * 24 * 60 * 60 * 1000)
                          ) + 1
                        )
                      )
                    : "-"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Current focus period
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Timeline */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Timeline Overview</h2>
              <p className="text-sm text-muted-foreground">
                Click on any week to manage goals
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {weeks.map((week) => (
                <TimelineWeek
                  key={week}
                  week={week}
                  totalGoals={getTotalGoalsCount(week)}
                  completedGoals={getCompletedGoalsCount(week)}
                  startDate={startDate}
                  accountId={selectedAccount.id}
                />
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-12">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Get started with {selectedAccount.name}'s 8-week journey
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col sm:flex-row gap-4">
                {!startDate && (
                  <div className="flex-1 p-4 border border-dashed rounded-lg">
                    <h3 className="font-medium mb-2">Set Start Date</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Choose when {selectedAccount.name}'s 8-week journey begins
                      to track progress accurately.
                    </p>
                    <StartDatePicker
                      startDate={startDate}
                      onStartDateChange={handleStartDateChange}
                    />
                  </div>
                )}
                <div className="flex-1 p-4 border border-dashed rounded-lg">
                  <h3 className="font-medium mb-2">Add First Goal</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Start by adding a goal to any week in {selectedAccount.name}
                    's timeline.
                  </p>
                  <Button asChild>
                    <Link href={`/week/1?account=${selectedAccount.id}`}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Goal to Week 1
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
