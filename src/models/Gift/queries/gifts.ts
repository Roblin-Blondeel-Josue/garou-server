import { Prisma } from '@prisma/client';
import {
  builder,
  paginationArgs,
  paginationPrismaArgs,
} from '../../../builder';
import { Context } from '../../../context';
import { db } from '../../../db';

export const WhereGiftInput = builder.inputType('WhereGiftInput', {
  fields: (t) => ({
    search: t.string({ required: false }),
    name: t.string({ required: false }),
    description: t.string({ required: false }),
    cost: t.string({ required: false }),
  }),
});
export const GiftOrderBy = builder.prismaOrderBy('Gift', {
  fields: () => ({
    name: true,
    createdAt: true,
    updatedAt: true,
  }),
});

builder.queryField('gifts', (t) =>
  t.prismaField({
    type: ['Gift'],
    nullable: true,
    args: {
      ...paginationArgs(t),
      where: t.arg({ type: WhereGiftInput }),
      orderBy: t.arg({ type: GiftOrderBy }),
    },
    resolve: async (query, root, args, ctx, info) => {
      const where = WhereGift(args, ctx);
      return db.gift.findMany({
        ...query,
        where,
        ...paginationPrismaArgs(args),
        orderBy: args.orderBy ?? {
          name: 'asc',
        },
      });
    },
  }),
);

type WhereGiftArgs = {
  take?: number | unknown;
  skip?: number | unknown;
  where?: null | {
    search?: string | null;
    name?: string | null;
    description?: string | null;
    cost?: string | null;
  };
};

export function WhereGift(args: WhereGiftArgs, ctx: Context) {
  let where: Prisma.GiftWhereInput = {};
  if (args?.where?.search != undefined) {
    where = {
      ...where,
      OR: [
        {
          name: {
            contains: args.where.search,
            mode: 'insensitive',
          },
        },
      ],
    };
  }
  if (args.where?.name != undefined) {
    where = {
      ...where,
      name: {
        contains: args.where.name,
        mode: 'insensitive',
      },
    };
  }
  if (args.where?.description != undefined) {
    where = {
      ...where,
      description: {
        contains: args.where.description,
        mode: 'insensitive',
      },
    };
  }
  if (args.where?.cost != undefined) {
    where = {
      ...where,
      cost: {
        contains: args.where.cost,
        mode: 'insensitive',
      },
    };
  }
  return where;
}
