import { PrismaClient, RoleName } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const permissions = [
  'auth:manage-sessions',
  'users:read',
  'users:update-own',
  'users:manage',
  'social:post',
  'social:moderate',
  'marketplace:buy',
  'marketplace:sell',
  'marketplace:manage-vendor',
  'learning:enroll',
  'learning:teach',
  'farm:manage-own',
  'farm:view-shared',
  'ai:chat',
  'ai:manage-knowledge',
  'consultation:book',
  'consultation:provide',
  'certification:apply',
  'certification:inspect',
  'certification:issue',
  'notifications:manage-own',
  'admin:platform'
];

const rolePermissions: Record<RoleName, string[]> = {
  FARMER: [
    'users:read',
    'users:update-own',
    'social:post',
    'marketplace:buy',
    'learning:enroll',
    'farm:manage-own',
    'farm:view-shared',
    'ai:chat',
    'consultation:book',
    'certification:apply',
    'notifications:manage-own'
  ],
  VENDOR: [
    'users:read',
    'users:update-own',
    'social:post',
    'marketplace:sell',
    'marketplace:manage-vendor',
    'learning:enroll',
    'notifications:manage-own'
  ],
  EXPERT: [
    'users:read',
    'users:update-own',
    'social:post',
    'learning:teach',
    'farm:view-shared',
    'ai:chat',
    'consultation:provide',
    'certification:inspect',
    'notifications:manage-own'
  ],
  NGO: [
    'users:read',
    'users:update-own',
    'social:post',
    'learning:teach',
    'farm:view-shared',
    'ai:chat',
    'consultation:book',
    'certification:apply',
    'certification:inspect',
    'notifications:manage-own'
  ],
  GOV: ['users:read', 'farm:view-shared', 'certification:inspect', 'certification:issue'],
  ADMIN: permissions,
  SUPER_ADMIN: permissions
};

const crops = [
  ['rice', 'Rice', 'ស្រូវ'],
  ['cassava', 'Cassava', 'ដំឡូងមី'],
  ['mango', 'Mango', 'ស្វាយ'],
  ['pepper', 'Pepper', 'ម្រេច'],
  ['cashew', 'Cashew', 'ស្វាយចន្ទី'],
  ['banana', 'Banana', 'ចេក'],
  ['yardlong-bean', 'Yardlong Bean', 'សណ្ដែកកួរ']
] as const;

const productCategories = [
  ['seeds', 'Seeds'],
  ['fertilizer', 'Fertilizer'],
  ['crop-protection', 'Crop Protection'],
  ['equipment', 'Equipment'],
  ['irrigation', 'Irrigation'],
  ['services', 'Services']
] as const;

const certificationTypes = [
  ['organic', 'Organic'],
  ['gap', 'Good Agricultural Practices'],
  ['fair-trade', 'Fair Trade'],
  ['carbon', 'Carbon Farming'],
  ['eudr', 'EUDR Traceability']
] as const;

async function main() {
  const createdPermissions = new Map<string, string>();

  for (const key of permissions) {
    const permission = await prisma.permission.upsert({
      where: { key },
      update: {},
      create: { key, description: key.replaceAll(':', ' ') }
    });
    createdPermissions.set(key, permission.id);
  }

  for (const roleName of Object.values(RoleName)) {
    const role = await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName, description: `${roleName.toLowerCase()} role` }
    });

    for (const permissionKey of rolePermissions[roleName]) {
      const permissionId = createdPermissions.get(permissionKey);
      if (!permissionId) continue;
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: role.id, permissionId } },
        update: {},
        create: { roleId: role.id, permissionId }
      });
    }
  }

  for (const [slug, name, localName] of crops) {
    await prisma.crop.upsert({
      where: { slug },
      update: { name, localName },
      create: { slug, name, localName }
    });
  }

  for (const [slug, name] of productCategories) {
    await prisma.productCategory.upsert({
      where: { slug },
      update: { name },
      create: { slug, name }
    });
  }

  for (const [slug, name] of certificationTypes) {
    await prisma.certificationType.upsert({
      where: { slug },
      update: { name },
      create: {
        slug,
        name,
        description: `${name} certification workflow`,
        validityMonths: slug === 'eudr' ? 24 : 12
      }
    });
  }

  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'admin@farmjumnoy.local';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'ChangeMe123!';
  const adminRole = await prisma.role.findUniqueOrThrow({ where: { name: RoleName.SUPER_ADMIN } });

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { status: 'ACTIVE', emailVerifiedAt: new Date() },
    create: {
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPassword, 12),
      displayName: 'FarmJumnoy Admin',
      locale: 'km-KH',
      status: 'ACTIVE',
      emailVerifiedAt: new Date()
    }
  });

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: admin.id, roleId: adminRole.id } },
    update: {},
    create: { userId: admin.id, roleId: adminRole.id }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
