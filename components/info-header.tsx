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
  
  // State for Team ID editing
  const [isEditingTeamId, setIsEditingTeamId] = useState(false);
  const [teamIdInput, setTeamIdInput] = useState("");

  // State for Notion Doc editing
  const [isEditingNotionDoc, setIsEditingNotionDoc] = useState(false);
  const [notionDocInput, setNotionDocInput] = useState("");

  const handleTeamIdEdit = () => {
    setIsEditingTeamId(true);
    setTeamIdInput(teamId || "");
  };

  const handleTeamIdSave = () => {
    setTeamId(teamIdInput);
    setIsEditingTeamId(false);
  };

  const handleNotionDocEdit = () => {
    setIsEditingNotionDoc(true);
    setNotionDocInput(linkedNotionDoc || "");
  };

  const handleNotionDocSave = () => {
    setLinkedNotionDoc(notionDocInput);
    setIsEditingNotionDoc(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent, field: 'teamId' | 'notionDoc') => {
    if (e.key === "Enter") {
      field === 'teamId' ? handleTeamIdSave() : handleNotionDocSave();
    } else if (e.key === "Escape") {
      field === 'teamId' ? setIsEditingTeamId(false) : setIsEditingNotionDoc(false);
    }
  };

  return (
    <div className="border-b mb-10">
      <h1 className="text-center text-4xl font-bold mb-5">
        {selectedAccount.name}
      </h1>

      <div className="w-full flex justify-center items-center gap-8">
        {/* Team ID Field */}
        <div className="flex items-center">
          {isEditingTeamId ? (
            <input
              type="text"
              value={teamIdInput}
              onChange={(e) => setTeamIdInput(e.target.value)}
              onBlur={handleTeamIdSave}
              onKeyDown={(e) => handleKeyDown(e, 'teamId')}
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
        
        {/* Linked Notion Doc Field */}
        <div className="flex items-center">
          {isEditingNotionDoc ? (
            <input
              type="url"
              value={notionDocInput}
              onChange={(e) => setNotionDocInput(e.target.value)}
              onBlur={handleNotionDocSave}
              onKeyDown={(e) => handleKeyDown(e, 'notionDoc')}
              autoFocus
              className="border rounded px-2 py-1 text-sm"
              placeholder="https://notion.so/..."
            />
          ) : linkedNotionDoc ? (
            <>
              <Link href={linkedNotionDoc} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                Linked Notion Doc
              </Link>
              <Pencil
                className="h-3 w-3 ml-1 cursor-pointer"
                onClick={handleNotionDocEdit}
              />
            </>
          ) : (
            <>
              <p>Linked Notion Doc: Not set</p>
              <Pencil
                className="h-3 w-3 ml-1 cursor-pointer"
                onClick={handleNotionDocEdit}
              />
            </>
          )}
        </div>
        
        {/* Notes Field */}
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