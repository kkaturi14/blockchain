import type { Abi } from 'viem'

export const tokenAddress = '0x4ca6c926AB6EC079422c4BEEeD926bFEbB53df51' as const
export const nftAddress = '0x6B921bE34a2aA0F3680CF44e8c40f79282777321' as const
export const marketplaceAddress = '0xC9966c5B1592be13f5e2F17Ea5bc7a979191b2E4' as const

export const tokenABI = [
  { name: 'name', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'string' }] },
  { name: 'symbol', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'string' }] },
  { name: 'decimals', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint8' }] },
  { name: 'balanceOf', type: 'function', stateMutability: 'view', inputs: [{ name: 'account', type: 'address' }], outputs: [{ type: 'uint256' }] },
  { name: 'approve', type: 'function', stateMutability: 'nonpayable', inputs: [{ name: 'spender', type: 'address' }, { name: 'amount', type: 'uint256' }], outputs: [{ type: 'bool' }] },
  { name: 'transfer', type: 'function', stateMutability: 'nonpayable', inputs: [{ name: 'to', type: 'address' }, { name: 'amount', type: 'uint256' }], outputs: [{ type: 'bool' }] },
  { name: 'allowance', type: 'function', stateMutability: 'view', inputs: [{ name: 'owner', type: 'address' }, { name: 'spender', type: 'address' }], outputs: [{ type: 'uint256' }] },
  { name: 'stake', type: 'function', stateMutability: 'nonpayable', inputs: [{ name: '_amount', type: 'uint256' }], outputs: [] },
  { name: 'unstake', type: 'function', stateMutability: 'nonpayable', inputs: [], outputs: [] },
  { name: 'claimReward', type: 'function', stateMutability: 'nonpayable', inputs: [], outputs: [] },
  { name: 'pendingReward', type: 'function', stateMutability: 'view', inputs: [{ name: '_user', type: 'address' }], outputs: [{ type: 'uint256' }] },
  { name: 'getStakeInfo', type: 'function', stateMutability: 'view',
    inputs: [{ name: '_user', type: 'address' }],
    outputs: [
      { name: 'stakedAmount', type: 'uint256' },
      { name: 'stakedAt', type: 'uint256' },
      { name: 'earned', type: 'uint256' }
    ]
  },
  { name: 'totalStaked', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  { name: 'rewardRatePerSecond', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  { name: 'Staked', type: 'event', inputs: [{ name: 'user', type: 'address', indexed: true }, { name: 'amount', type: 'uint256', indexed: false }] },
  { name: 'Unstaked', type: 'event', inputs: [{ name: 'user', type: 'address', indexed: true }, { name: 'amount', type: 'uint256', indexed: false }, { name: 'reward', type: 'uint256', indexed: false }] },
  { name: 'RewardClaimed', type: 'event', inputs: [{ name: 'user', type: 'address', indexed: true }, { name: 'reward', type: 'uint256', indexed: false }] },
] as const satisfies Abi

export const nftABI = [
  { name: 'mintNFT', type: 'function', stateMutability: 'nonpayable',
    inputs: [{ name: '_tokenURI', type: 'string' }, { name: '_royaltyBps', type: 'uint96' }],
    outputs: [{ type: 'uint256' }]
  },
  { name: 'ownerOf', type: 'function', stateMutability: 'view', inputs: [{ name: 'tokenId', type: 'uint256' }], outputs: [{ type: 'address' }] },
  { name: 'tokenURI', type: 'function', stateMutability: 'view', inputs: [{ name: 'tokenId', type: 'uint256' }], outputs: [{ type: 'string' }] },
  { name: 'approve', type: 'function', stateMutability: 'nonpayable', inputs: [{ name: 'to', type: 'address' }, { name: 'tokenId', type: 'uint256' }], outputs: [] },
  { name: 'setApprovalForAll', type: 'function', stateMutability: 'nonpayable', inputs: [{ name: 'operator', type: 'address' }, { name: 'approved', type: 'bool' }], outputs: [] },
  { name: 'isApprovedForAll', type: 'function', stateMutability: 'view', inputs: [{ name: 'owner', type: 'address' }, { name: 'operator', type: 'address' }], outputs: [{ type: 'bool' }] },
  { name: 'getApproved', type: 'function', stateMutability: 'view', inputs: [{ name: 'tokenId', type: 'uint256' }], outputs: [{ type: 'address' }] },
  { name: 'totalSupply', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  { name: 'getRoyaltyInfo', type: 'function', stateMutability: 'view',
    inputs: [{ name: '_tokenId', type: 'uint256' }],
    outputs: [{ name: 'creator', type: 'address' }, { name: 'feeBasisPoints', type: 'uint96' }]
  },
  { name: 'royaltyInfo', type: 'function', stateMutability: 'view',
    inputs: [{ name: '_tokenId', type: 'uint256' }, { name: '_salePrice', type: 'uint256' }],
    outputs: [{ name: 'receiver', type: 'address' }, { name: 'royaltyAmount', type: 'uint256' }]
  },
  { name: 'defaultRoyaltyBps', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint96' }] },
  { name: 'NFTMinted', type: 'event', inputs: [{ name: 'tokenId', type: 'uint256', indexed: true }, { name: 'creator', type: 'address', indexed: true }, { name: 'tokenURI', type: 'string', indexed: false }] },
] as const satisfies Abi

export const marketplaceABI = [
  { name: 'listNFT', type: 'function', stateMutability: 'nonpayable', inputs: [{ name: '_tokenId', type: 'uint256' }, { name: '_price', type: 'uint256' }], outputs: [] },
  { name: 'buyNFT', type: 'function', stateMutability: 'nonpayable', inputs: [{ name: '_tokenId', type: 'uint256' }], outputs: [] },
  { name: 'cancelListing', type: 'function', stateMutability: 'nonpayable', inputs: [{ name: '_tokenId', type: 'uint256' }], outputs: [] },
  { name: 'getListing', type: 'function', stateMutability: 'view',
    inputs: [{ name: '_tokenId', type: 'uint256' }],
    outputs: [{ name: 'price', type: 'uint256' }, { name: 'seller', type: 'address' }, { name: 'isListed', type: 'bool' }]
  },
  { name: 'createAuction', type: 'function', stateMutability: 'nonpayable',
    inputs: [{ name: '_tokenId', type: 'uint256' }, { name: '_startingPrice', type: 'uint256' }, { name: '_durationSecs', type: 'uint256' }],
    outputs: []
  },
  { name: 'bid', type: 'function', stateMutability: 'nonpayable',
    inputs: [{ name: '_tokenId', type: 'uint256' }, { name: '_bidAmount', type: 'uint256' }],
    outputs: []
  },
  { name: 'finalizeAuction', type: 'function', stateMutability: 'nonpayable', inputs: [{ name: '_tokenId', type: 'uint256' }], outputs: [] },
  { name: 'cancelAuction', type: 'function', stateMutability: 'nonpayable', inputs: [{ name: '_tokenId', type: 'uint256' }], outputs: [] },
  { name: 'getAuction', type: 'function', stateMutability: 'view',
    inputs: [{ name: '_tokenId', type: 'uint256' }],
    outputs: [
      { name: 'seller', type: 'address' },
      { name: 'startingPrice', type: 'uint256' },
      { name: 'highestBid', type: 'uint256' },
      { name: 'highestBidder', type: 'address' },
      { name: 'endTime', type: 'uint256' },
      { name: 'isActive', type: 'bool' },
      { name: 'finalized', type: 'bool' }
    ]
  },
  { name: 'feePercentage', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  { name: 'feeRecipient', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'address' }] },
  { name: 'NFTListed', type: 'event', inputs: [{ name: 'tokenId', type: 'uint256', indexed: true }, { name: 'seller', type: 'address', indexed: true }, { name: 'price', type: 'uint256', indexed: false }] },
  { name: 'NFTBought', type: 'event', inputs: [{ name: 'tokenId', type: 'uint256', indexed: true }, { name: 'buyer', type: 'address', indexed: true }, { name: 'price', type: 'uint256', indexed: false }] },
  { name: 'AuctionCreated', type: 'event', inputs: [{ name: 'tokenId', type: 'uint256', indexed: true }, { name: 'seller', type: 'address', indexed: true }, { name: 'startingPrice', type: 'uint256', indexed: false }, { name: 'endTime', type: 'uint256', indexed: false }] },
  { name: 'BidPlaced', type: 'event', inputs: [{ name: 'tokenId', type: 'uint256', indexed: true }, { name: 'bidder', type: 'address', indexed: true }, { name: 'amount', type: 'uint256', indexed: false }] },
  { name: 'AuctionFinalized', type: 'event', inputs: [{ name: 'tokenId', type: 'uint256', indexed: true }, { name: 'winner', type: 'address', indexed: true }, { name: 'finalPrice', type: 'uint256', indexed: false }] },
  { name: 'RoyaltyPaid', type: 'event', inputs: [{ name: 'tokenId', type: 'uint256', indexed: true }, { name: 'creator', type: 'address', indexed: true }, { name: 'amount', type: 'uint256', indexed: false }] },
] as const satisfies Abi
