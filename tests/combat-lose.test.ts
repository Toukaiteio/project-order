import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const gameStorePath = path.resolve(__dirname, '../src/stores/game.ts');
let gameStoreContent = fs.readFileSync(gameStorePath, 'utf8');

// Replace imports with relative paths to our mocks
gameStoreContent = gameStoreContent.replace(/from 'pinia'/g, "from './mocks/pinia.js'");
gameStoreContent = gameStoreContent.replace(/from '.\/schedule'/g, "from './mocks/schedule.js'");

const tempGameStorePath = path.resolve(__dirname, 'game.runner.ts');
fs.writeFileSync(tempGameStorePath, gameStoreContent);

// Mock environment
globalThis.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
  key: () => null,
  length: 0,
};

test('Combat Lose State', async () => {
  const { useGameStore } = await import('./game.runner.ts');
  const store = useGameStore();

  // Setup: Player is almost dead and in combat
  store.combat.active = true;
  store.combat.enemyName = 'Test Enemy';
  store.combat.enemyAtk = 100;
  store.combat.enemyHp = 1000;
  store.player.stats.hp = 1;
  store.player.stats.strength = 1;
  store.player.stats.sanity = 100;

  // Action: Process a turn where player takes damage
  const result = store.processCombatTurn('atk');

  // Assertions
  assert.strictEqual(result, 'lose', 'Combat should return "lose" when player HP <= 0');
  assert.strictEqual(store.combat.active, false, 'Combat should be deactivated on loss');
  assert.strictEqual(store.player.stats.hp <= 0, true, 'Player HP should be 0 or less');

  const lastLog = store.logs[store.logs.length - 1];
  assert.ok(lastLog, 'Should have at least one log entry');
  assert.strictEqual(lastLog.text, '你倒下了……', 'Should log the falling message');
  assert.strictEqual(lastLog.type, 'danger', 'Log type should be "danger"');

  // Clean up
  fs.unlinkSync(tempGameStorePath);
});
