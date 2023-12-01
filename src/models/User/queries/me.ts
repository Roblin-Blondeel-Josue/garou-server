import { builder } from "../../../builder";
import { db } from "../../../db";
import { hasRoles } from "../../../utils/hasRoles";

builder.queryField("me", (t) =>
  t.prismaField({
    type: "User",
    nullable: true,
    resolve: async (query, parent, args, ctx, info) => {
      if (!ctx?.user) return null;
      return db.user.findUnique({ ...query, where: { id: ctx.user.id } });
    },
  })
);
