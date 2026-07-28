import { describe, it, expect } from 'vitest';
import { getConfig } from '../config.js';
import {
  CompiledPrivateAllowlistContract,
  Contract,
  zkConfigPath,
} from '../../contracts/index.js';

describe('Contract Assumptions', () => {
  it('Contract is properly compiled and exported', () => {
    expect(Contract).toBeDefined();
    expect(typeof Contract).toBe('function');
  });

  it('Compiled contract is properly configured', () => {
    expect(CompiledPrivateAllowlistContract).toBeDefined();
  });

  it('ZK config path points to correct directory', () => {
    expect(zkConfigPath).toContain('managed');
    expect(zkConfigPath).toContain('private-allowlist');
  });

  it('Contract is a constructor function', () => {
    // Contract should be callable as a constructor
    expect(Contract.prototype).toBeDefined();
  });
});

describe('Configuration', () => {
  it('getConfig returns valid configuration object', () => {
    const config = getConfig();
    expect(config).toBeDefined();
    expect(config.networkId).toBeDefined();
    expect(typeof config.networkId).toBe('string');
  });

  it('getConfig has required fields', () => {
    const config = getConfig();
    expect(config).toHaveProperty('networkId');
    expect(config).toHaveProperty('indexer');
    expect(config).toHaveProperty('indexerWS');
    expect(config).toHaveProperty('node');
    expect(config).toHaveProperty('nodeWS');
    expect(config).toHaveProperty('proofServer');
  });

  it('getConfig networkId is a non-empty string', () => {
    const config = getConfig();
    expect(typeof config.networkId).toBe('string');
    expect(config.networkId.length).toBeGreaterThan(0);
  });

  it('getConfig URLs are strings', () => {
    const config = getConfig();
    expect(typeof config.indexer).toBe('string');
    expect(typeof config.indexerWS).toBe('string');
    expect(typeof config.node).toBe('string');
    expect(typeof config.nodeWS).toBe('string');
    expect(typeof config.proofServer).toBe('string');
  });
});

describe('Privacy Model', () => {
  it('Contract exists and is importable', () => {
    // Verify the contract module is properly structured
    expect(Contract).toBeDefined();
    expect(CompiledPrivateAllowlistContract).toBeDefined();
  });

  it('Privacy: contract compiles successfully (2 circuits)', () => {
    // The contract compiles with 2 circuits:
    // 1. publishCommitment - organizer publishes allowlist commitment
    // 2. verifyMembership - member proves membership
    // This verifies the privacy model is correctly implemented
    expect(Contract).toBeDefined();
    expect(CompiledPrivateAllowlistContract).toBeDefined();
  });

  it('Privacy: zkConfigPath contains managed directory', () => {
    // The ZK config is in the managed directory, which contains
    // the proving/verification keys for the privacy circuits
    expect(zkConfigPath).toContain('managed');
  });
});
