import { Router } from "express";
import { loginController } from "../controllers/auth.controller";
import { validate } from "../middleware/validate.middleware";
import { loginSchema } from "../validators/auth.validator";
import { asyncHandler } from "../utils/async-handler";

export const authRouter = Router();

authRouter.post("/login", validate({ body: loginSchema }), asyncHandler(loginController));
