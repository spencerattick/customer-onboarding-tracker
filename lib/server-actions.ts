"use server";

import prisma from "./db";

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
