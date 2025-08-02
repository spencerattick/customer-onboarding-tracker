"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Settings, Trash2, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Account } from "@/lib/types";
import { addAccountToDb, getAllAccounts } from "@/lib/server-actions";

interface AccountSelectorProps {
  selectedAccount: Account | null;
  onAccountChange: (account: Account | null) => void;
}

export function AccountSelector({
  selectedAccount,
  onAccountChange,
}: AccountSelectorProps) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showManageDialog, setShowManageDialog] = useState(false);
  const [newAccountName, setNewAccountName] = useState("");

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    // const savedAccounts = localStorage.getItem("timeline-accounts");
    const savedAccounts = await getAllAccounts()
    console.log("Saved accounts:", savedAccounts);
    if (savedAccounts) {
      setAccounts(savedAccounts);

      // If no account is selected but accounts exist, select the first one
      if (!selectedAccount && savedAccounts.length > 0) {
        onAccountChange(savedAccounts[0]);
      }
    }
  };

  // const saveAccounts = (updatedAccounts: Account[]) => {
  //   localStorage.setItem("timeline-accounts", JSON.stringify(updatedAccounts));
  //   console.log("Accounts saved:", updatedAccounts);
  //   setAccounts(updatedAccounts);
  // };

  const handleAddAccount = async () => {
    if (!newAccountName.trim()) return;
  
    try {
      const newAccount = await addAccountToDb(newAccountName.trim());
      
      const updatedAccounts = [
        ...accounts,
        {
          ...newAccount,
          createdAt: newAccount.createdAt.toISOString(),
        },
      ];
      saveAccounts(updatedAccounts);
      onAccountChange({
        ...newAccount,
        createdAt: newAccount.createdAt.toISOString(),
      });
      setNewAccountName("");
      setShowAddDialog(false);
    } catch (error) {
      console.error("Error creating account:", error);
    }
  };

  const handleDeleteAccount = (accountId: string) => {
    const updatedAccounts = accounts.filter(
      (account) => account.id !== accountId
    );
    saveAccounts(updatedAccounts);

    // Clear account-specific data
    localStorage.removeItem(`timeline-goals-${accountId}`);
    localStorage.removeItem(`timeline-start-date-${accountId}`);

    // If the deleted account was selected, select another one or null
    if (selectedAccount?.id === accountId) {
      const newSelectedAccount =
        updatedAccounts.length > 0 ? updatedAccounts[0] : null;
      onAccountChange(newSelectedAccount);
      console.log('NEW SELECTED ACCOUNT:', newSelectedAccount);
    }
  };

  const handleAccountSelect = (accountId: string) => {
    const account = accounts.find((acc) => acc.id === accountId);
    console.log('SELECTED ACCOUNT DROPDOWN:', account);
    onAccountChange(account || null);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2">
        <Building2 className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Account:</span>
      </div>

      <Select
        value={selectedAccount?.id || ""}
        onValueChange={handleAccountSelect}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select account..." />
        </SelectTrigger>
        <SelectContent>
          {accounts.map((account) => (
            <SelectItem key={account.id} value={account.id}>
              {account.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Account</DialogTitle>
            <DialogDescription>
              Create a new account to track progress separately.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="account-name">Account Name</Label>
              <Input
                id="account-name"
                value={newAccountName}
                onChange={(e) => setNewAccountName(e.target.value)}
                placeholder="Enter account name..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddAccount();
                  }
                }}
                autoFocus
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddAccount} className="flex-1">
                Add Account
              </Button>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {accounts.length > 0 && (
        <Dialog open={showManageDialog} onOpenChange={setShowManageDialog}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <Settings className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Manage Accounts</DialogTitle>
              <DialogDescription>
                View and delete existing accounts. Deleting an account will
                remove all its data.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {accounts.map((account) => (
                <Card key={account.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <h4 className="font-medium">{account.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Created{" "}
                        {new Date(account.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteAccount(account.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
