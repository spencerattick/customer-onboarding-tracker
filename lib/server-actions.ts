"use server";

import prisma from "./db";

export const getAllAccounts = async () => {
    try {
        return await prisma.account.findMany();
    } catch (error) {
        console.error("Error fetching accounts:", error);
        throw error;
    }
}

export const addAccountToDb = async (accountName: string) => {
    try {
       return await prisma.account.create({
          data: {
            name: accountName,
          },
        });
      } catch (error) {
        console.error("Error creating new account:", error);
        throw error;
      }
}

export const setTeamIdForAccount = async (accountId: string, teamId: string) => {
    try {
        return await prisma.account.update({
            where: { id: accountId },
            data: { teamId },
        });
    } catch (error) {
        console.error("Error updating account with team ID:", error);
        throw error;
    }
}
