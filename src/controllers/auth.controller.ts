import type { Request, Response } from "express";
import { login } from "../services/auth.service";

export async function loginController(req: Request, res: Response) {
  const result = await login(req.body);

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: result,
  });
}
