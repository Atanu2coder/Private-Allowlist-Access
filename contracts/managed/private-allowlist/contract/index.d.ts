export interface Ledger {
  allowlistCommitment: bigint;
  verifiedCount: bigint;
  lastActionStatus: boolean;
}

export declare function ledger(state: any): Ledger;

export declare class Contract {
  constructor(witnesses?: any);
}

export declare const pureCircuits: Record<string, any>;
export type ImpureCircuits = Record<string, any>;
export type PureCircuits = Record<string, any>;
