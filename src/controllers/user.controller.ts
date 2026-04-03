import type { Request, Response } from "express";
import { createUser, getMyProfile, getUserById, getUsers, updateUser } from "../services/user.service";

export async function createUserController(req: Request, res: Response) {
  const user = await createUser(req.body);

  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: user,
  });
}

export async function getUsersController(_req: Request, res: Response) {
  const users = await getUsers();

  res.status(200).json({
    success: true,
    data: users,
  });
}

export async function getUserByIdController(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const user = await getUserById(id);

  res.status(200).json({
    success: true,
    data: user,
  });
}

export async function updateUserController(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const user = await updateUser(id, req.body);

  res.status(200).json({
    success: true,
    message: "User updated successfully",
    data: user,
  });
}

export async function meController(req: Request, res: Response) {
  const profile = await getMyProfile(req.user!.id);

  res.status(200).json({
    success: true,
    data: profile,
  });
}
