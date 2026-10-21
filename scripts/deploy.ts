import { $ } from 'bun';

const host = 'openclaw';
const site = '/opt/guiafp/site';
// Unpack next to the live folder, then swap; the first deploy has no site to move.
const install = [
  `rm -rf ${site}.next ${site}.old`,
  `mkdir ${site}.next`,
  `tar -xzf - -C ${site}.next`,
  `{ [ ! -e ${site} ] || mv ${site} ${site}.old; }`,
  `mv ${site}.next ${site}`,
  `rm -rf ${site}.old`,
].join(' && ');

await $`bun run build`;
await $`tar -czf - -C dist . | ssh ${host} ${install}`;
console.log('Deployed to https://guiafp.rechedev.cloud');
