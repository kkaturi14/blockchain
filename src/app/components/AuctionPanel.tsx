'use client'

import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits, formatUnits } from 'viem'
import { tokenAddress, tokenABI, nftAddress, nftABI, marketplaceAddress, marketplaceABI } from '../contracts'

export default function AuctionPanel() {
  const { address } = useAccount()
  const [createForm, setCreateForm] = useState({ tokenId: '', startingPrice: '', durationHours: '24' })
  const [bidForm, setBidForm] = useState({ tokenId: '', bidAmount: '' })
  const [finalizeId, setFinalizeId] = useState('')
  const [viewId, setViewId] = useState('')
  const [queryId, setQueryId] = useState<bigint | undefined>()
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>()

  const { writeContract, isPending } = useWriteContract()
  const { isSuccess } = useWaitForTransactionReceipt({ hash: txHash })

  const { data: auction, refetch: refetchAuction } = useReadContract({
    address: marketplaceAddress, abi: marketplaceABI, functionName: 'getAuction',
    args: queryId !== undefined ? [queryId] : undefined, query: { enabled: queryId !== undefined },
  })

  useEffect(() => { if (isSuccess) refetchAuction() }, [isSuccess])

  async function handleCreateAuction() {
    const { tokenId, startingPrice, durationHours } = createForm
    if (!tokenId || !startingPrice || !durationHours) return
    writeContract({ address: nftAddress, abi: nftABI, functionName: 'setApprovalForAll', args: [marketplaceAddress, true] }, {
      onSuccess: () => setTimeout(() => {
        writeContract({ address: marketplaceAddress, abi: marketplaceABI, functionName: 'createAuction',
          args: [BigInt(tokenId), parseUnits(startingPrice, 18), BigInt(Number(durationHours) * 3600)] },
          { onSuccess: (h) => setTxHash(h) })
      }, 2000)
    })
  }

  async function handleBid() {
    const { tokenId, bidAmount } = bidForm
    if (!tokenId || !bidAmount) return
    const amount = parseUnits(bidAmount, 18)
    writeContract({ address: tokenAddress, abi: tokenABI, functionName: 'approve', args: [marketplaceAddress, amount] }, {
      onSuccess: () => setTimeout(() => {
        writeContract({ address: marketplaceAddress, abi: marketplaceABI, functionName: 'bid', args: [BigInt(tokenId), amount] }, { onSuccess: (h) => setTxHash(h) })
      }, 2000)
    })
  }

  async function handleFinalize() {
    if (!finalizeId) return
    writeContract({ address: marketplaceAddress, abi: marketplaceABI, functionName: 'finalizeAuction', args: [BigInt(finalizeId)] }, { onSuccess: (h) => setTxHash(h) })
  }

  function timeLeft(endTime: bigint) {
    const now = BigInt(Math.floor(Date.now() / 1000))
    if (endTime <= now) return '종료됨'
    const diff = Number(endTime - now)
    const h = Math.floor(diff / 3600), m = Math.floor((diff % 3600) / 60)
    return `${h}시간 ${m}분 남음`
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-base font-semibold text-gray-900">경매</h2>
        <p className="text-sm text-gray-500 mt-0.5">시간 제한 경매로 NFT를 판매합니다. 낙찰 시 로열티가 원작자에게 자동 정산됩니다.</p>
      </div>

      <Section title="경매 등록">
        <div className="grid grid-cols-3 gap-2">
          <input type="number" placeholder="Token ID" value={createForm.tokenId}
            onChange={(e) => setCreateForm({ ...createForm, tokenId: e.target.value })}
            className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400" />
          <input type="number" placeholder="최소 입찰가 (MTK)" value={createForm.startingPrice}
            onChange={(e) => setCreateForm({ ...createForm, startingPrice: e.target.value })}
            className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400" />
          <input type="number" placeholder="기간 (시간)" value={createForm.durationHours}
            onChange={(e) => setCreateForm({ ...createForm, durationHours: e.target.value })}
            className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400" />
        </div>
        <button onClick={handleCreateAuction} disabled={isPending}
          className="mt-2 w-full bg-gray-900 hover:bg-gray-700 text-white py-2 rounded text-sm font-medium disabled:opacity-40 transition-colors">
          경매 등록
        </button>
      </Section>

      <Section title="입찰">
        <p className="text-xs text-gray-400 mb-2">현재 최고가보다 높게 입찰해야 합니다. 패배 시 자동 환불됩니다.</p>
        <div className="flex gap-2">
          <input type="number" placeholder="Token ID" value={bidForm.tokenId}
            onChange={(e) => setBidForm({ ...bidForm, tokenId: e.target.value })}
            className="w-28 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400" />
          <input type="number" placeholder="입찰 금액 (MTK)" value={bidForm.bidAmount}
            onChange={(e) => setBidForm({ ...bidForm, bidAmount: e.target.value })}
            className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400" />
          <button onClick={handleBid} disabled={isPending}
            className="bg-gray-900 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm font-medium disabled:opacity-40 transition-colors">
            입찰
          </button>
        </div>
      </Section>

      <Section title="낙찰 처리">
        <p className="text-xs text-gray-400 mb-2">경매 종료 후 누구든 호출할 수 있습니다. 로열티 → 수수료 → 판매자 순으로 자동 정산됩니다.</p>
        <div className="flex gap-2">
          <input type="number" placeholder="Token ID" value={finalizeId}
            onChange={(e) => setFinalizeId(e.target.value)}
            className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400" />
          <button onClick={handleFinalize} disabled={isPending}
            className="bg-gray-900 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm font-medium disabled:opacity-40 transition-colors">
            낙찰 처리
          </button>
        </div>
      </Section>

      <Section title="경매 조회">
        <div className="flex gap-2">
          <input type="number" placeholder="Token ID" value={viewId}
            onChange={(e) => setViewId(e.target.value)}
            className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400" />
          <button onClick={() => setQueryId(viewId ? BigInt(viewId) : undefined)}
            className="border border-gray-200 hover:bg-gray-50 text-gray-600 px-4 py-2 rounded text-sm transition-colors">
            조회
          </button>
        </div>
        {auction && auction[5] !== undefined && (
          <div className="mt-3 bg-gray-50 border border-gray-200 rounded p-3 text-sm space-y-1">
            <Row label="판매자" value={auction[0]} mono />
            <Row label="최소 입찰가" value={`${formatUnits(auction[1], 18)} MTK`} />
            <Row label="현재 최고가" value={`${formatUnits(auction[2], 18)} MTK`} />
            <Row label="최고 입찰자" value={auction[3] === '0x0000000000000000000000000000000000000000' ? '없음' : auction[3]} mono />
            <Row label="남은 시간" value={timeLeft(auction[4])} />
            <Row label="상태" value={auction[5] ? '진행 중' : auction[6] ? '완료' : '종료'} />
          </div>
        )}
      </Section>

      {isPending && <p className="text-xs text-gray-400">트랜잭션 처리 중...</p>}
      {isSuccess && <p className="text-xs text-green-600">완료되었습니다.</p>}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">{title}</p>
      {children}
    </div>
  )
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-gray-500 shrink-0">{label}</span>
      <span className={`text-gray-900 text-right truncate ${mono ? 'font-mono text-xs' : 'font-medium'}`}>{value}</span>
    </div>
  )
}
