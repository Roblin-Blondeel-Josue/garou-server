import { builder } from "../../../builder";
import { db } from "../../../db";
import { hasRoles } from "../../../utils/hasRoles";

builder.mutationField("deleteUser", (t) =>
  t.prismaField({
    type: "User",
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (query, parent, args, ctx, info) => {
      // Check if the user is authenticated
      if (!ctx?.user?.id) throw new Error("Not authenticated");
      // Check if the user is authorized
      if (!(hasRoles(ctx?.user, "admin") || args.id === ctx?.user?.id))
        throw new Error("Not authorized");
      return db.user.delete({
        where: {
          id: args.id,
        },
        ...query,
      });
    },
  })
);
