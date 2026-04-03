import { Role } from "@prisma/client";
import { Router } from "express";
import {
  createRecordController,
  deleteRecordController,
  getRecordByIdController,
  getRecordsController,
  updateRecordController,
} from "../controllers/record.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/authorize.middleware";
import { validate } from "../middleware/validate.middleware";
import { asyncHandler } from "../utils/async-handler";
import {
  createRecordSchema,
  recordIdParamSchema,
  recordQuerySchema,
  updateRecordSchema,
} from "../validators/record.validator";

export const recordsRouter = Router();

recordsRouter.use(authenticate);

recordsRouter.get(
  "/",
  authorize(Role.ANALYST, Role.ADMIN),
  validate({ query: recordQuerySchema }),
  asyncHandler(getRecordsController),
);
recordsRouter.get(
  "/:id",
  authorize(Role.ANALYST, Role.ADMIN),
  validate({ params: recordIdParamSchema }),
  asyncHandler(getRecordByIdController),
);
recordsRouter.post(
  "/",
  authorize(Role.ADMIN),
  validate({ body: createRecordSchema }),
  asyncHandler(createRecordController),
);
recordsRouter.patch(
  "/:id",
  authorize(Role.ADMIN),
  validate({ params: recordIdParamSchema, body: updateRecordSchema }),
  asyncHandler(updateRecordController),
);
recordsRouter.delete(
  "/:id",
  authorize(Role.ADMIN),
  validate({ params: recordIdParamSchema }),
  asyncHandler(deleteRecordController),
);
