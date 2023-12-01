import { builder } from '../../../builder';
import { db } from '../../../db';
import { hasRoles } from '../../../utils/hasRoles';

builder.mutationField('deleteGift', (t) =>
  t.prismaField({
    type: 'Gift',
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (query, parent, args, ctx, info) => {
      if (!hasRoles(ctx?.user, 'admin')) throw new Error('Not authorized');
      return db.gift.delete({
        where: {
          id: args.id,
        },
      });
    },
  }),
);
