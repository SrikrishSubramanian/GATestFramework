import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import sodium from 'libsodium-wrappers';
import { AUTH_STATE_PATH } from '../tests/utils/infra/persistent-context';

/**
 * Pushes the locally-generated .auth-state.json straight into the
 * AEM_AUTH_STATE_JSON GitHub Actions secret via the API, replacing the
 * "copy the file, paste it into GitHub Settings" manual step.
 *
 * Run scripts/generate-auth-state.ts first (completes MFA in a browser),
 * then run this script.
 *
 * Requires GITHUB_TOKEN in tests/environments/.env.local.credentials —
 * a PAT (classic "repo" scope, or fine-grained with this repo's
 * "Secrets: Read and write" permission).
 *
 * Usage: npx ts-node scripts/push-auth-secret.ts
 */

const REPO_OWNER = 'SrikrishSubramanian';
const REPO_NAME = 'GATestFramework';
const SECRET_NAME = 'AEM_AUTH_STATE_JSON';

dotenv.config({ path: path.resolve(__dirname, '..', 'tests', 'environments', '.env.local.credentials') });

async function githubRequest(pathSuffix: string, token: string, init?: RequestInit) {
  const res = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}${pathSuffix}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    throw new Error(`GitHub API ${pathSuffix} -> HTTP ${res.status}: ${await res.text()}`);
  }
  return res.status === 204 ? null : res.json();
}

async function main() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error('[push-auth-secret] GITHUB_TOKEN not set in tests/environments/.env.local.credentials');
    console.error('[push-auth-secret] Create a PAT with this repo\'s "Secrets: Read and write" permission and add:');
    console.error('  GITHUB_TOKEN=ghp_...');
    process.exit(1);
  }

  if (!fs.existsSync(AUTH_STATE_PATH)) {
    console.error(`[push-auth-secret] ${AUTH_STATE_PATH} not found — run scripts/generate-auth-state.ts first.`);
    process.exit(1);
  }

  const authState = fs.readFileSync(AUTH_STATE_PATH, 'utf-8');

  console.log('[push-auth-secret] Fetching repo public key...');
  const { key, key_id } = await githubRequest('/actions/secrets/public-key', token);

  await sodium.ready;
  const encryptedBytes = sodium.crypto_box_seal(
    sodium.from_string(authState),
    sodium.from_base64(key, sodium.base64_variants.ORIGINAL)
  );
  const encryptedValue = sodium.to_base64(encryptedBytes, sodium.base64_variants.ORIGINAL);

  console.log(`[push-auth-secret] Updating secret ${SECRET_NAME}...`);
  await githubRequest(`/actions/secrets/${SECRET_NAME}`, token, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ encrypted_value: encryptedValue, key_id }),
  });

  console.log(`[push-auth-secret] Done — ${SECRET_NAME} updated on ${REPO_OWNER}/${REPO_NAME}.`);
}

main().catch((err) => {
  console.error('[push-auth-secret] Failed:', err);
  process.exit(1);
});
