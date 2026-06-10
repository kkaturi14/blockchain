'use client'

import { useState, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect, useReadContract } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { formatUnits } from 'viem'
import StakingPanel from './components/StakingPanel'
import MintNFT from './components/MintNFT'
import AuctionPanel from './components/AuctionPanel'
import DirectMarket from './components/DirectMarket'
import { tokenAddress, tokenABI, nftAddress, nftABI } from './contracts'

type Tab = 'market' | 'auction' | 'mint' | 'staking'

const TABS: { key: Tab; label: string }[] = [
  { key: 'market',  label: '즉시 구매' },
  { key: 'auction', label: '경매' },
  { key: 'mint',    label: 'NFT 발행' },
  { key: 'staking', label: '스테이킹' },
]

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [tab, setTab] = useState<Tab>('market')

  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()

  const { data: balance } = useReadContract({
    address: tokenAddress, abi: tokenABI, functionName: 'balanceOf',
    args: address ? [address] : undefined, query: { enabled: !!address },
  })
  const { data: totalNFTs } = useReadContract({
    address: nftAddress, abi: nftABI, functionName: 'totalSupply',
  })

  useEffect(() => { setMounted(true) }, [])

  // 서버 렌더링 시 빈 껍데기만
  if (!mounted) return <div className="min-h-screen bg-[#f7f7f8]" />

  const shortAddr = (a: string) => `${a.slice(0, 6)}...${a.slice(-4)}`

  return (
    <div className="min-h-screen bg-[#f7f7f8] text-gray-900">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold tracking-tight">NFT Marketplace</span>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">Sepolia</span>
          </div>
          {isConnected && address ? (
            <div className="flex items-center gap-4">
              {balance !== undefined && (
                <span className="text-sm text-gray-500 font-mono">
                  {parseFloat(formatUnits(balance, 18)).toFixed(2)} MTK
                </span>
              )}
              <span className="text-sm font-mono text-gray-700">{shortAddr(address)}</span>
              <button onClick={() => disconnect()}
                className="text-xs text-gray-400 hover:text-gray-700 border border-gray-200 px-3 py-1.5 rounded transition-colors">
                연결 해제
              </button>
            </div>
          ) : (
            <button onClick={() => connect({ connector: injected() })}
              className="text-sm bg-gray-900 hover:bg-gray-700 text-white px-4 py-1.5 rounded transition-colors">
              지갑 연결
            </button>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {isConnected && (
          <div className="grid grid-cols-3 gap-3 mb-8">
            <StatCard label="발행된 NFT" value={totalNFTs?.toString() ?? '—'} />
            <StatCard label="내 MTK 잔액" value={balance !== undefined ? parseFloat(formatUnits(balance, 18)).toFixed(2) : '—'} />
            <StatCard label="네트워크" value="Sepolia Testnet" />
          </div>
        )}

        <div className="flex gap-1 bg-gray-200 p-1 rounded-lg mb-6 w-fit">
          {TABS.map(({ key, label }) => (
            <button key={key} onClick={() => setTab(key)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                tab === key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}>
              {label}
            </button>
          ))}
        </div>

        {!isConnected && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <p className="text-lg font-medium text-gray-800 mb-2">지갑을 연결해주세요</p>
            <p className="text-sm text-gray-400 mb-6">MetaMask 등 Web3 지갑이 필요합니다</p>
            <button onClick={() => connect({ connector: injected() })}
              className="bg-gray-900 hover:bg-gray-700 text-white px-5 py-2 rounded text-sm font-medium transition-colors">
              지갑 연결
            </button>
          </div>
        )}

        {isConnected && (
          <div>
            {tab === 'market'  && <DirectMarket />}
            {tab === 'auction' && <AuctionPanel />}
            {tab === 'mint'    && <MintNFT />}
            {tab === 'staking' && <StakingPanel />}
          </div>
        )}
      </main>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-sm font-semibold text-gray-900">{value}</p>
    </div>
  )
}
