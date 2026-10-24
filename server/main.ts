import { createApp } from './app';
import { fileStorage } from './storage';

const PORT = 3130;

const storage = fileStorage(Bun.env['STATE_DIR'] ?? '.data');
createApp({ storage, initial: await storage.load() }).listen({
  port: PORT,
  maxRequestBodySize: 4 * 1024 * 1024,
});
console.log(`guiafp api on :${PORT}`);
