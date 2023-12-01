import { Prisma } from '@prisma/client';
import {
  builder,
  paginationArgs,
  paginationPrismaArgs,
} from '../../../builder';
import { Context } from '../../../context';
import { db } from '../../../db';
import { hasRoles } from '../../../utils/hasRoles';

export const UserOrderBy = builder.prismaOrderBy('User', {
  fields: () => ({
    lastName: true,
    email: true,
    status: true,
    isPremium: true,
  }),
});

export const WhereUserInput = builder.inputType('WhereUserInput', {
  fields: (t) => ({
    search: t.string({ required: false }),
    email: t.string({ required: false }),
    isPremium: t.boolean({ required: false }),
    connectFrom: t.field({ type: 'DateTime', required: false }),
    connectTo: t.field({ type: 'DateTime', required: false }),
    roles: t.stringList({ required: false }),
    from: t.field({ type: 'DateTime', required: false }),
    to: t.field({ type: 'DateTime', required: false }),
  }),
});

builder.queryField('users', (t) =>
  t.prismaField({
    type: ['User'],
    nullable: true,
    authScopes: {
      admin: true,
    },
    args: {
      ...paginationArgs(t),
      where: t.arg({ type: WhereUserInput }),
      orderBy: t.arg({ type: UserOrderBy }),
    },
    resolve: async (query, root, args, ctx, info) => {
      // if (!hasRoles(ctx?.user, 'admin')) throw new Error('Not authorized');
      const where = WhereUser(args, ctx);
      return db.user.findMany({
        ...query,
        ...paginationPrismaArgs(args),
        where,
        orderBy: args.orderBy ?? {
          createdAt: 'desc',
        },
      });
    },
  }),
);

export function WhereUser(args: any, ctx: Context) {
  let where: Prisma.UserWhereInput = {};
  if (args?.where?.search != undefined) {
    where = {
      ...where,
      OR: [
        {
          email: {
            contains: args.where.search,
            mode: 'insensitive',
          },
        },
        {
          firstName: {
            contains: args.where.search,
            mode: 'insensitive',
          },
        },
        {
          lastName: {
            contains: args.where.search,
            mode: 'insensitive',
          },
        },
        {
          username: {
            contains: args.where.search,
            mode: 'insensitive',
          },
        },
      ],
    };
  }

  if (args?.where?.email != undefined) {
    where = {
      ...where,
      email: {
        contains: args.where.email,
        mode: 'insensitive',
      },
    };
  }

  if (args?.where?.role != undefined) {
    where = {
      ...where,
      role: {
        contains: args.where.role,
        mode: 'insensitive',
      },
    };
  }
  if (args.where?.from != undefined) {
    where = {
      ...where,
      createdAt: {
        gte: args.where.from,
      },
    };
  }
  if (args.where?.to != undefined) {
    where = {
      ...where,
      createdAt: {
        lte: args.where.to,
      },
    };
  }

  if (args?.where?.from != undefined && args?.where?.to != undefined) {
    where = {
      ...where,
      createdAt: {
        gte: args.where.from,
        lte: args.where.to,
      },
    };
  }

  return where;
}
