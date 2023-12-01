import { builder } from '../../../builder';
import { db } from '../../../db';
import { hasRoles } from '../../../utils/hasRoles';

export const UpdateGiftInput = builder.inputType('UpdateGiftInput', {
  fields: (t) => ({
    name: t.string({ required: false }),
    description: t.string({ required: false }),
    cost: t.string({ required: false }),
  }),
});

builder.mutationField('updateGift', (t) =>
  t.prismaField({
    type: 'Gift',
    args: {
      id: t.arg.id({ required: true }),
      data: t.arg({ type: UpdateGiftInput, required: true }),
    },
    resolve: async (query, parent, args, ctx, info) => {
      if (!hasRoles(ctx?.user, 'admin')) throw new Error('Not authorized');
      return db.gift.update({
        where: {
          id: args.id,
        },
        data: {
          name: args.data.name || undefined,
          description: args.data.description || undefined,
          cost: args.data.cost || undefined
        },
      });
    },
  }),
);
