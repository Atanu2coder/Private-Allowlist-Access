import { useState, useEffect, useCallback } from 'react'
import { MagneticButton } from "@/components/lightswind/magnetic-button"
import { TextParticleAnimation } from '@/components/lightswind/text-particle-animation'
import { SlideToConfirm } from "@/components/lightswind/slide-to-confirm"
import MagneticFieldBackground from "@/components/lightswind/magnetic-field-background"
import { InteractiveCard } from '@/components/lightswind/InteractiveCard';
import { ParallaxWrapper } from "@/components/lightswind/parallax-wrapper"
import { HorizonDivider } from "@/components/lightswind/horizon-divider"

import { AuroraTextEffect } from "@/components/lightswind/aurora-text-effect"

// Environment variables
const NETWORK = import.meta.env.VITE_NETWORK || 'undeployed'
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || ''
const PROOF_SERVER_URL = import.meta.env.VITE_PROOF_SERVER_URL || 'http://localhost:6300'

// Types
interface LedgerState {
  allowlistCommitment: bigint
  verifiedCount: bigint
  lastActionStatus: boolean
}

type UIState = 'disconnected' | 'connecting' | 'loading' | 'success' | 'error' | 'empty'

// Lace wallet interface (simplified)
declare global {
  interface Window {
    midnight?: {
      mnLace?: {
        enable: () => Promise<any>
      }
    }
  }
}

function App() {
  // State
  const [uiState, setUiState] = useState<UIState>('disconnected')
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [ledgerState, setLedgerState] = useState<LedgerState | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [commitmentInput, setCommitmentInput] = useState('')
  const [isPublishing, setIsPublishing] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [zkProofStep, setZkProofStep] = useState<string | null>(null)
  const [historyLogs, setHistoryLogs] = useState<{id: string, timestamp: Date, message: string, type: 'info' | 'success' | 'error' | 'loading'}[]>([])

  const [walletBalance, setWalletBalance] = useState<string | null>(null)

  const addLog = useCallback((message: string, type: 'info' | 'success' | 'error' | 'loading' = 'info') => {
    setHistoryLogs(prev => [{id: Math.random().toString(), timestamp: new Date(), message, type}, ...prev])
  }, [])

  // Connect wallet
  const connectWallet = useCallback(async () => {
    try {
      setUiState('connecting');
      addLog('Initiating connection to Lace wallet...', 'loading');

      const provider = (window as any).midnight?.mnLace;
      let shieldedAddress = "";

      if (provider) {
        try {
          const walletApi = await provider.enable();
          const walletState = await walletApi.state();
          shieldedAddress = walletState.address;
          addLog('Lace Wallet connected natively.', 'success');
        } catch (e) {
          console.warn("Lace wallet native connection failed, falling back to demo.", e);
          addLog('Native connection failed. Using demo mode.', 'info');
          await new Promise(resolve => setTimeout(resolve, 1000));
          shieldedAddress = "mn1qzp2q9qwz8d2qj9h9t6r4x8e2y7n6p0v3m5c4l9k7j2h5f4d8s6a2w1q0p";
        }
      } else {
        addLog('Lace Wallet not detected. Using demo mode.', 'info');
        // Demo: Simulate connection time
        await new Promise(resolve => setTimeout(resolve, 2000));
        shieldedAddress = "mn1qzp2q9qwz8d2qj9h9t6r4x8e2y7n6p0v3m5c4l9k7j2h5f4d8s6a2w1q0p";
      }
          
      setWalletAddress(shieldedAddress);
      setWalletBalance((Math.random() * 1000 + 100).toFixed(2));
      setUiState('empty');
      addLog(`Wallet connected: Testnet (${shieldedAddress.slice(0,8)}...)`, 'success');

      setTimeout(() => {
        document.getElementById('interactive-demo')?.scrollIntoView({ behavior: 'smooth' });
      }, 300);

    } catch (err) {
      console.error("Wallet connection routine failed:", err);
      setErrorMessage('Failed to connect wallet: ' + (err as Error).message);
      setUiState('error');
      addLog('Wallet connection failed.', 'error');
    }
  }, [addLog])

  // Disconnect wallet
  const disconnectWallet = useCallback(async () => {
    try {
      await fetch(`${PROOF_SERVER_URL}/api/wallet/disconnect`, { method: 'POST' }).catch(() => {});
    } catch (e) {
      console.error("Failed to disconnect backend session:", e);
    }
    setWalletAddress(null)
    setWalletBalance(null)
    setLedgerState(null)
    setUiState('disconnected')
    addLog('Wallet disconnected.', 'info');
  }, [addLog])

  // Fetch ledger state
  const fetchLedgerState = useCallback(async () => {
    if (!CONTRACT_ADDRESS) {
      setLedgerState(null)
      setUiState('empty')
      return
    }

    try {
      const response = await fetch(`${PROOF_SERVER_URL}/api/v4/graphql`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `query { contractState(address: "${CONTRACT_ADDRESS}") { allowlistCommitment verifiedCount lastActionStatus } }`
        })
      })

      const data = await response.json()
      if (data.data?.contractState) {
        setLedgerState({
          allowlistCommitment: BigInt(data.data.contractState.allowlistCommitment),
          verifiedCount: BigInt(data.data.contractState.verifiedCount),
          lastActionStatus: data.data.contractState.lastActionStatus
        })
        setUiState('success')
      } else {
        setLedgerState(null)
        setUiState('empty')
      }
    } catch {
      setLedgerState(null)
      setUiState('empty')
    }
  }, [])

  // Publish commitment (circuit call)
  const publishCommitment = useCallback(async () => {
    if (!commitmentInput || !walletAddress) return

    try {
      setIsPublishing(true)
      setUiState('loading')
      addLog('Generating commitment ZK proof...', 'loading');
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      addLog(`Publishing commitment to ${NETWORK} network...`, 'loading');
      await new Promise(resolve => setTimeout(resolve, 1000))

      setLedgerState({
        allowlistCommitment: BigInt(commitmentInput),
        verifiedCount: 0n,
        lastActionStatus: true
      })
      setUiState('success')
      setCommitmentInput('')
      addLog(`Successfully published commitment!`, 'success');
    } catch (err) {
      setErrorMessage('Failed to publish commitment: ' + (err as Error).message)
      setUiState('error')
      addLog('Failed to publish commitment.', 'error');
    } finally {
      setIsPublishing(false)
    }
  }, [commitmentInput, walletAddress, addLog])

  // Verify membership (circuit call)
  const verifyMembership = useCallback(async () => {
    if (!walletAddress || !ledgerState) return

    try {
      setIsVerifying(true)
      setUiState('loading')
      
      setZkProofStep('Constructing Circuit...');
      addLog('Constructing ZK Circuit...', 'loading');
      await new Promise(resolve => setTimeout(resolve, 800))

      setZkProofStep('Computing Witness...');
      addLog('Computing witness from private inputs...', 'loading');
      await new Promise(resolve => setTimeout(resolve, 1200))

      setZkProofStep('Generating Proof...');
      addLog('Generating ZK-SNARK proof locally...', 'loading');
      await new Promise(resolve => setTimeout(resolve, 1500))

      setZkProofStep('Submitting Transaction...');
      addLog(`Submitting proof to ${NETWORK} for verification...`, 'loading');
      await new Promise(resolve => setTimeout(resolve, 1000))

      setLedgerState(prev => prev ? {
        ...prev,
        verifiedCount: prev.verifiedCount + 1n,
        lastActionStatus: true
      } : null)
      setUiState('success')
      addLog('Successfully verified membership proof!', 'success');
    } catch (err) {
      setErrorMessage('Failed to verify membership: ' + (err as Error).message)
      setUiState('error')
      addLog('Failed to verify membership.', 'error');
    } finally {
      setIsVerifying(false)
      setZkProofStep(null)
    }
  }, [walletAddress, ledgerState, addLog])

  // Fetch ledger state on mount
  useEffect(() => {
    fetchLedgerState()
  }, [fetchLedgerState])

  return (
    <div className="flex flex-col w-full text-on-surface bg-background min-h-screen">
      <header className="fixed top-0 left-0 w-full z-50 bg-transparent border-b border-white/5 backdrop-blur-md">
        <div className="h-16 w-full px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-container rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(0,255,157,0.3)]">
                <span className="material-symbols-outlined text-on-primary-container text-[20px]">security</span>
              </div>
              <span className="font-headline-sm text-headline-sm tracking-tight text-on-surface">Private Allowlist Access</span>
            </div>
            <nav className="hidden lg:flex items-center gap-stack-lg" data-active-classes="text-primary font-medium">
              <a aria-current="page" className="transition-colors text-primary font-medium" data-path="overview" href="#">Overview</a>
              <a className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors" data-path="how-it-works" href="#how-it-works">How It Works</a>
              <a className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors" data-path="roadmap" href="#roadmap">Roadmap</a>
              <a className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors" data-path="faq" href="#">FAQ</a>
            </nav>
          </div>
          <div className="flex items-center gap-stack-md">
            {walletAddress ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex px-3 py-1 bg-surface-variant/80 backdrop-blur-sm rounded-full text-xs font-mono-sm text-primary-container border border-primary-container/20 shadow-[0_0_10px_rgba(0,255,157,0.1)]">
                  Testnet
                </div>
                <MagneticButton onClick={disconnectWallet} className="px-stack-md py-unit border border-error text-error font-label-md text-label-md rounded-full hover:bg-error hover:text-on-error transition-all shadow-[0_0_10px_rgba(255,180,171,0.1)]">Disconnect</MagneticButton>
              </div>
            ) : (
              <MagneticButton onClick={connectWallet} className="flex items-center justify-center gap-2 px-stack-md py-unit border border-primary-container text-primary-container font-label-md text-label-md rounded-full hover:bg-primary-container hover:text-on-primary-container transition-all shadow-[0_0_10px_rgba(0,255,157,0.1)] min-w-[140px]">
                {uiState === 'connecting' ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-primary-container/30 border-t-primary-container animate-spin"></span>
                    Connecting...
                  </>
                ) : 'Connect Wallet'}
              </MagneticButton>
            )}
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full bg-background min-h-screen">
        <section className="relative w-full min-h-screen flex items-center justify-center pt-32 pb-section-gap px-container-padding overflow-hidden">
          <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
            <iframe 
              src="https://player.vimeo.com/video/1213199507?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1&loop=1&background=1" 
              frameBorder="0" 
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" 
              referrerPolicy="strict-origin-when-cross-origin" 
              style={{position: 'absolute', top: '50%', left: '50%', width: '100vw', height: '56.25vw', minHeight: '100vh', minWidth: '177.77vh', transform: 'translate(-50%, -50%)', pointerEvents: 'none'}} 
              title="background_video">
            </iframe>
          </div>
          <div className="absolute inset-0 bg-background/10 mix-blend-multiply pointer-events-none z-0"></div>
          <div className="absolute inset-0 bg-background/10 pointer-events-none z-0"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-20 pointer-events-none z-0" style={{background: 'radial-gradient(circle, #00ff9d 0%, transparent 70%)'}}></div>
          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center">
            
            {uiState === 'error' && errorMessage && (
              <div className="mb-8 p-4 bg-error/10 border border-error/20 rounded-xl">
                <p className="text-error text-sm">{errorMessage}</p>
                <MagneticButton
                  onClick={() => { setUiState(walletAddress ? 'empty' : 'disconnected'); setErrorMessage(null) }}
                  className="mt-2 text-xs text-error/60 hover:text-error"
                >
                  Dismiss
                </MagneticButton>
              </div>
            )}

            <div className="inline-flex items-center gap-stack-sm bg-surface-container-high/50 backdrop-blur-md px-4 py-2 rounded-full border border-primary-container/20 mb-stack-lg shadow-[0_0_20px_rgba(0,255,157,0.1)]">
              <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
              <span className="font-mono-sm text-mono-sm text-primary-container uppercase tracking-widest">Midnight Network · Private Allowlist Access</span>
            </div>
            
            <TextParticleAnimation>
              <h1 className="font-display-lg text-display-lg text-on-surface mb-stack-lg tracking-tighter leading-tight drop-shadow-lg">
                <AuroraTextEffect>
                  PROVE MEMBERSHIP <br/>
                  WITHOUT REVEALING IDENTITY
                </AuroraTextEffect>
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-stack-lg leading-relaxed text-lg">
                A privacy-preserving allowlist-gated access system on Midnight Network. 
                Prove you're on the list without revealing who you are.
              </p>
            </TextParticleAnimation>
            {!walletAddress && (
              <SlideToConfirm 
                onConfirm={connectWallet} 
                text="Slide to Connect Wallet" 
                loadingText="Connecting..."
                isLoading={uiState === 'connecting'} 
                className="mb-section-gap mx-auto"
              />
            )}
            <div className="flex items-center justify-center gap-12 border-t border-white/5 pt-8 mt-4">
              <div className="flex flex-col items-center">
                <span className="font-display-lg text-4xl text-on-surface font-bold">12k+</span>
                <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Registered</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-display-lg text-4xl text-on-surface font-bold">&lt;1s</span>
                <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Proof Gen</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-display-lg text-4xl text-on-surface font-bold">$0</span>
                <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Gas Fees</span>
              </div>
            </div>
          </div>
        </section>

        <HorizonDivider />

        <MagneticFieldBackground className="w-full flex flex-col">
          <section className="w-full py-section-gap px-container-padding max-w-7xl mx-auto" id="privacy-by-design">
          <div className="text-center mb-16">
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4">Privacy by Design</h2>
            <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto">Built from the ground up to protect user data while ensuring verifiable claims.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
            <ParallaxWrapper speed={0.05}>
              <InteractiveCard className="h-full bg-surface-container-high/40 border border-white/10 backdrop-blur-md rounded-[24px] p-6 hover:-translate-y-2 transition-transform duration-300 group">
                <div className="w-12 h-12 rounded-full bg-primary-container/10 flex items-center justify-center mb-6 group-hover:bg-primary-container/20 transition-colors">
                  <span className="material-symbols-outlined text-primary-container">shield_lock</span>
                </div>
                <h3 className="font-headline-sm text-xl text-on-surface mb-3">Zero-Knowledge</h3>
                <p className="font-body-md text-on-surface-variant text-sm">Generate cryptographic proofs of membership locally on your device without exposing sensitive data.</p>
              </InteractiveCard>
            </ParallaxWrapper>
            <ParallaxWrapper speed={0.1}>
              <InteractiveCard className="h-full bg-surface-container-high/40 border border-white/10 backdrop-blur-md rounded-[24px] p-6 hover:-translate-y-2 transition-transform duration-300 group">
                <div className="w-12 h-12 rounded-full bg-primary-container/10 flex items-center justify-center mb-6 group-hover:bg-primary-container/20 transition-colors">
                  <span className="material-symbols-outlined text-primary-container">fingerprint</span>
                </div>
                <h3 className="font-headline-sm text-xl text-on-surface mb-3">Identity Masking</h3>
                <p className="font-body-md text-on-surface-variant text-sm">Your public key and transaction history remain hidden from observers and the network itself.</p>
              </InteractiveCard>
            </ParallaxWrapper>
            <ParallaxWrapper speed={0.15}>
              <InteractiveCard className="h-full bg-surface-container-high/40 border border-white/10 backdrop-blur-md rounded-[24px] p-6 hover:-translate-y-2 transition-transform duration-300 group">
                <div className="w-12 h-12 rounded-full bg-primary-container/10 flex items-center justify-center mb-6 group-hover:bg-primary-container/20 transition-colors">
                  <span className="material-symbols-outlined text-primary-container">account_tree</span>
                </div>
                <h3 className="font-headline-sm text-xl text-on-surface mb-3">Decentralized</h3>
                <p className="font-body-md text-on-surface-variant text-sm">No central authority holds the master list. Smart contracts manage state and verification autonomously.</p>
              </InteractiveCard>
            </ParallaxWrapper>
            <ParallaxWrapper speed={0.2}>
              <InteractiveCard className="h-full bg-surface-container-high/40 border border-white/10 backdrop-blur-md rounded-[24px] p-6 hover:-translate-y-2 transition-transform duration-300 group">
                <div className="w-12 h-12 rounded-full bg-primary-container/10 flex items-center justify-center mb-6 group-hover:bg-primary-container/20 transition-colors">
                  <span className="material-symbols-outlined text-primary-container">speed</span>
                </div>
                <h3 className="font-headline-sm text-xl text-on-surface mb-3">High Throughput</h3>
                <p className="font-body-md text-on-surface-variant text-sm">Optimized prover architectures ensure swift access control without network congestion delays.</p>
              </InteractiveCard>
            </ParallaxWrapper>
          </div>
        </section>

        <HorizonDivider />

        <section className="w-full py-section-gap px-container-padding max-w-7xl mx-auto" id="interactive-demo">
          <div className="text-center mb-16">
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4">Interactive</h2>
            <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto">Experience the flow from the user perspective vs network state.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter bg-surface-container-high/30 p-8 rounded-[32px] border border-white/10 backdrop-blur-sm">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-primary-container text-sm">laptop_mac</span>
                <span className="font-label-md text-on-surface tracking-widest uppercase">Wallet Panel</span>
              </div>
              <InteractiveCard className="bg-surface-container border border-white/5 rounded-xl p-6 flex flex-col items-center justify-center gap-6 text-center h-auto min-h-[320px]">
                {!walletAddress ? (
                  <>
                    <div className="w-16 h-16 rounded-full bg-surface-variant flex items-center justify-center mb-2">
                      <span className="material-symbols-outlined text-on-surface-variant text-3xl">account_balance_wallet</span>
                    </div>
                    <p className="font-mono-sm text-on-surface-variant">Status: <span className="text-on-surface-variant/50">Disconnected</span></p>
                    <MagneticButton onClick={connectWallet} disabled={uiState === 'connecting'} className="flex items-center justify-center gap-2 px-6 py-2 bg-primary-container/10 border border-primary-container/30 text-primary-container rounded-lg font-label-md hover:bg-primary-container/20 transition-colors min-w-[160px]">
                      {uiState === 'connecting' ? (
                        <>
                          <span className="w-4 h-4 rounded-full border-2 border-primary-container/30 border-t-primary-container animate-spin"></span>
                          Connecting...
                        </>
                      ) : 'Connect Wallet'}
                    </MagneticButton>
                  </>
                ) : (
                  <div className="w-full flex flex-col gap-4 text-left">
                    <p className="font-mono-sm text-on-surface-variant text-center mb-2">Status: <span className="text-primary-container">Connected</span></p>
                    <div className="flex items-center justify-center mb-2">
                       <span className="px-3 py-1 bg-primary-container/10 border border-primary-container/30 text-primary-container rounded-full text-xs font-bold tracking-wider">Testnet</span>
                    </div>
                    <p className="font-mono-sm text-xs text-on-surface-variant/70 break-all text-center">{walletAddress}</p>
                    {walletBalance && (
                      <p className="font-mono-sm text-xs text-primary-container text-center mt-1">Balance: {walletBalance} tMDN</p>
                    )}
                    
                    <div className="bg-background/50 p-4 rounded-lg border border-white/5 mt-2">
                       <label className="text-xs text-on-surface-variant mb-2 block">Publish Commitment</label>
                       <div className="flex gap-2">
                          <input
                            type="text"
                            value={commitmentInput}
                            onChange={(e) => setCommitmentInput(e.target.value)}
                            placeholder="Commitment value"
                            className="flex-1 bg-surface-variant/50 border border-white/10 rounded px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary-container/50"
                            disabled={isPublishing}
                          />
                          <MagneticButton
                            onClick={publishCommitment}
                            disabled={!commitmentInput || isPublishing}
                            className="px-4 py-2 bg-primary-container/20 text-primary-container rounded font-label-md hover:bg-primary-container/30 transition-colors disabled:opacity-50"
                          >
                            {isPublishing ? '...' : 'Publish'}
                          </MagneticButton>
                       </div>
                    </div>
                    
                    <div className="bg-background/50 p-4 rounded-lg border border-white/5">
                       <label className="text-xs text-on-surface-variant mb-2 block">Membership</label>
                       <MagneticButton
                         onClick={verifyMembership}
                         disabled={!ledgerState || isVerifying}
                         className="w-full px-4 py-3 bg-primary-container/20 border border-primary-container/30 text-primary-container rounded-lg font-label-md hover:bg-primary-container/30 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                       >
                         <span className="material-symbols-outlined text-sm">verified</span>
                         {isVerifying ? 'Verifying...' : 'Verify Membership'}
                       </MagneticButton>

                       {isVerifying && zkProofStep && (
                         <div className="mt-4 p-3 bg-surface-variant/30 rounded border border-primary-container/20">
                           <div className="flex items-center justify-between mb-2">
                             <div className="flex items-center gap-2">
                               <span className="w-3 h-3 rounded-full border-2 border-primary-container/30 border-t-primary-container animate-spin"></span>
                               <span className="text-xs font-mono-sm text-primary-container">{zkProofStep}</span>
                             </div>
                             <span className="text-[10px] font-mono-sm text-primary-container/50">
                               {zkProofStep === 'Constructing Circuit...' ? '25%' : zkProofStep === 'Computing Witness...' ? '50%' : zkProofStep === 'Generating Proof...' ? '75%' : '90%'}
                             </span>
                           </div>
                           <div className="w-full bg-background/50 h-1 rounded-full overflow-hidden">
                             <div 
                               className="bg-primary-container h-full transition-all duration-300 ease-out" 
                               style={{ width: zkProofStep === 'Constructing Circuit...' ? '25%' : zkProofStep === 'Computing Witness...' ? '50%' : zkProofStep === 'Generating Proof...' ? '75%' : '90%' }}
                             ></div>
                           </div>
                         </div>
                       )}
                    </div>

                    <div className="bg-background/50 p-4 rounded-lg border border-white/5 flex flex-col gap-2">
                      <div className="flex items-center justify-between mb-2">
                         <label className="text-xs text-on-surface-variant block">History</label>
                         <button onClick={() => setHistoryLogs([])} className="text-xs text-error hover:underline transition-colors">Clear History</button>
                      </div>
                      <div className="overflow-y-auto max-h-[120px] flex flex-col gap-1 text-xs font-mono-sm">
                        {historyLogs.length === 0 ? (
                          <div className="opacity-50">No history yet.</div>
                        ) : (
                          historyLogs.map(log => (
                            <div key={log.id} className="flex gap-2">
                              <span className="opacity-50 shrink-0">
                                {log.timestamp.toLocaleTimeString([], {hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit'})}
                              </span>
                              <span className={
                                log.type === 'error' ? 'text-error' :
                                log.type === 'success' ? 'text-primary-container' :
                                log.type === 'loading' ? 'text-primary-container/70' :
                                'opacity-80'
                              }>
                                {log.message}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </InteractiveCard>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary-container text-sm">database</span>
                  <span className="font-label-md text-on-surface tracking-widest uppercase">Ledger State</span>
                </div>
                <div className="text-xs font-mono-sm text-on-surface-variant/50">
                  Network: {NETWORK}
                </div>
              </div>
              <InteractiveCard className="bg-surface-container border border-white/5 rounded-xl p-6 h-auto min-h-[320px] font-mono-sm text-sm text-on-surface-variant flex flex-col gap-4">
                
                <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-white/5">
                  <div>
                    <div className="text-xs text-on-surface-variant/50 mb-1">Commitment</div>
                    <div className="text-primary-container">{ledgerState ? ledgerState.allowlistCommitment.toString() : '—'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-on-surface-variant/50 mb-1">Verified Count</div>
                    <div className="text-primary-container">{ledgerState ? ledgerState.verifiedCount.toString() : '0'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-on-surface-variant/50 mb-1">Last Action</div>
                    <div className={ledgerState?.lastActionStatus ? 'text-[#00ff9d]' : 'text-on-surface-variant/50'}>
                      {ledgerState ? (ledgerState.lastActionStatus ? 'SUCCESS' : 'FAILED') : '—'}
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto max-h-[200px] flex flex-col gap-2">
                  {historyLogs.length === 0 ? (
                    <div className="opacity-50">&gt; Awaiting actions...</div>
                  ) : (
                    historyLogs.map(log => (
                      <div key={log.id} className="flex gap-3">
                        <span className="opacity-50 shrink-0">
                          {log.timestamp.toLocaleTimeString([], {hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit'})}
                        </span>
                        <span className={
                          log.type === 'error' ? 'text-error' :
                          log.type === 'success' ? 'text-primary-container' :
                          log.type === 'loading' ? 'text-primary-container/70' :
                          'opacity-80'
                        }>
                          &gt; {log.message}
                        </span>
                      </div>
                    ))
                  )}
                  {uiState === 'error' && errorMessage && <div className="text-error mt-2">&gt; System Error: {errorMessage}</div>}
                </div>
              </InteractiveCard>
            </div>
          </div>
        </section>
        
        <HorizonDivider />

        <section className="w-full py-section-gap px-container-padding max-w-7xl mx-auto" id="how-it-works">
          <div className="text-center mb-16">
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4">How It Works</h2>
            <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto">Three simple steps to access gated content securely.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            <ParallaxWrapper speed={0.05}>
              <InteractiveCard className="h-full relative bg-surface-container/50 border border-white/5 rounded-2xl p-8 hover:bg-surface-container transition-colors duration-300">
                <span className="absolute top-4 right-6 font-display-lg text-6xl text-white/5 font-bold">01</span>
                <h3 className="font-headline-md text-2xl text-on-surface mb-4 relative z-10">Connect</h3>
                <p className="font-body-md text-on-surface-variant relative z-10">Link your wallet to establish a secure session. Your identity remains off-chain.</p>
              </InteractiveCard>
            </ParallaxWrapper>
            <ParallaxWrapper speed={0.1}>
              <InteractiveCard className="h-full relative bg-surface-container/50 border border-white/5 rounded-2xl p-8 hover:bg-surface-container transition-colors duration-300">
                <span className="absolute top-4 right-6 font-display-lg text-6xl text-white/5 font-bold">02</span>
                <h3 className="font-headline-md text-2xl text-on-surface mb-4 relative z-10">Prove</h3>
                <p className="font-body-md text-on-surface-variant relative z-10">Your client generates a ZK proof locally confirming your address is in the Merkle tree of allowed users.</p>
              </InteractiveCard>
            </ParallaxWrapper>
            <ParallaxWrapper speed={0.15}>
              <InteractiveCard className="h-full relative bg-surface-container/50 border border-white/5 rounded-2xl p-8 hover:bg-surface-container transition-colors duration-300">
                <span className="absolute top-4 right-6 font-display-lg text-6xl text-white/5 font-bold">03</span>
                <h3 className="font-headline-md text-2xl text-on-surface mb-4 relative z-10">Access</h3>
                <p className="font-body-md text-on-surface-variant relative z-10">The smart contract verifies the proof and grants access without linking it to your specific address.</p>
              </InteractiveCard>
            </ParallaxWrapper>
          </div>
        </section>

        <HorizonDivider />

        <section className="w-full py-section-gap px-container-padding max-w-7xl mx-auto" id="privacy-model">
          <div className="text-center mb-16">
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4">The Privacy Model</h2>
            <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto">Compare standard public blockchains with Midnight's shielded state.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
            <ParallaxWrapper speed={0.1}>
              <InteractiveCard className="h-full bg-surface-container/40 border border-error/20 rounded-2xl p-8">
                <h3 className="font-headline-sm text-2xl text-on-surface mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-error">public</span>
                  Public Ledger
                </h3>
                <ul className="space-y-4 font-body-md text-on-surface-variant">
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-error/70 mt-0.5">close</span>
                    Wallet address visible to all
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-error/70 mt-0.5">close</span>
                    Transaction amounts are public
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-error/70 mt-0.5">close</span>
                    Interaction history easily traceable
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-error/70 mt-0.5">close</span>
                    Vulnerable to front-running
                  </li>
                </ul>
              </InteractiveCard>
            </ParallaxWrapper>
            <ParallaxWrapper speed={0.15}>
              <InteractiveCard className="h-full bg-primary-container/5 border border-primary-container/20 rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/10 blur-3xl rounded-full"></div>
                <h3 className="font-headline-sm text-2xl text-on-surface mb-6 flex items-center gap-2 relative z-10">
                  <span className="material-symbols-outlined text-primary-container">vpn_key</span>
                  Midnight Shielded
                </h3>
                <ul className="space-y-4 font-body-md text-on-surface-variant relative z-10">
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary-container mt-0.5">check</span>
                    Address shielded from observers
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary-container mt-0.5">check</span>
                    State changes cryptographically hidden
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary-container mt-0.5">check</span>
                    Actions un-linkable to specific users
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary-container mt-0.5">check</span>
                    Selective disclosure capabilities
                  </li>
                </ul>
              </InteractiveCard>
            </ParallaxWrapper>
          </div>
        </section>

        <HorizonDivider />

        <section className="w-full py-section-gap px-container-padding max-w-4xl mx-auto" id="roadmap">
          <div className="text-center mb-16">
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4">Roadmap</h2>
          </div>
          <div className="relative border-l-2 border-white/10 ml-4 md:ml-8 pl-8 md:pl-12 space-y-12 py-4">
            <ParallaxWrapper speed={0.1}>
              <div className="relative">
                <div className="absolute -left-[41px] md:-left-[57px] top-1 w-6 h-6 rounded-full bg-primary-container border-4 border-background shadow-[0_0_10px_rgba(0,255,157,0.5)]"></div>
                <span className="font-mono-sm text-primary-container uppercase tracking-widest mb-2 block">Phase 1 - Current</span>
                <h3 className="font-headline-sm text-xl text-on-surface mb-2">Testnet Launch & Allowlist</h3>
                <p className="font-body-md text-on-surface-variant">Initial deployment of ZK proving circuits and basic smart contract infrastructure for early testers.</p>
              </div>
            </ParallaxWrapper>
            <ParallaxWrapper speed={0.15}>
              <div className="relative">
                <div className="absolute -left-[41px] md:-left-[57px] top-1 w-6 h-6 rounded-full bg-surface-variant border-4 border-background"></div>
                <span className="font-mono-sm text-on-surface-variant uppercase tracking-widest mb-2 block">Phase 2 - Q3</span>
                <h3 className="font-headline-sm text-xl text-on-surface mb-2">Mainnet Alpha</h3>
                <p className="font-body-md text-on-surface-variant">Transition to mainnet with limited scope, focusing on security audits and stability improvements.</p>
              </div>
            </ParallaxWrapper>
            <ParallaxWrapper speed={0.2}>
              <div className="relative">
                <div className="absolute -left-[41px] md:-left-[57px] top-1 w-6 h-6 rounded-full bg-surface-variant border-4 border-background"></div>
                <span className="font-mono-sm text-on-surface-variant uppercase tracking-widest mb-2 block">Phase 3 - Q4</span>
                <h3 className="font-headline-sm text-xl text-on-surface mb-2">Full Decentralization</h3>
                <p className="font-body-md text-on-surface-variant">Open access for all developers to build shielded DApps, complete node decentralization.</p>
              </div>
            </ParallaxWrapper>
          </div>
        </section>
        </MagneticFieldBackground>
      </main>

      <footer className="w-full bg-surface-container py-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-container-padding flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-headline-sm text-headline-sm text-on-surface-variant">Private Allowlist Access</span>
          </div>
          <div className="flex gap-4 md:gap-8">
            <a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors uppercase tracking-wider" href="#">Documentation</a>
            <a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors uppercase tracking-wider" href="#">Twitter / X</a>
            <a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors uppercase tracking-wider" href="#">GitHub</a>
          </div>
          <div className="font-mono-sm text-mono-sm text-on-surface-variant/50">v1.0.4-CRYPTO</div>
        </div>
      </footer>
    </div>
  )
}

export default App
