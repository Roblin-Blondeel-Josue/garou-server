import { builder } from '../../../builder';
import { hasRoles } from '../../../utils/hasRoles';
import { db } from '../../../db';
import {
  getBooleanArg,
  getIntArg,
  getNullableStringArg,
  getStringArg,
} from '../../../utils/getArgs';

export const UpdateUserInput = builder.inputType('UpdateUserInput', {
  fields: (t) => ({
    firstName: t.string({ required: false }),
    lastName: t.string({ required: false }),
    username: t.string({
      required: false,
      validate: { minLength: 2, regex: /^[a-zA-Z0-9_]*$/ },
    }),
    email: t.string({ required: false }),
    role: t.string({ required: false }),
    birthDate: t.field({ type: 'DateTime', required: false }),
    status: t.string({ required: false }),
  }),
});

builder.mutationField('updateUser', (t) =>
  t.prismaField({
    type: 'User',
    args: {
      id: t.arg.id({ required: true }),
      data: t.arg({ type: UpdateUserInput, required: true }),
    },
    resolve: async (query, parent, args, ctx, info) => {
      if (!ctx?.user?.id) throw new Error('Not authorized');

      if (!hasRoles(ctx?.user, 'admin') && ctx?.user?.id !== args.id)
        throw new Error('Not authorized');

      if (args.data.username) {
        const user = await db.user.findFirst({
          where: {
            username: {
              equals: args.data.username,
            },
            id: {
              not: ctx.user?.id,
            },
          },
        });
        if (user) throw new Error('Username is already taken');
      }

      return db.user.update({
        where: {
          id: args.id,
        },
        data: {
          firstName: getNullableStringArg(args.data.firstName),
          lastName: getNullableStringArg(args.data.lastName),
          username: getNullableStringArg(args.data.username),
          email: getStringArg(args.data.email),
          birthDate: args.data.birthDate,
          status:
            args.data.status && hasRoles(ctx?.user, 'admin')
              ? args.data.status
              : undefined,
          role: args.data.role,
        },
      });
    },
  }),
);
