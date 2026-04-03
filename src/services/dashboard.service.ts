import { RecordType, type Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";

interface DashboardQuery {
  startDate?: string;
  endDate?: string;
  months: number;
  recentLimit: number;
}

function dateFilter(query: DashboardQuery): Prisma.DateTimeFilter | undefined {
  if (!query.startDate && !query.endDate) {
    return undefined;
  }

  return {
    gte: query.startDate ? new Date(query.startDate) : undefined,
    lte: query.endDate ? new Date(query.endDate) : undefined,
  };
}

export async function getDashboardSummary(query: DashboardQuery) {
  const recordDate = dateFilter(query);
  const where: Prisma.FinancialRecordWhereInput = recordDate ? { recordDate } : {};

  const [incomeAgg, expenseAgg, categoryRaw, recentRaw, monthlyRaw] = await Promise.all([
    prisma.financialRecord.aggregate({
      where: { ...where, type: RecordType.INCOME },
      _sum: { amount: true },
    }),
    prisma.financialRecord.aggregate({
      where: { ...where, type: RecordType.EXPENSE },
      _sum: { amount: true },
    }),
    prisma.financialRecord.groupBy({
      by: ["category", "type"],
      where,
      _sum: { amount: true },
      orderBy: { category: "asc" },
    }),
    prisma.financialRecord.findMany({
      where,
      orderBy: { recordDate: "desc" },
      take: query.recentLimit,
      select: {
        id: true,
        type: true,
        amount: true,
        category: true,
        recordDate: true,
        notes: true,
      },
    }),
    prisma.financialRecord.findMany({
      where: {
        recordDate: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth() - (query.months - 1), 1),
        },
      },
      select: {
        type: true,
        amount: true,
        recordDate: true,
      },
    }),
  ]);

  const totalIncome = Number(incomeAgg._sum.amount ?? 0);
  const totalExpenses = Number(expenseAgg._sum.amount ?? 0);

  const categoryTotals = categoryRaw.map((item) => ({
    category: item.category,
    type: item.type,
    total: Number(item._sum.amount ?? 0),
  }));

  const recentActivity = recentRaw.map((item) => ({
    ...item,
    amount: Number(item.amount),
  }));

  const monthlyMap = new Map<string, { income: number; expense: number }>();

  for (const item of monthlyRaw) {
    const year = item.recordDate.getFullYear();
    const month = String(item.recordDate.getMonth() + 1).padStart(2, "0");
    const key = `${year}-${month}`;
    const current = monthlyMap.get(key) ?? { income: 0, expense: 0 };

    if (item.type === RecordType.INCOME) {
      current.income += Number(item.amount);
    } else {
      current.expense += Number(item.amount);
    }

    monthlyMap.set(key, current);
  }

  const monthlyTrend = Array.from(monthlyMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([month, totals]) => ({
      month,
      income: totals.income,
      expense: totals.expense,
      net: totals.income - totals.expense,
    }));

  return {
    totals: {
      income: totalIncome,
      expenses: totalExpenses,
      netBalance: totalIncome - totalExpenses,
    },
    categoryTotals,
    recentActivity,
    monthlyTrend,
  };
}
