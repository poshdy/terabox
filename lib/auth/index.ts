import { auth } from "@clerk/nextjs/server";

export const isAuthenticated = async () => {
  try {
    const { isAuthenticated } = await auth();
    return isAuthenticated;
  } catch (error) {
    console.log({ error });
  }
};
