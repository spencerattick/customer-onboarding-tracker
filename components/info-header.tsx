"use client";

import { Account } from "@/lib/types";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import AccountNotes from "./account-notes";

export default function InfoHeader({
  selectedAccount,
}: {
  selectedAccount: Account;
}) {
  const [teamId, setTeamId] = useState<string | null>(null);
  const [linkedNotionDoc, setLinkedNotionDoc] = useState<string | null>(null);
  const [generalNotes, setGeneralNotes] = useState<String[] | []>([]);
  
  // State for editing
  const [isEditingTeamId, setIsEditingTeamId] = useState(false);
  const [teamIdInput, setTeamIdInput] = useState("");

  const handleTeamIdEdit = () => {
    setIsEditingTeamId(true);
    setTeamIdInput(teamId || "");
  };

  const handleTeamIdSave = () => {
    setTeamId(teamIdInput);
    setIsEditingTeamId(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleTeamIdSave();
    } else if (e.key === "Escape") {
      setIsEditingTeamId(false);
    }
  };

  return (
    <div className="border-b mb-10">
      <h1 className="text-center text-4xl font-bold mb-5">
        {selectedAccount.name}
      </h1>

      <div className="w-full flex justify-center items-center gap-8">
        <div className="flex items-center">
          {isEditingTeamId ? (
            <input
              type="text"
              value={teamIdInput}
              onChange={(e) => setTeamIdInput(e.target.value)}
              onBlur={handleTeamIdSave}
              onKeyDown={handleKeyDown}
              autoFocus
              className="border rounded px-2 py-1 text-sm"
            />
          ) : (
            <>
              <p>TeamId: {teamId || "Not set"}</p>
              <Pencil
                className="h-3 w-3 ml-1 cursor-pointer"
                onClick={handleTeamIdEdit}
              />
            </>
          )}
        </div>
        
        <div>
          {linkedNotionDoc ? (
            <Link href={linkedNotionDoc}>Linked Notion Doc</Link>
          ) : (
            <p>Linked Notion Doc: Not set</p>
          )}
          <Pencil
            className="h-3 w-3 mr-1 cursor-pointer"
            onClick={() => {
              console.log(`clicked`);
            }}
          />
        </div>
        
        <div>
          {generalNotes ? <p>Notes: Not set</p> : <AccountNotes />}
          <Pencil
            className="h-3 w-3 mr-1 cursor-pointer"
            onClick={() => {
              console.log(`clicked`);
            }}
          />
        </div>
      </div>
    </div>
  );
}