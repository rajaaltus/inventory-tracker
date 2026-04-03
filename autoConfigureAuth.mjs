import { exportJWK, exportPKCS8, generateKeyPair } from "jose";
import { execFileSync } from "child_process";

async function pushKeys() {
  console.log("Generating fresh RSA tokens for authentication...");
  const keys = await generateKeyPair("RS256", {
    extractable: true,
  });

  const privateKey = (await exportPKCS8(keys.privateKey)).trimEnd().replace(/\n/g, "\\n");
  const publicKey = await exportJWK(keys.publicKey);
  const jwks = JSON.stringify({ keys: [{ use: "sig", ...publicKey }] });

  console.log("Pushing JWT_PRIVATE_KEY to Convex...");
  execFileSync("npx", ["convex", "env", "set", "JWT_PRIVATE_KEY", privateKey], { stdio: "inherit" });

  console.log("Pushing JWKS to Convex...");
  execFileSync("npx", ["convex", "env", "set", "JWKS", jwks], { stdio: "inherit" });

  console.log("Auth keys configured successfully.");
}

pushKeys().catch(console.error);
