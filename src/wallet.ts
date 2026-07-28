import {
  MidnightWalletProvider as TestkitMidnightWalletProvider,
  syncWallet as syncTestkitWallet,
} from '@midnight-ntwrk/testkit-js';
import type { EnvironmentConfiguration } from '@midnight-ntwrk/testkit-js';
import type { Logger } from 'pino';
import type { WalletFacade } from '@midnight-ntwrk/wallet-sdk';

export type WalletSecret =
  | { readonly kind: 'seed'; readonly value: string }
  | { readonly kind: 'mnemonic'; readonly value: string };

export type MidnightWalletProvider = TestkitMidnightWalletProvider;

export const MidnightWalletProvider = {
  build(
    logger: Logger,
    env: EnvironmentConfiguration,
    secret: WalletSecret,
  ): Promise<TestkitMidnightWalletProvider> {
    if (secret.kind === 'mnemonic') {
      throw new Error('Mnemonic wallet construction is not supported by this test wrapper.');
    }

    return TestkitMidnightWalletProvider.build(logger, env, secret.value);
  },
};

export async function syncWallet(
  logger: Logger,
  wallet: WalletFacade,
  timeoutMs: number,
): Promise<void> {
  logger.info(`Syncing wallet for up to ${timeoutMs}ms...`);
  await syncTestkitWallet(wallet, 1000, timeoutMs);
}
