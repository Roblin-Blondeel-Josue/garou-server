import { builder } from "../../../builder";

builder.mutationField("signOut", (t) =>
  t.field({
    type: "Boolean",
    resolve: async (parent, args, ctx, info) => {
      console.log("in sign out", ctx?.user?.email);
      console.log("session", ctx?.request?.session);
      console.log("session userId", ctx.request.session?.userId);
      if (ctx.request.session?.userId) {
        ctx.request.session.userId = undefined;
        ctx?.request?.session.save(function (err) {
          if (err) {
            console.error(err);
          }
          // regenerate the session, which is good practice to help
          // guard against forms of session fixation
          ctx?.request?.session.regenerate(function (err) {
            if (err) {
              console.error(err);
            }
          });
        });
      } else {
        return false;
      }
      return true;
    },
  })
);
