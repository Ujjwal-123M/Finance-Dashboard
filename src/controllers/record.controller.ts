import type { Request, Response } from "express";
import {
  createRecord,
  deleteRecord,
  getRecordById,
  getRecords,
  updateRecord,
} from "../services/record.service";

export async function createRecordController(req: Request, res: Response) {
  const record = await createRecord(req.body, req.user!.id);

  res.status(201).json({
    success: true,
    message: "Record created successfully",
    data: record,
  });
}

export async function getRecordsController(req: Request, res: Response) {
  const records = await getRecords((req.validated?.query ?? req.query) as never);

  res.status(200).json({
    success: true,
    ...records,
  });
}

export async function getRecordByIdController(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const record = await getRecordById(id);

  res.status(200).json({
    success: true,
    data: record,
  });
}

export async function updateRecordController(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const record = await updateRecord(id, req.body);

  res.status(200).json({
    success: true,
    message: "Record updated successfully",
    data: record,
  });
}

export async function deleteRecordController(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  await deleteRecord(id);

  res.status(200).json({
    success: true,
    message: "Record deleted successfully",
  });
}
