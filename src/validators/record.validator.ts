import { RecordType } from "@prisma/client";
import { z } from "zod";

const recordBaseSchema = {
  amount: z
    .number()
    .positive()
    .refine((value) => Number(value.toFixed(2)) === value, {
      message: "Amount can have at most 2 decimal places",
    }),
  type: z.enum(RecordType),
  category: z.string().trim().min(2).max(100),
  recordDate: z.iso.datetime(),
  notes: z.string().trim().max(500).optional(),
};

export const createRecordSchema = z.object(recordBaseSchema);

export const updateRecordSchema = z
  .object({
    amount: recordBaseSchema.amount.optional(),
    type: recordBaseSchema.type.optional(),
    category: recordBaseSchema.category.optional(),
    recordDate: recordBaseSchema.recordDate.optional(),
    notes: recordBaseSchema.notes,
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required",
  });

export const recordIdParamSchema = z.object({
  id: z.uuid(),
});

export const recordQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  type: z.enum(RecordType).optional(),
  category: z.string().trim().min(1).optional(),
  startDate: z.iso.datetime().optional(),
  endDate: z.iso.datetime().optional(),
  sortBy: z.enum(["recordDate", "amount", "createdAt"]).default("recordDate"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});
