import { z } from "zod";

export const dashboardQuerySchema = z.object({
  startDate: z.iso.datetime().optional(),
  endDate: z.iso.datetime().optional(),
  months: z.coerce.number().int().positive().max(24).default(6),
  recentLimit: z.coerce.number().int().positive().max(50).default(5),
});
