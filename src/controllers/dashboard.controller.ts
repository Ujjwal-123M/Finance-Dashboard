import type { Request, Response } from "express";
import { getDashboardSummary } from "../services/dashboard.service";

export async function dashboardSummaryController(req: Request, res: Response) {
  const summary = await getDashboardSummary((req.validated?.query ?? req.query) as never);

  res.status(200).json({
    success: true,
    data: summary,
  });
}
