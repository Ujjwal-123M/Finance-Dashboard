import { RecordType, type Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { ApiError } from "../utils/api-error";

interface CreateRecordInput {
  amount: number;
  type: RecordType;
  category: string;
  recordDate: string;
  notes?: string;
}

interface UpdateRecordInput {
  amount?: number;
  type?: RecordType;
  category?: string;
  recordDate?: string;
  notes?: string;
}

interface RecordQuery {
  page: number;
  limit: number;
  type?: RecordType;
  category?: string;
  startDate?: string;
  endDate?: string;
  sortBy: "recordDate" | "amount" | "createdAt";
  sortOrder: "asc" | "desc";
}

function normalizeRecordQuery(input: Partial<RecordQuery>): RecordQuery {
  const pageValue = Number(input.page ?? 1);
  const limitValue = Number(input.limit ?? 10);

  const sortBy: RecordQuery["sortBy"] =
    input.sortBy === "amount" || input.sortBy === "createdAt" || input.sortBy === "recordDate"
      ? input.sortBy
      : "recordDate";
  const sortOrder: RecordQuery["sortOrder"] = input.sortOrder === "asc" ? "asc" : "desc";

  return {
    page: Number.isFinite(pageValue) && pageValue > 0 ? Math.floor(pageValue) : 1,
    limit: Number.isFinite(limitValue) && limitValue > 0 ? Math.floor(limitValue) : 10,
    type: input.type,
    category: input.category,
    startDate: input.startDate,
    endDate: input.endDate,
    sortBy,
    sortOrder,
  };
}

function toRecordDto(record: {
  id: string;
  amount: Prisma.Decimal;
  type: RecordType;
  category: string;
  recordDate: Date;
  notes: string | null;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    ...record,
    amount: Number(record.amount),
  };
}

export async function createRecord(input: CreateRecordInput, userId: string) {
  const record = await prisma.financialRecord.create({
    data: {
      amount: input.amount,
      type: input.type,
      category: input.category,
      recordDate: new Date(input.recordDate),
      notes: input.notes,
      createdById: userId,
    },
  });

  return toRecordDto(record);
}

export async function getRecords(query: RecordQuery) {
  const normalizedQuery = normalizeRecordQuery(query);
  const where: Prisma.FinancialRecordWhereInput = {};

  if (normalizedQuery.type) where.type = normalizedQuery.type;
  if (normalizedQuery.category) {
    where.category = { contains: normalizedQuery.category, mode: "insensitive" };
  }

  if (normalizedQuery.startDate || normalizedQuery.endDate) {
    where.recordDate = {
      gte: normalizedQuery.startDate ? new Date(normalizedQuery.startDate) : undefined,
      lte: normalizedQuery.endDate ? new Date(normalizedQuery.endDate) : undefined,
    };
  }

  const [total, records] = await Promise.all([
    prisma.financialRecord.count({ where }),
    prisma.financialRecord.findMany({
      where,
      orderBy: { [normalizedQuery.sortBy]: normalizedQuery.sortOrder },
      skip: (normalizedQuery.page - 1) * normalizedQuery.limit,
      take: normalizedQuery.limit,
    }),
  ]);

  return {
    data: records.map(toRecordDto),
    pagination: {
      page: normalizedQuery.page,
      limit: normalizedQuery.limit,
      total,
      totalPages: Math.ceil(total / normalizedQuery.limit),
    },
  };
}

export async function getRecordById(id: string) {
  const record = await prisma.financialRecord.findUnique({ where: { id } });

  if (!record) {
    throw new ApiError(404, "Record not found");
  }

  return toRecordDto(record);
}

export async function updateRecord(id: string, input: UpdateRecordInput) {
  const exists = await prisma.financialRecord.findUnique({ where: { id }, select: { id: true } });

  if (!exists) {
    throw new ApiError(404, "Record not found");
  }

  const record = await prisma.financialRecord.update({
    where: { id },
    data: {
      amount: input.amount,
      type: input.type,
      category: input.category,
      recordDate: input.recordDate ? new Date(input.recordDate) : undefined,
      notes: input.notes,
    },
  });

  return toRecordDto(record);
}

export async function deleteRecord(id: string) {
  const exists = await prisma.financialRecord.findUnique({ where: { id }, select: { id: true } });

  if (!exists) {
    throw new ApiError(404, "Record not found");
  }

  await prisma.financialRecord.delete({ where: { id } });
}
