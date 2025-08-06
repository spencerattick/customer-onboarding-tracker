// stores/account-store.ts
import { create } from "zustand";
import { Account } from "@/lib/types";
import {
  addAccountToDb,
  deleteAccountFromDb,
  getAccountById,
  getAllAccounts,
  setStartDateForAccount,
} from "@/lib/server-actions";

interface AccountState {
  accounts: Account[];
  selectedAccount: Account | null;
  showAddDialog: boolean;
  showManageDialog: boolean;
  newAccountName: string;
  startDate: Date | null;
  loadAccounts: () => Promise<void>;
  setSelectedAccount: (account: Account | null) => void;
  setShowAddDialog: (show: boolean) => void;
  setShowManageDialog: (show: boolean) => void;
  setNewAccountName: (name: string) => void;
  handleAddAccount: () => Promise<void>;
  handleDeleteAccount: (accountId: string) => Promise<void>;
  handleAccountSelect: (accountId: string) => Promise<void>;
  addStartDateToAccount: (
    accountId: string,
    startDate: Date | null
  ) => Promise<void>;
  setStartDate: (date: Date | null) => void;
}

export const useAccountStore = create<AccountState>((set, get) => ({
  accounts: [],
  selectedAccount: null,
  showAddDialog: false,
  showManageDialog: false,
  newAccountName: "",

  // Load all accounts from DB
  loadAccounts: async () => {
    const savedAccounts = await getAllAccounts();
    if (savedAccounts) {
      set({ accounts: savedAccounts });

      // Auto-select first account if none selected
      if (!get().selectedAccount && savedAccounts.length > 0) {
        set({ selectedAccount: savedAccounts[0] });
      }
    }
  },

  // Setters
  setSelectedAccount: (account) => set({ selectedAccount: account }),
  setShowAddDialog: (show) => set({ showAddDialog: show }),
  setShowManageDialog: (show) => set({ showManageDialog: show }),
  setNewAccountName: (name) => set({ newAccountName: name }),

  // Add new account
  handleAddAccount: async () => {
    const { newAccountName, accounts } = get();
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

      set({
        accounts: updatedAccounts,
        selectedAccount: updatedAccounts[updatedAccounts.length - 1],
        newAccountName: "",
        showAddDialog: false,
      });
    } catch (error) {
      console.error("Error creating account:", error);
    }
  },

  // Delete account
  handleDeleteAccount: async (accountId) => {
    try {
      await deleteAccountFromDb(accountId);
      const updatedAccounts = await getAllAccounts();
      const { selectedAccount } = get();

      set({
        accounts: updatedAccounts,
        selectedAccount:
          selectedAccount?.id === accountId
            ? updatedAccounts[0] || null
            : selectedAccount,
        showManageDialog: false,
      });
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  },

  // Select account
  handleAccountSelect: async (accountId) => {
    const account = accountId ? await getAccountById(accountId) : null;
    set({ selectedAccount: account });
  },

  // Add account startDate to db
  addStartDateToAccount: async (accountId: string, startDate: Date) => {
    try {
      await setStartDateForAccount(accountId, startDate);
    } catch (error) {
      console.error("Error updating account with start date:", error);
      throw error;
    }
  },
  setStartDate: (date) => set({ startDate: date }),
}));
