# AMS API - 算力中心资产管理系统后端

Express + Prisma + MySQL

## 快速开始

```bash
# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 填入数据库连接信息

# 生成 Prisma Client
npx prisma generate

# 运行数据库迁移
npx prisma migrate dev --name init

# 导入种子数据
npm run db:seed

# 启动开发服务器
npm run dev
```

## API 路由

- `GET /api/health` - 健康检查
- `GET /api/procurement/suppliers` - 供应商列表
- `GET /api/procurement/contracts` - 合同列表
- `GET /api/warehousing/deliveries` - 到货记录
- `GET /api/warehousing/stock-ins` - 入库单
- `GET /api/assets` - 资产列表
- `GET /api/operations/allocations` - 领用记录
- `GET /api/operations/transfers` - 调拨记录
- `GET /api/maintenance/repairs` - 维修记录
- `GET /api/maintenance/inventories` - 盘点记录
- `GET /api/maintenance/scraps` - 报废记录

## 技术栈

- Express 5
- Prisma 6 (ORM)
- MySQL
- TypeScript
- JWT 认证
