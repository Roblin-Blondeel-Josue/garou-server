import { builder } from "../../../builder";
import { db } from "../../../db";
import { hash, compare } from "bcrypt";

builder.mutationField("updatePassword", (t) =>
  t.prismaField({
    type: "User",
    args: {
      oldPassword: t.arg.string({ required: true }),
      newPassword: t.arg.string({ required: true }),
    },
    resolve: async (query, parent, args, ctx, info) => {
      if (!ctx?.user?.id) throw new Error("Not authorized");

      // Fetch user by id
      const user = await db.user.findUnique({
        where: {
          id: ctx.user.id,
        },
        select: {
          password: true,
        },
      });

      if (!user) throw new Error("User not found");

      // Compare old password with the stored password
      const isOldPasswordCorrect = await compare(
        args.oldPassword,
        user.password as string
      );

      if (!isOldPasswordCorrect) throw new Error("Old password is incorrect");

      // Update password
      const newPasswordHash = await hash(args.newPassword, 10);

      return db.user.update({
        where: {
          id: ctx.user.id,
        },
        data: {
          password: newPasswordHash,
        },
        ...query,
      });
    },
  })
);
