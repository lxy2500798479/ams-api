import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // 创建管理员用户
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      name: '系统管理员',
      role: 'admin',
      email: 'admin@ams.local',
    },
  });

  // 创建示例供应商
  await prisma.supplier.upsert({
    where: { code: 'SUP-001' },
    update: {},
    create: {
      code: 'SUP-001',
      name: '华为技术有限公司',
      category: '设备供应商',
      contact: '张三',
      phone: '13800138001',
      address: '深圳市龙岗区',
    },
  });

  await prisma.supplier.upsert({
    where: { code: 'SUP-002' },
    update: {},
    create: {
      code: 'SUP-002',
      name: '浪潮电子信息产业股份有限公司',
      category: '设备供应商',
      contact: '李四',
      phone: '13800138002',
      address: '济南市高新区',
    },
  });

  // 创建示例虚拟库
  await prisma.warehouse.upsert({
    where: { name: 'WH-BJ-01' },
    update: {},
    create: {
      name: 'WH-BJ-01',
      cluster: '北京智算中心集群A',
      location: '北京市海淀区',
      manager: '王工',
    },
  });

  await prisma.warehouse.upsert({
    where: { name: 'WH-SH-01' },
    update: {},
    create: {
      name: 'WH-SH-01',
      cluster: '上海智算中心集群B',
      location: '上海市浦东新区',
      manager: '赵工',
    },
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
