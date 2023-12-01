import { PrismaClient } from "@prisma/client";
import invariant from "tiny-invariant";
import chalk from "chalk";
import { env } from "./env";

function getClient() {
  if (process.env.FLY_REGION) {
    let DATABASE_URL = env.DATABASE_URL;
    invariant(typeof DATABASE_URL === "string", "DATABASE_URL env var not set");
    const databaseUrl = new URL(DATABASE_URL);
    const isLocalHost = databaseUrl.hostname === "localhost";
    const PRIMARY_REGION = isLocalHost ? null : process.env.PRIMARY_REGION;
    const FLY_REGION = isLocalHost ? null : process.env.FLY_REGION;
    if (FLY_REGION === "cdg") {
      DATABASE_URL = process.env?.DATABASE_URL_CDG || env.DATABASE_URL;
    } else if (FLY_REGION === "fra") {
      DATABASE_URL = process.env?.DATABASE_URL_FRA || env.DATABASE_URL;
    }
    console.log({ PRIMARY_REGION, FLY_REGION });
    console.log(
      `🔌 setting up prisma client in region ${FLY_REGION} to ${
        new URL(DATABASE_URL).hostname
      }`
    );
    const client = new PrismaClient({
      datasources: {
        db: {
          url: DATABASE_URL,
        },
      },
      log: [
        {
          level: "error",
          emit: "event",
        },
        {
          level: "query",
          emit: "event",
        },
        {
          level: "info",
          emit: "stdout",
        },
        {
          level: "warn",
          emit: "stdout",
        },
      ], //error
    });
    client.$on("query", (e) => {
      const color =
        e.duration < 30
          ? "green"
          : e.duration < 50
          ? "blue"
          : e.duration < 80
          ? "yellow"
          : e.duration < 100
          ? "redBright"
          : "red";
      const dur = chalk[color](`${e.duration}ms`);
      // console.log(`prisma:query - ${dur} - ${e.query}`);
    });
    client.$on("error", (e) => {
      if (e?.message?.includes("PreventCommandIfReadOnly")) return;
      console.log(chalk["red"](`prisma:error - ${e.message}`));
    });
    client.$connect();
    return client;
  } else {
    console.log(
      `🔌 setting up prisma client to ${new URL(env.DATABASE_URL).hostname}`
    );
    const client = new PrismaClient({
      datasources: {
        db: {
          url: env.DATABASE_URL,
        },
      },
      // log: ["info", "warn", "error", "query"],
    });
    client.$connect();
    return client;
  }
}

export const db = getClient();
