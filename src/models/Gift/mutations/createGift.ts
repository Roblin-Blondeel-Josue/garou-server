import { builder } from '../../../builder';
import { db } from '../../../db';
import { hasRoles } from '../../../utils/hasRoles';

export const CreateGiftInput = builder.inputType('CreateTagInput', {
  fields: (t) => ({
    name: t.string({ required: true }),
    description: t.string({ required: false }),
    cost: t.string({ required: false }),
  }),
});

builder.mutationField('createGift', (t) =>
  t.prismaField({
    type: 'Gift',
    args: {
      data: t.arg({ type: CreateGiftInput, required: true }),
    },
    resolve: async (query, parent, args, ctx, info) => {
      //if (!hasRoles(ctx?.user, 'admin')) throw new Error('Not authorized');
      return db.gift.create({
        data: {
          name: args.data.name,
          description: args.data.description,
          cost: args.data.cost,
        },
      });
    },
  }),
);
