import fs from "fs";
import { exportJWK, exportPKCS8, generateKeyPair } from "jose";

async function main() {
  const keys = await generateKeyPair("RS256", { extractable: true });
  const privateKeyRaw = await exportPKCS8(keys.privateKey);
  const publicKey = await exportJWK(keys.publicKey);

  // Use literal \n inside the string
  const privateKey = privateKeyRaw.trimEnd().replace(/\n/g, "\\n");
  const jwks = JSON.stringify({ keys: [{ use: "sig", ...publicKey }] });

  let envLocal = "";
  if (fs.existsSync(".env.local")) {
    envLocal = fs.readFileSync(".env.local", "utf8");
  }

  // Remove any existing JWT_PRIVATE_KEY or JWKS lines
  const lines = envLocal.split("\n").filter((line) => {
    return !line.startsWith("JWT_PRIVATE_KEY=") && !line.startsWith("JWKS=");
  });

  lines.push(`JWT_PRIVATE_KEY="${privateKey}"`);
  lines.push(`JWKS=${jwks}`);

  fs.writeFileSync(".env.local", lines.join("\n"));
  console.log(".env.local updated successfully with literal \\n characters.");
}

main().catch(console.error);
