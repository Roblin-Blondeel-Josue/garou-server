import { DateTimeResolver } from "graphql-scalars";
import SchemaBuilder from "@pothos/core";
import { writeFile } from "node:fs/promises";
import { printSchema } from "graphql";

// import DataloaderPlugin from "@pothos/plugin-dataloader";
import PrismaPlugin from "@pothos/plugin-prisma";
import PrismaUtilsPlugin from "@pothos/plugin-prisma-utils";
import ComplexityPlugin from "@pothos/plugin-complexity";
import ScopeAuthPlugin from "@pothos/plugin-scope-auth";
import SimpleObjectsPlugin from "@pothos/plugin-simple-objects";
import ValidationPlugin from "@pothos/plugin-validation";
import type PrismaTypes from "@pothos/plugin-prisma/generated";
import { db } from "./db";
import { Context } from "./context";
import { GraphQLUpload, Upload } from "graphql-upload";
import { Prisma } from "@prisma/client";
import { hasRoles } from "./utils/hasRoles";

export const builder = new SchemaBuilder<{
  AuthScopes: {
    admin: boolean;
  };
  PrismaTypes: PrismaTypes;
  Context: Context;
  Scalars: {
    ID: {
      Output: string;
      Input: string;
    };
    DateTime: {
      Output: Date;
      Input: Date;
    };
    Upload: {
      Output: Upload;
      Input: Upload;
    };
    JSON: {
      Input: Prisma.JsonValue;
      Output: Prisma.JsonValue;
    };
  };
}>({
  plugins: [
    ScopeAuthPlugin,
    PrismaPlugin,
    ComplexityPlugin,
    PrismaUtilsPlugin,
    // DataloaderPlugin,
    SimpleObjectsPlugin,
    ValidationPlugin,
  ],
  authScopes: async (ctx) => ({
    admin: hasRoles(ctx?.user, "admin") ?? false,
  }),
  validationOptions: {
    validationError: (error) => {
      let message = "";
      for (const err of error?.errors) {
        message +=
          err.path[err.path.length > 0 ? err.path.length - 1 : 0] +
          ": " +
          err.message +
          ". ";
      }
      return message;
    },
  },
  complexity: {
    limit: {
      complexity: 4000,
      depth: 10,
      breadth: 60,
    },
  },
  prisma: {
    client: db,
    filterConnectionTotalCount: true,
  },
});

export const paginationArgs = (t: any) => ({
  take: t.arg.int({
    defaultValue: 20,
    required: false,
    validate: {
      max: 50,
    },
  }),
  skip: t.arg.int({ defaultValue: 0, required: false }),
});

export const paginationPrismaArgs = (args: any) => ({
  take: args?.take === 0 ? undefined : args?.take ?? 20,
  skip: args?.skip ?? 0,
});

builder.queryType({});
builder.mutationType({});

builder.addScalarType("DateTime", DateTimeResolver, {});
builder.addScalarType("Upload", GraphQLUpload, {});
builder.scalarType("JSON", {
  serialize: (value: any) => JSON.parse(JSON.stringify(value)),
  parseValue: (value: any) => JSON.parse(JSON.stringify(value)),
});

const schema = builder.toSchema();
