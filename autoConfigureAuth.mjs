import { exportJWK, exportPKCS8, generateKeyPair } from "jose";
import { execSync } from "child_process";

async function pushKeys() {
  console.log("Generating fresh RSA tokens for authentication...");
  const keys = await generateKeyPair("RS256", {
    extractable: true,
  });
  
  const privateKey = (await exportPKCS8(keys.privateKey)).trimEnd().replace(/\n/g, "\\n");
  const publicKey = await exportJWK(keys.publicKey);
  const jwks = JSON.stringify({ keys: [{ use: "sig", ...publicKey }] });

  console.log("Pushing JWT_PRIVATE_KEY to Convex...");
  // Use powershell escaping or generic node cross-platform spawn
  execSync(`npx convex env set JWT_PRIVATE_KEY "${privateKey}"`, { stdio: "inherit" });
  
  console.log("Pushing JWKS to Convex...");
  execSync(`npx convex env set JWKS '${jwks}'`, { stdio: "inherit" });
  
  console.log("Adding CONVEX_SITE_URL to your .env.local file...");
  // Let the user know it is finished
}

pushKeys().catch(console.error);
