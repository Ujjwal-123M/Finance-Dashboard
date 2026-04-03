import { Role } from "@prisma/client";
import { Router } from "express";
import { dashboardSummaryController } from "../controllers/dashboard.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/authorize.middleware";
import { validate } from "../middleware/validate.middleware";
import { asyncHandler } from "../utils/async-handler";
import { dashboardQuerySchema } from "../validators/dashboard.validator";

export const dashboardRouter = Router();

dashboardRouter.use(authenticate);

dashboardRouter.get(
  "/summary",
  authorize(Role.VIEWER, Role.ANALYST, Role.ADMIN),
  validate({ query: dashboardQuerySchema }),
  asyncHandler(dashboardSummaryController),
);
