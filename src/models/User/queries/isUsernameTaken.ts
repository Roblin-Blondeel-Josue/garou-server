// Check if username is available

import { builder } from "../../../builder";
import { db } from "../../../db";

builder.queryField("isUsernameTaken", (t) =>
  t.field({
    type: "Boolean",
    args: {
      username: t.arg.string({
        required: true,
        validate: {
          minLength: 2,
          regex: /^[a-zA-Z0-9_]*$/,
        },
      }),
    },
    resolve: async (parent, args, ctx, info) => {
      const user = await db.user.findFirst({
        where: {
          username: {
            equals: args.username,
            mode: "insensitive",
          },
          id: {
            not: ctx.user?.id,
          },
        },
      });
      return !!user;
    },
  })
);
