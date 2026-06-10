'use client'

import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits, formatUnits } from 'viem'
import { tokenAddress, tokenABI } from '../contracts'

export default function StakingPanel() {
  const { address } = useAccount()
  const [stakeAmount, setStakeAmount] = useState('')
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>()

  const { writeContract, isPending } = useWriteContract()
  const { isSuccess } = useWaitForTransactionReceipt({ hash: txHash })

  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: tokenAddress, abi: tokenABI, functionName: 'balanceOf',
    args: address ? [address] : undefined, query: { enabled: !!address },
  })

  const { data: stakeInfo, refetch: refetchStake } = useReadContract({
    address: tokenAddress, abi: tokenABI, functionName: 'getStakeInfo',
    args: address ? [address] : undefined, query: { enabled: !!address },
  })

  const { data: totalStaked } = useReadContract({
    address: tokenAddress, abi: tokenABI, functionName: 'totalStaked',
  })

  useEffect(() => {
    if (isSuccess) { refetchBalance(); refetchStake(); setStakeAmount('') }
  }, [isSuccess])

  const stakedAmount = stakeInfo ? stakeInfo[0] : 0n
  const earned = stakeInfo ? stakeInfo[2] : 0n
  const fmt = (v: bigint | undefined) => v !== undefined ? parseFloat(formatUnits(v, 18)).toFixed(4) : '—'

  async function handleStake() {
    if (!stakeAmount || !address) return
    const amount = parseUnits(stakeAmount, 18)
    writeContract({ address: tokenAddress, abi: tokenABI, functionName: 'approve', args: [tokenAddress, amount] }, {
      onSuccess: () => setTimeout(() => {
        writeContract({ address: tokenAddress, abi: tokenABI, functionName: 'stake', args: [amount] }, { onSuccess: (h) => setTxHash(h) })
      }, 2000)
    })
  }

  async function handleUnstake() {
    writeContract({ address: tokenAddress, abi: tokenABI, functionName: 'unstake' }, { onSuccess: (h) => setTxHash(h) })
  }

  async function handleClaim() {
    writeContract({ address: tokenAddress, abi: tokenABI, functionName: 'claimReward' }, { onSuccess: (h) => setTxHash(h) })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-gray-900">스테이킹</h2>
        <p className="text-sm text-gray-500 mt-0.5">MTK를 스테이킹하면 연 10% APY 보상이 자동으로 누적됩니다.</p>
      </div>

      {/* 정보 카드 */}
      <div className="grid grid-cols-3 gap-3">
        <InfoCard label="잔액" value={`${fmt(balance)} MTK`} />
        <InfoCard label="스테이킹 중" value={`${fmt(stakedAmount)} MTK`} accent />
        <InfoCard label="누적 보상" value={`${fmt(earned)} MTK`} />
      </div>
      <p className="text-xs text-gray-400">전체 TVL: {fmt(totalStaked)} MTK</p>

      {/* 스테이킹 입력 */}
      <div className="flex gap-2">
        <input
          type="number" placeholder="수량 입력"
          value={stakeAmount} onChange={(e) => setStakeAmount(e.target.value)}
          className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
        />
        <button onClick={handleStake} disabled={isPending || !stakeAmount}
          className="bg-gray-900 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm font-medium disabled:opacity-40 transition-colors">
          스테이킹
        </button>
      </div>

      <div className="flex gap-2">
        <button onClick={handleClaim} disabled={isPending || !earned}
          className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-700 py-2 rounded text-sm font-medium disabled:opacity-40 transition-colors">
          보상 수령 ({fmt(earned)} MTK)
        </button>
        <button onClick={handleUnstake} disabled={isPending || !stakedAmount}
          className="flex-1 border border-red-200 hover:bg-red-50 text-red-600 py-2 rounded text-sm font-medium disabled:opacity-40 transition-colors">
          언스테이킹
        </button>
      </div>

      {isPending && <p className="text-xs text-gray-400">트랜잭션 처리 중...</p>}
      {isSuccess && <p className="text-xs text-green-600">완료되었습니다.</p>}
    </div>
  )
}

function InfoCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className={`text-sm font-semibold ${accent ? 'text-gray-900' : 'text-gray-700'}`}>{value}</p>
    </div>
  )
}
