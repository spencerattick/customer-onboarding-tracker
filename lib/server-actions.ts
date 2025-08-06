"use server";

import { revalidatePath } from "next/cache";
import prisma from "./db";

export const getAllAccounts = async () => {
  try {
    return await prisma.account.findMany();
  } catch (error) {
    console.error("Error fetching accounts:", error);
    throw error;
  }
};

export const getAccountById = async (accountId: string) => {
  try {
    return await prisma.account.findUnique({
      where: { id: accountId },
    });
  } catch (error) {
    console.error("Error fetching account by ID:", error);
    throw error;
  }
};

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
};

export const deleteAccountFromDb = async (accountId: string) => {
  try {
    await prisma.account.delete({
      where: { id: accountId },
    });
    // revalidatePath("/");
  } catch (error) {
    console.error("Error deleting account:", error);
    throw error;
  }
};

export const setTeamIdForAccount = async (
  accountId: string,
  teamId: string
) => {
  try {
    return await prisma.account.update({
      where: { id: accountId },
      data: { teamId },
    });
  } catch (error) {
    console.error("Error updating account with team ID:", error);
    throw error;
  }
};

export const setStartDateForAccount = async (accountId: string, startDate: Date) => {
  try {
    return await prisma.account.update({
      where: { id: accountId },
      data: { startDate },
    });

  } catch (error) {
    console.error("Error setting start date for account:", error);
    throw error;
  }
}
