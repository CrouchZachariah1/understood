import fs from "node:fs";
import crypto from "node:crypto";

const secret = crypto.randomBytes(32).toString("base64url");
const body = [
  'DATABASE_URL="file:./dev.db"',
  `AUTH_SECRET="${secret}"`,
  'APP_URL="http://localhost:3000"',
  'NEXT_PUBLIC_APP_URL="http://localhost:3000"',
  'PAYMENT_PROVIDER="manual"',
  'ADMIN_EMAIL="owner@understood.co.za"',
  'ADMIN_PASSWORD="UnderstoodLaunch1!"',
  'OWNER_EMAIL="owner@understood.co.za"',
  "",
].join("\n");

fs.writeFileSync(".env", body);
const localPath = ".env.local";
const local = fs.existsSync(localPath) ? fs.readFileSync(localPath, "utf8") : "";
if (!local.includes("DATABASE_URL=")) {
  fs.appendFileSync(localPath, `\n${body}`);
}
console.log("Wrote .env and merged missing keys into .env.local");
