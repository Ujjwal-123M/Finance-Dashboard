import { Role } from "@prisma/client";
import { Router } from "express";
import {
  createUserController,
  getUserByIdController,
  getUsersController,
  meController,
  updateUserController,
} from "../controllers/user.controller";
import { authorize } from "../middleware/authorize.middleware";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { asyncHandler } from "../utils/async-handler";
import { createUserSchema, updateUserSchema, userIdParamSchema } from "../validators/user.validator";

export const usersRouter = Router();

usersRouter.use(authenticate);

usersRouter.get("/me", asyncHandler(meController));

usersRouter.get("/", authorize(Role.ADMIN), asyncHandler(getUsersController));
usersRouter.post(
  "/",
  authorize(Role.ADMIN),
  validate({ body: createUserSchema }),
  asyncHandler(createUserController),
);
usersRouter.get(
  "/:id",
  authorize(Role.ADMIN),
  validate({ params: userIdParamSchema }),
  asyncHandler(getUserByIdController),
);
usersRouter.patch(
  "/:id",
  authorize(Role.ADMIN),
  validate({ params: userIdParamSchema, body: updateUserSchema }),
  asyncHandler(updateUserController),
);
