import { Prisma, User } from "@/lib/generated/prisma";
import { db } from "../db";

type CreateUserPayload = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

class UserService {
  async createUser(user: CreateUserPayload) {
    try {
      return await db.user.create({
        data: user,
      });
    } catch (error) {
      console.log({ error });
    }
  }
}

export const userService = new UserService();
