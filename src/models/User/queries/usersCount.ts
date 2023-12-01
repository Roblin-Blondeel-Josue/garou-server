import { builder } from "../../../builder";
import { db } from "../../../db";
import { WhereUser, WhereUserInput } from "./users";

builder.queryField("usersCount", (t) =>
  t.int({
    args: {
      where: t.arg({ type: WhereUserInput }),
    },
    resolve: async (parent, args, ctx, info) => {
      let where = WhereUser(args, ctx);
      return db.user.count({
        where: {
          ...where,
        },
      });
    },
  })
);
