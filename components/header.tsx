import { Account } from "@/lib/types";
import { AccountSelector } from "./account-selector";
import { ProgressBar } from "./progress-bar";

type HeaderProps = {
  selectedAccount: Account | null;
  setSelectedAccount: (account: Account | null) => void;
  startDate: Date | null;
};

export default function Header({selectedAccount, setSelectedAccount, startDate}: HeaderProps) {
  return (
    <div className="bg-background/95 border-b mb-10 ">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <AccountSelector
            selectedAccount={selectedAccount}
            onAccountChange={setSelectedAccount}
          />
          {selectedAccount && <ProgressBar startDate={startDate} />}
        </div>
      </div>
    </div>
  );
}
