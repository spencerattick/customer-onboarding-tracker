import { Account } from "@/lib/types";

export default function InfoHeader({
  selectedAccount,
}: {
  selectedAccount: Account;
}) {
  return (
    <div className="bg-background/95 border-b mb-10">
      <h1 className="text-center text-4xl font-bold mb-5">{selectedAccount.name}</h1>
    </div>
  );
}
