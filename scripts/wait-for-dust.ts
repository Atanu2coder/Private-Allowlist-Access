import pino from 'pino';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { firstValueFrom, throwError } from 'rxjs';
import { filter, take, tap, timeout } from 'rxjs/operators';
import { getConfig } from '../src/config.js';
import { MidnightWalletProvider, syncWallet } from '../src/wallet.js';

const ALICE_SEED =
  '0000000000000000000000000000000000000000000000000000000000000001';

const logger = pino({
  level: process.env['LOG_LEVEL'] ?? 'info',
  transport: { target: 'pino-pretty' },
});

function envInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;

  const value = Number(raw);
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${name} must be a positive integer, got '${raw}'`);
  }
  return value;
}

const minCoins = envInt('WAIT_FOR_DUST_MIN_COINS', 1);
const timeoutMs = envInt('WAIT_FOR_DUST_TIMEOUT_MS', 180_000);
const config = getConfig();

setNetworkId(config.networkId);

const wallet = await MidnightWalletProvider.build(logger, config, {
  kind: 'seed',
  value: ALICE_SEED,
});

logger.info(`Waiting for Alice to have at least ${minCoins} DUST coin(s)`);
await wallet.start();

try {
  await syncWallet(logger, wallet.wallet, timeoutMs);
  await firstValueFrom(
    wallet.wallet.state().pipe(
      tap((state) =>
        logger.info(
          `dust: ${state.dust.availableCoins.length} coin(s), balance ${state.dust.balance(new Date())} STAR`,
        ),
      ),
      filter((state) => state.dust.availableCoins.length >= minCoins),
      take(1),
      timeout({
        each: timeoutMs,
        with: () =>
          throwError(
            () => new Error(`No spendable DUST coin within ${timeoutMs}ms`),
          ),
      }),
    ),
  );
  logger.info('DUST ready');
} catch (err) {
  logger.error(
    `wait-for-dust failed: ${err instanceof Error ? err.stack ?? err.message : String(err)}`,
  );
  process.exitCode = 1;
} finally {
  await wallet.stop().catch((err: unknown) =>
    logger.warn(`stop() failed: ${String(err)}`),
  );
}
