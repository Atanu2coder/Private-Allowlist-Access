// Generated Compact contract bindings for Private Allowlist Access

export function ledger(state) {
  return {
    allowlistCommitment: state?.allowlistCommitment ?? 0n,
    verifiedCount: state?.verifiedCount ?? 0n,
    lastActionStatus: state?.lastActionStatus ?? false,
  };
}

export class Contract {
  constructor(witnesses) {
    this.witnesses = witnesses;
  }
}

export const pureCircuits = {};
