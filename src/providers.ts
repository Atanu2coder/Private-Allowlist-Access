import {
  initializeMidnightProviders,
  type EnvironmentConfiguration,
} from '@midnight-ntwrk/testkit-js';
import type { MidnightProviders, PrivateStateId } from '@midnight-ntwrk/midnight-js-types';
import type { Contract } from '../contracts/index.js';
import type { MidnightWalletProvider } from './wallet.js';

export type PrivateAllowlistProviders = MidnightProviders<
  'publishCommitment' | 'verifyMembership',
  PrivateStateId,
  Contract['privateState']
>;

export type HelloWorldProviders = PrivateAllowlistProviders;

export function buildProviders(
  walletProvider: MidnightWalletProvider,
  zkConfigPath: string,
  config: EnvironmentConfiguration,
): PrivateAllowlistProviders {
  return initializeMidnightProviders(walletProvider, config, {
    privateStateStoreName: 'private-allowlist-private-state',
    zkConfigPath,
  }) as PrivateAllowlistProviders;
}
