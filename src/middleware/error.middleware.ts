import { ZodError } from "zod";
import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/api-error";

export function notFoundHandler(_req: Request, _res: Response, next: NextFunction): void {
  next(new ApiError(404, "Route not found"));
}

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (error instanceof ApiError) {
    let payload: unknown = error.details;

    if (error.details instanceof ZodError) {
      payload = error.details.flatten();
    }

    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      details: payload,
    });
    return;
  }

  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      details: error.flatten(),
    });
    return;
  }

  console.error(error);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}
