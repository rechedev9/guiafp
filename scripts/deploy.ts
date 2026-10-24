import { $ } from 'bun';
import { cp, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const host = 'openclaw';
const root = '/opt/guiafp';
// Unpacks next to the live files and checks the Caddyfile before the swap; the first deploy has no site to move.
const install = [
  `cd ${root}`,
  'rm -rf .next site.old',
  'mkdir .next',
  'tar -xzf - -C .next',
  `docker run --rm -v ${root}/.next:/c:ro caddy:2-alpine caddy validate --config /c/Caddyfile --adapter caddyfile`,
  'if cmp -s .next/Caddyfile Caddyfile; then web=0; else web=1; fi',
  'mkdir -p api state',
  'chown 1000:1000 state',
  'mv .next/api/server.js api/server.js',
  'mv .next/Caddyfile .next/compose.yaml .',
  '{ [ ! -e site ] || mv site site.old; }',
  'mv .next/site site',
  'rm -rf site.old .next',
  'docker compose up -d --remove-orphans',
  'docker compose restart api',
  '{ [ $web = 0 ] || docker compose restart web; }',
].join(' && ');

const stage = await mkdtemp(join(tmpdir(), 'guiafp-'));
await $`bun run build`;
await $`bun build server/main.ts --target=bun --outfile=${join(stage, 'api', 'server.js')}`;
await cp('dist', join(stage, 'site'), { recursive: true });
await cp('deploy/compose.yaml', join(stage, 'compose.yaml'));
await cp('deploy/Caddyfile', join(stage, 'Caddyfile'));
await $`tar -czf - -C ${stage} . | ssh ${host} ${install}`;
await rm(stage, { recursive: true });
console.log('Deployed to https://guiafp.rechedev.cloud');
