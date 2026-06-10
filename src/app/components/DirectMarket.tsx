'use client'

import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits, formatUnits } from 'viem'
import { tokenAddress, tokenABI, nftAddress, nftABI, marketplaceAddress, marketplaceABI } from '../contracts'

export default function DirectMarket() {
  const { address } = useAccount()
  const [listForm, setListForm] = useState({ tokenId: '', price: '' })
  const [buyId, setBuyId] = useState('')
  const [cancelId, setCancelId] = useState('')
  const [viewId, setViewId] = useState('')
  const [queryId, setQueryId] = useState<bigint | undefined>()
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>()

  const { writeContract, isPending } = useWriteContract()
  const { isSuccess } = useWaitForTransactionReceipt({ hash: txHash })

  const { data: listing, refetch } = useReadContract({
    address: marketplaceAddress, abi: marketplaceABI, functionName: 'getListing',
    args: queryId !== undefined ? [queryId] : undefined, query: { enabled: queryId !== undefined },
  })

  useEffect(() => { if (isSuccess) refetch() }, [isSuccess])

  async function handleList() {
    const { tokenId, price } = listForm
    if (!tokenId || !price) return
    writeContract({ address: nftAddress, abi: nftABI, functionName: 'setApprovalForAll', args: [marketplaceAddress, true] }, {
      onSuccess: () => setTimeout(() => {
        writeContract({ address: marketplaceAddress, abi: marketplaceABI, functionName: 'listNFT', args: [BigInt(tokenId), parseUnits(price, 18)] }, { onSuccess: (h) => setTxHash(h) })
      }, 2000)
    })
  }

  async function handleBuy() {
    if (!buyId || !listing) return
    writeContract({ address: tokenAddress, abi: tokenABI, functionName: 'approve', args: [marketplaceAddress, listing[0]] }, {
      onSuccess: () => setTimeout(() => {
        writeContract({ address: marketplaceAddress, abi: marketplaceABI, functionName: 'buyNFT', args: [BigInt(buyId)] }, { onSuccess: (h) => setTxHash(h) })
      }, 2000)
    })
  }

  async function handleCancel() {
    if (!cancelId) return
    writeContract({ address: marketplaceAddress, abi: marketplaceABI, functionName: 'cancelListing', args: [BigInt(cancelId)] }, { onSuccess: (h) => setTxHash(h) })
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-base font-semibold text-gray-900">즉시 구매</h2>
        <p className="text-sm text-gray-500 mt-0.5">고정 가격으로 NFT를 등록하거나 구매합니다. 거래 시 로열티가 원작자에게 자동 지급됩니다.</p>
      </div>

      <Section title="판매 등록">
        <div className="flex gap-2">
          <input type="number" placeholder="Token ID" value={listForm.tokenId}
            onChange={(e) => setListForm({ ...listForm, tokenId: e.target.value })}
            className="w-28 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400" />
          <input type="number" placeholder="판매가 (MTK)" value={listForm.price}
            onChange={(e) => setListForm({ ...listForm, price: e.target.value })}
            className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400" />
          <button onClick={handleList} disabled={isPending}
            className="bg-gray-900 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm font-medium disabled:opacity-40 transition-colors">
            등록
          </button>
        </div>
      </Section>

      <Section title="NFT 구매">
        <div className="flex gap-2">
          <input type="number" placeholder="Token ID" value={buyId}
            onChange={(e) => setBuyId(e.target.value)}
            className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400" />
          <button onClick={() => setQueryId(buyId ? BigInt(buyId) : undefined)}
            className="border border-gray-200 hover:bg-gray-50 text-gray-600 px-3 py-2 rounded text-sm transition-colors">
            조회
          </button>
          <button onClick={handleBuy} disabled={isPending || !listing?.[2]}
            className="bg-gray-900 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm font-medium disabled:opacity-40 transition-colors">
            구매
          </button>
        </div>
        {listing && listing[2] && (
          <div className="mt-3 bg-gray-50 border border-gray-200 rounded p-3 text-sm">
            <p className="text-gray-500">판매가: <span className="font-semibold text-gray-900">{formatUnits(listing[0], 18)} MTK</span></p>
            <p className="text-gray-500 mt-1">판매자: <span className="font-mono text-xs text-gray-700">{listing[1]}</span></p>
          </div>
        )}
        {listing && !listing[2] && queryId !== undefined && (
          <p className="mt-2 text-xs text-gray-400">판매 중인 NFT가 아닙니다.</p>
        )}
      </Section>

      <Section title="판매 취소">
        <div className="flex gap-2">
          <input type="number" placeholder="Token ID" value={cancelId}
            onChange={(e) => setCancelId(e.target.value)}
            className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400" />
          <button onClick={handleCancel} disabled={isPending}
            className="border border-red-200 hover:bg-red-50 text-red-600 px-4 py-2 rounded text-sm font-medium disabled:opacity-40 transition-colors">
            취소
          </button>
        </div>
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
