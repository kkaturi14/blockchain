'use client'

import { useState } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { nftAddress, nftABI } from '../contracts'

export default function MintNFT({ onMinted }: { onMinted?: () => void }) {
  const [tokenURI, setTokenURI] = useState('')
  const [royaltyBps, setRoyaltyBps] = useState(500)
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>()

  const { writeContract, isPending } = useWriteContract()
  const { isSuccess } = useWaitForTransactionReceipt({ hash: txHash })

  async function handleMint() {
    if (!tokenURI) return
    writeContract(
      {
        address: nftAddress,
        abi: nftABI,
        functionName: 'mintNFT',
        args: [tokenURI, BigInt(royaltyBps)],
      },
      {
        onSuccess: (hash) => {
          setTxHash(hash)
          onMinted?.()
        },
      },
    )
  }

  const royaltyPercent = (royaltyBps / 100).toFixed(1)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-gray-900">NFT 발행</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          NFT를 발행하고 2차 판매 로열티 비율을 설정합니다.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">
            메타데이터 URI
          </label>
          <input
            type="text"
            placeholder="ipfs://Qm..."
            value={tokenURI}
            onChange={(e) => setTokenURI(e.target.value)}
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-medium text-gray-500">
              로열티 비율
            </label>
            <span className="text-sm font-semibold text-gray-900">
              {royaltyPercent}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={1000}
            step={50}
            value={royaltyBps}
            onChange={(e) => setRoyaltyBps(Number(e.target.value))}
            className="w-full accent-gray-900"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0%</span>
            <span>5% 권장</span>
            <span>10%</span>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded p-3 text-xs text-gray-500">
          EIP-2981 표준 — 재판매 시 판매금액의 {royaltyPercent}%가 원작자에게
          자동 지급됩니다.
        </div>
      </div>

      <button
        onClick={handleMint}
        disabled={isPending || !tokenURI}
        className="w-full bg-gray-900 hover:bg-gray-700 text-white py-2.5 rounded text-sm font-medium disabled:opacity-40 transition-colors"
      >
        {isPending ? '처리 중...' : 'NFT 발행'}
      </button>

      {isSuccess && (
        <p className="text-xs text-green-600">NFT가 발행되었습니다.</p>
      )}
    </div>
  )
}
