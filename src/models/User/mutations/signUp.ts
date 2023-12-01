import { builder } from "../../../builder";
import { db } from "../../../db";
import { cleanEmail } from "../../../utils/cleanEmail";
import { sign } from "jsonwebtoken";
import { AuthPayload } from "../../AuthPayload";
import { hash } from "bcrypt";
import { env } from "../../../env";

builder.mutationField("signUp", (t) =>
  t.field({
    type: AuthPayload,
    args: {
      email: t.arg.string({
        required: true,
        validate: {
          email: true,
        },
      }),
      username: t.arg.string({
        required: false,
        validate: {
          minLength: 1,
          maxLength: 15,
        },
      }),
      password: t.arg.string({
        required: true,
        validate: {
          minLength: 8,
        },
      }),
      firstName: t.arg.string({
        required: true,
        validate: {
          minLength: 1,
        },
      }),
      lastName: t.arg.string({
        required: true,
        validate: {
          minLength: 1,
        },
      }),
    },
    resolve: async (parent, args, ctx, info) => {
      console.log("signUpUser " + args.email + "\rip: " + ctx.ip);
      if (!args.email || args.email === "")
        throw new Error("Login failed; Invalid user or password.");
      if (!args.password || args.password === "")
        throw new Error("Login failed; Invalid user or password.");
      const email = cleanEmail(args.email);
      let user = await db.user.findUnique({
        where: {
          email,
        },
      });
      if (user) throw new Error("Login failed; Invalid user or password.");
      const hashedPassword = await hash(args.password, 10);
      user = await db.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName: args.firstName,
          lastName: args.lastName,
          stats: {
            create: {},
          },
        },
      });
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
