import { str, envsafe, port } from "envsafe";
import { config } from "dotenv";
config();

export const env = envsafe({
  NODE_ENV: str({
    devDefault: "development",
    choices: ["development", "production"],
  }),
  PORT: port({
    default: 4000,
  }),
  DATABASE_URL: str({}),
  TOKEN_SECRET: str({}),
  ISSUER: str({}),
  APP_ENV: str({}),
  CLOUDINARY_API_KEY: str({}),
  CLOUDINARY_API_SECRET: str({}),
  FROM_EMAIL: str(),
  RESET_TOKEN_SECRET: str(),
});
