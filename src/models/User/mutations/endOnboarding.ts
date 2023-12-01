import { builder } from '../../../builder';
import { db } from '../../../db';

builder.mutationField('endOnboarding', (t) =>
  t.prismaField({
    type: 'User',
    args: {
      username: t.arg.string({
        required: true,
        validate: { minLength: 2, regex: /^[a-zA-Z0-9_]*$/ },
      }),
    },
    resolve: async (query, parent, args, ctx, info) => {
      if (!ctx?.user?.id && ctx?.user?.status !== 'created')
        throw new Error('Not authorized');
      return db.user.update({
        where: {
          id: ctx.user.id,
        },
        data: {
          //TODO: Check again if username is available
          username: args.username,
          status: 'onboarding',
        },
      });
    },
  }),
);
