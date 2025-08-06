"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useAccountStore } from "@/app/stores/store";

export function StartDatePicker({ selectedAccount }) {
  const [open, setOpen] = useState(false);
  const [localDate, setLocalDate] = useState(selectedAccount.startDate || null);
  const { addStartDateToAccount } = useAccountStore();

  // Sync local date when selected account changes
  useEffect(() => {
    setLocalDate(selectedAccount.startDate || null);
  }, [selectedAccount.id, selectedAccount.startDate]);

  const handleDateSelect = (date: Date | undefined) => {
    const newDate = date || null;
    setLocalDate(newDate);
    setOpen(false);
    addStartDateToAccount(selectedAccount.id, newDate);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="justify-start text-left font-normal bg-transparent"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {localDate
            ? format(localDate, "PPP") 
            : "Set start date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
          mode="single"
          selected={localDate || undefined}
          onSelect={handleDateSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}