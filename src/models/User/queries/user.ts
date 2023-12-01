import { builder } from '../../../builder';
import { db } from '../../../db';

builder.queryField('user', (t) =>
  t.prismaField({
    type: 'User',
    nullable: true,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (query, root, args, ctx, info) => {
      if (!ctx?.user?.role?.includes('admin'))
        throw new Error('Not authorized');
      return db.user.findUnique({
        ...query,
        where: { id: args.id },
      });
    },
  }),
);
