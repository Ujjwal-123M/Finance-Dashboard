import { Role, UserStatus } from "@prisma/client";
import { z } from "zod";

export const userIdParamSchema = z.object({
  id: z.uuid(),
});

export const createUserSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email(),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/, "Password must include at least one uppercase letter")
    .regex(/[a-z]/, "Password must include at least one lowercase letter")
    .regex(/[0-9]/, "Password must include at least one digit"),
  role: z.enum(Role),
  status: z.enum(UserStatus).optional(),
});

export const updateUserSchema = z
  .object({
    name: z.string().trim().min(2).max(100).optional(),
    password: z
      .string()
      .min(8)
      .regex(/[A-Z]/, "Password must include at least one uppercase letter")
      .regex(/[a-z]/, "Password must include at least one lowercase letter")
      .regex(/[0-9]/, "Password must include at least one digit")
      .optional(),
    role: z.enum(Role).optional(),
    status: z.enum(UserStatus).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required",
  });
