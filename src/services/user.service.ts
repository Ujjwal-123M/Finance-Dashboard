import bcrypt from "bcryptjs";
import { type Prisma, Role, UserStatus } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { ApiError } from "../utils/api-error";

interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role: Role;
  status?: UserStatus;
}

interface UpdateUserInput {
  name?: string;
  password?: string;
  role?: Role;
  status?: UserStatus;
}

function publicUserSelect() {
  return {
    id: true,
    name: true,
    email: true,
    role: true,
    status: true,
    createdAt: true,
    updatedAt: true,
  } satisfies Prisma.UserSelect;
}

export async function createUser(input: CreateUserInput) {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
    select: { id: true },
  });

  if (existingUser) {
    throw new ApiError(409, "Email already exists");
  }

  const passwordHash = await bcrypt.hash(input.password, 10);

  return prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role,
      status: input.status ?? UserStatus.ACTIVE,
    },
    select: publicUserSelect(),
  });
}

export async function getUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: publicUserSelect(),
  });
}

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: publicUserSelect(),
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
}

export async function updateUser(id: string, input: UpdateUserInput) {
  const user = await prisma.user.findUnique({ where: { id }, select: { id: true } });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const data: Prisma.UserUpdateInput = {};

  if (input.name) data.name = input.name;
  if (input.role) data.role = input.role;
  if (input.status) data.status = input.status;
  if (input.password) data.passwordHash = await bcrypt.hash(input.password, 10);

  return prisma.user.update({
    where: { id },
    data,
    select: publicUserSelect(),
  });
}

export async function getMyProfile(userId: string) {
  return getUserById(userId);
}
