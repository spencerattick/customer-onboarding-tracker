"use client";

import { Account } from "@/lib/types";
import { Pencil } from "lucide-react";
import { useState } from "react";

export default function InfoHeader({
  selectedAccount,
}: {
  selectedAccount: Account;
}) {
  const [teamId, setTeamId] = useState<string | null>(null);
  const [linkedNotionDoc, setLinkedNotionDoc] = useState<string | null>(null);
  const [generalNotes, setGeneralNotes] = useState<string | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  const accountInfo = [teamId, linkedNotionDoc, generalNotes];
  const setters = [setTeamId, setLinkedNotionDoc, setGeneralNotes];
  const labels = ["Team ID", "Linked Notion Doc", "General Notes"];

  const handleEditStart = (index: number) => {
    setEditingIndex(index);
    setEditValue(accountInfo[index] || "");
  };

  const handleEditSave = (index: number) => {
    setters[index](editValue);
    setEditingIndex(null);
    setEditValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter") {
      handleEditSave(index);
    } else if (e.key === "Escape") {
      setEditingIndex(null);
    }
  };

  return (
    <div className="border-b mb-10">
      <h1 className="text-center text-4xl font-bold mb-5">
        {selectedAccount.name}
      </h1>

      <div className="w-full flex justify-center items-center gap-8">
        {accountInfo.map((info, index) => (
          <div key={index} className="flex items-center">
            {editingIndex === index ? (
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onBlur={() => handleEditSave(index)}
                autoFocus
                className="border rounded px-2 py-1 text-sm"
              />
            ) : (
              <>
                <span>
                  {labels[index]}: {info || "Not set"}
                </span>
                <Pencil
                  className="h-2 w-2 ml-1 cursor-pointer"
                  onClick={() => handleEditStart(index)}
                />
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}