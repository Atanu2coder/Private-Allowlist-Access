import type { EnvironmentConfiguration } from '@midnight-ntwrk/testkit-js';

export type NetworkName = 'local' | 'preview' | 'preprod';

export interface PrivateAllowlistConfig extends EnvironmentConfiguration {
  readonly networkName: NetworkName;
}

const localConfig: PrivateAllowlistConfig = {
  networkName: 'local',
  walletNetworkId: 'undeployed',
  networkId: 'undeployed',
  indexer: 'http://127.0.0.1:8088/api/v4/graphql',
  indexerWS: 'ws://127.0.0.1:8088/api/v4/graphql/ws',
  node: 'http://127.0.0.1:9944',
  nodeWS: 'ws://127.0.0.1:9944',
  proofServer: 'http://127.0.0.1:6300',
  faucet: undefined,
};

const previewConfig: PrivateAllowlistConfig = {
  ...localConfig,
  networkName: 'preview',
  walletNetworkId: 'preview',
  networkId: 'preview',
  indexer: process.env['MIDNIGHT_PREVIEW_INDEXER'] ?? '',
  indexerWS: process.env['MIDNIGHT_PREVIEW_INDEXER_WS'] ?? '',
  node: process.env['MIDNIGHT_PREVIEW_NODE'] ?? '',
  nodeWS: process.env['MIDNIGHT_PREVIEW_NODE_WS'] ?? '',
  proofServer: process.env['MIDNIGHT_PREVIEW_PROOF_SERVER'] ?? '',
  faucet: process.env['MIDNIGHT_PREVIEW_FAUCET'],
};

const preprodConfig: PrivateAllowlistConfig = {
  ...localConfig,
  networkName: 'preprod',
  walletNetworkId: 'preprod',
  networkId: 'preprod',
  indexer: process.env['MIDNIGHT_PREPROD_INDEXER'] ?? '',
  indexerWS: process.env['MIDNIGHT_PREPROD_INDEXER_WS'] ?? '',
  node: process.env['MIDNIGHT_PREPROD_NODE'] ?? '',
  nodeWS: process.env['MIDNIGHT_PREPROD_NODE_WS'] ?? '',
  proofServer: process.env['MIDNIGHT_PREPROD_PROOF_SERVER'] ?? '',
  faucet: process.env['MIDNIGHT_PREPROD_FAUCET'],
};

export function getConfig(): PrivateAllowlistConfig {
  const network = (process.env['MIDNIGHT_NETWORK'] ?? 'local') as NetworkName;

  if (network === 'preview') return previewConfig;
  if (network === 'preprod') return preprodConfig;
  return localConfig;
}
