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
    'users:read', 'users:update-own', 'social:post', 'marketplace:buy',
    'learning:enroll', 'farm:manage-own', 'farm:view-shared', 'ai:chat',
    'consultation:book', 'certification:apply', 'notifications:manage-own'
  ],
  VENDOR: [
    'users:read', 'users:update-own', 'social:post', 'marketplace:sell',
    'marketplace:manage-vendor', 'learning:enroll', 'notifications:manage-own'
  ],
  EXPERT: [
    'users:read', 'users:update-own', 'social:post', 'learning:teach',
    'farm:view-shared', 'ai:chat', 'consultation:provide',
    'certification:inspect', 'notifications:manage-own'
  ],
  NGO: [
    'users:read', 'users:update-own', 'social:post', 'learning:teach',
    'farm:view-shared', 'ai:chat', 'consultation:book',
    'certification:apply', 'certification:inspect', 'notifications:manage-own'
  ],
  TEACHER: [],
  ADMIN: permissions,
  GOV: ['users:read', 'farm:view-shared', 'certification:inspect', 'certification:issue'],
  SUPER_ADMIN: permissions
};

const crops = [
  ['rice',         'Rice',          'ស្រូវ'],
  ['cassava',      'Cassava',       'ដំឡូងមី'],
  ['mango',        'Mango',         'ស្វាយ'],
  ['pepper',       'Pepper',        'ម្រេច'],
  ['cashew',       'Cashew',        'ស្វាយចន្ទី'],
  ['banana',       'Banana',        'ចេក'],
  ['yardlong-bean','Yardlong Bean', 'សណ្ដែកកួរ']
] as const;

const productCategories = [
  ['seeds',            'Seeds'],
  ['fertilizer',       'Fertilizer'],
  ['crop-protection',  'Crop Protection'],
  ['equipment',        'Equipment'],
  ['irrigation',       'Irrigation'],
  ['services',         'Services']
] as const;

const certificationTypes = [
  ['organic',    'Organic'],
  ['gap',        'Good Agricultural Practices'],
  ['fair-trade', 'Fair Trade'],
  ['carbon',     'Carbon Farming'],
  ['eudr',       'EUDR Traceability']
] as const;

// One seed user per role — all share password: 123
const seedUsers: { email: string; displayName: string; role: RoleName }[] = [
  { email: 'superadmin@example.com', displayName: 'Super Admin',  role: RoleName.SUPER_ADMIN },
  { email: 'admin@example.com',      displayName: 'Admin',        role: RoleName.ADMIN       },
  { email: 'farmer@example.com',     displayName: 'Demo Farmer',  role: RoleName.FARMER      },
  { email: 'vendor@example.com',     displayName: 'Demo Vendor',  role: RoleName.VENDOR      },
  { email: 'expert@example.com',     displayName: 'Demo Expert',  role: RoleName.EXPERT      },
  { email: 'teacher@example.com',    displayName: 'Demo Teacher', role: RoleName.TEACHER     },
  { email: 'ngo@example.com',        displayName: 'Demo NGO',     role: RoleName.NGO         },
  { email: 'gov@example.com',        displayName: 'Demo Gov',     role: RoleName.GOV         }
];

async function main() {
  // ── Permissions ─────────────────────────────────────────────────────────────
  const createdPermissions = new Map<string, string>();
  for (const key of permissions) {
    const permission = await prisma.permission.upsert({
      where: { key },
      update: {},
      create: { key, description: key.replaceAll(':', ' ') }
    });
    createdPermissions.set(key, permission.id);
  }

  // ── Roles + role-permission assignments ────────────────────────────────────
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

  // ── Reference data ──────────────────────────────────────────────────────────
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

  // ── Seed users ──────────────────────────────────────────────────────────────
  const defaultPassword = await bcrypt.hash('123', 12);

  for (const { email, displayName, role } of seedUsers) {
    const dbRole = await prisma.role.findUniqueOrThrow({ where: { name: role } });

    const user = await prisma.user.upsert({
      where: { email },
      update: { status: 'ACTIVE', emailVerifiedAt: new Date() },
      create: {
        email,
        passwordHash: defaultPassword,
        displayName,
        locale: 'km-KH',
        status: 'ACTIVE',
        emailVerifiedAt: new Date()
      }
    });

    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: user.id, roleId: dbRole.id } },
      update: {},
      create: { userId: user.id, roleId: dbRole.id }
    });
  }

  console.log('\nSeed complete — users (password for all: 123)');
  console.log('─────────────────────────────────────────────────');
  for (const { email, role } of seedUsers) {
    console.log(`  ${role.padEnd(12)}  ${email}`);
  }
  console.log('─────────────────────────────────────────────────\n');
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
