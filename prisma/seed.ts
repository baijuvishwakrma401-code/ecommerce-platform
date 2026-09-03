import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const PERMISSIONS = [
  "products.manage",
  "inventory.manage",
  "orders.manage",
  "customers.manage",
  "coupons.manage",
  "website.manage",
  "settings.manage",
  "admins.manage",
];

async function main() {
  console.log("Seeding roles & permissions...");

  const permissionRecords = await Promise.all(
    PERMISSIONS.map((key) =>
      prisma.permission.upsert({ where: { key }, update: {}, create: { key } })
    )
  );

  const superAdminRole = await prisma.role.upsert({
    where: { name: "SUPER_ADMIN" },
    update: {},
    create: {
      name: "SUPER_ADMIN",
      description: "Full access to every module.",
      permissions: {
        create: permissionRecords.map((p) => ({ permissionId: p.id })),
      },
    },
  });

  await prisma.role.upsert({
    where: { name: "ADMIN" },
    update: {},
    create: {
      name: "ADMIN",
      description: "Manages products, inventory, orders and customers.",
      permissions: {
        create: permissionRecords
          .filter((p) => ["products.manage", "inventory.manage", "orders.manage", "customers.manage", "coupons.manage"].includes(p.key))
          .map((p) => ({ permissionId: p.id })),
      },
    },
  });

  await prisma.role.upsert({
    where: { name: "MANAGER" },
    update: {},
    create: {
      name: "MANAGER",
      description: "Limited access, configured per permission.",
      permissions: {
        create: permissionRecords
          .filter((p) => ["orders.manage", "inventory.manage"].includes(p.key))
          .map((p) => ({ permissionId: p.id })),
      },
    },
  });

  console.log("Seeding demo admin account...");

  const demoAdminEmail = "admin@example.com";
  const demoAdminPassword = "ChangeMe123!";

  await prisma.adminUser.upsert({
    where: { email: demoAdminEmail },
    update: {},
    create: {
      name: "Demo Super Admin",
      email: demoAdminEmail,
      passwordHash: await bcrypt.hash(demoAdminPassword, 12),
      roleId: superAdminRole.id,
    },
  });

  console.log("Seeding demo customer account...");

  const demoCustomerEmail = "customer@example.com";
  const demoCustomerPassword = "ChangeMe123!";

  await prisma.user.upsert({
    where: { email: demoCustomerEmail },
    update: {},
    create: {
      name: "Demo Customer",
      email: demoCustomerEmail,
      passwordHash: await bcrypt.hash(demoCustomerPassword, 12),
    },
  });

  console.log("\nSeed complete.");
  console.log("─────────────────────────────────────────");
  console.log(`Admin login   → /admin/login`);
  console.log(`  email:      ${demoAdminEmail}`);
  console.log(`  password:   ${demoAdminPassword}`);
  console.log(`Customer login → /login`);
  console.log(`  email:      ${demoCustomerEmail}`);
  console.log(`  password:   ${demoCustomerPassword}`);
  console.log("─────────────────────────────────────────");
  console.log("⚠️  Change these credentials before deploying to production.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
