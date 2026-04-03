import bcrypt from "bcryptjs";
import { PrismaClient, Role, UserStatus, RecordType } from "@prisma/client";

const prisma = new PrismaClient();

async function upsertUser(input: {
  email: string;
  name: string;
  password: string;
  role: Role;
  status?: UserStatus;
}) {
  const passwordHash = await bcrypt.hash(input.password, 10);

  return prisma.user.upsert({
    where: { email: input.email },
    update: {
      name: input.name,
      passwordHash,
      role: input.role,
      status: input.status ?? UserStatus.ACTIVE,
    },
    create: {
      email: input.email,
      name: input.name,
      passwordHash,
      role: input.role,
      status: input.status ?? UserStatus.ACTIVE,
    },
  });
}

async function main() {
  const admin = await upsertUser({
    email: "admin@finance.local",
    name: "System Admin",
    password: "Admin@123",
    role: Role.ADMIN,
  });

  await upsertUser({
    email: "analyst@finance.local",
    name: "Data Analyst",
    password: "Analyst@123",
    role: Role.ANALYST,
  });

  await upsertUser({
    email: "viewer@finance.local",
    name: "Dashboard Viewer",
    password: "Viewer@123",
    role: Role.VIEWER,
  });

  const existingRecords = await prisma.financialRecord.count();

  if (existingRecords === 0) {
    const now = new Date();
    const samples = [
      {
        amount: 120000,
        type: RecordType.INCOME,
        category: "Salary",
        recordDate: new Date(now.getFullYear(), now.getMonth(), 2),
        notes: "Monthly salary",
      },
      {
        amount: 12000,
        type: RecordType.EXPENSE,
        category: "Rent",
        recordDate: new Date(now.getFullYear(), now.getMonth(), 3),
        notes: "Apartment rent",
      },
      {
        amount: 3000,
        type: RecordType.EXPENSE,
        category: "Groceries",
        recordDate: new Date(now.getFullYear(), now.getMonth(), 8),
        notes: "Weekly supplies",
      },
      {
        amount: 15000,
        type: RecordType.INCOME,
        category: "Freelance",
        recordDate: new Date(now.getFullYear(), now.getMonth() - 1, 20),
        notes: "Freelance project",
      },
      {
        amount: 4500,
        type: RecordType.EXPENSE,
        category: "Utilities",
        recordDate: new Date(now.getFullYear(), now.getMonth() - 1, 25),
        notes: "Electricity and internet",
      },
    ];

    for (const sample of samples) {
      await prisma.financialRecord.create({
        data: {
          ...sample,
          createdById: admin.id,
        },
      });
    }
  }

  console.log("Seed completed.");
  console.log("Admin login: admin@finance.local / Admin@123");
  console.log("Analyst login: analyst@finance.local / Analyst@123");
  console.log("Viewer login: viewer@finance.local / Viewer@123");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
