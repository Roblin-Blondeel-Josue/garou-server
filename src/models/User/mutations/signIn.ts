import { builder } from "../../../builder";
import { db } from "../../../db";
import { cleanEmail } from "../../../utils/cleanEmail";
import { sign } from "jsonwebtoken";
import { compare } from "bcrypt";
import { env } from "../../../env";
import { AuthPayload } from "../../AuthPayload";

builder.mutationField("signIn", (t) =>
  t.field({
    type: AuthPayload,
    args: {
      email: t.arg.string({
        required: true,
        validate: {
          email: true,
        },
      }),
      password: t.arg.string({
        required: true,
        validate: {
          minLength: 8,
        },
      }),
    },
    resolve: async (parent, args, ctx, info) => {
      console.log("signInUser " + args.email + "\rip: " + ctx.ip);
      if (!args.email || args.email === "")
        throw new Error("Login failed; Invalid user ID or password.");
      if (!args.password || args.password === "")
        throw new Error("Login failed; Invalid user ID or password.");
      const email = cleanEmail(args.email);
      const user = await db.user.findUnique({
        where: {
          email,
        },
      });
      if (!user) throw new Error("Login failed; Invalid user ID or password.");
      if (!user.password || user.password === "")
        throw new Error("Login failed; Invalid user ID or password.");
      const passwordValid = await compare(args.password, user.password);
      if (!passwordValid)
        throw new Error("Login failed; Invalid user ID or password.");
      if (ctx?.request?.session) {
        ctx.request.session.userId = user.id;
        ctx.request.session.save();
      }
      return {
        token: sign({ userId: user.id }, env.TOKEN_SECRET, {
          issuer: env.ISSUER,
        }),
      };
    },
  })
);
