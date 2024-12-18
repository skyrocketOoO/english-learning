
# pnpm add prisma @prisma/client
# pnpm dlx prisma init
migrate:
	pnpm dlx prisma migrate dev --name init
gencode:
	pnpm dlx prisma generate
seed:
	pnpm ts-node prisma/seed.ts