# NFT Marketplace

ERC-20 토큰, ERC-721 NFT, Marketplace 3가지 컨트랙트를 활용한 NFT 마켓플레이스입니다.

## 추가 기능

- **MyToken (ERC-20)** — 토큰 스테이킹 (연 10% APY 보상)
- **MyNFT (ERC-721)** — EIP-2981 2차 판매 로열티 자동 정산
- **MyNFTMarketplace** — 시간 제한 경매 (입찰 / 낙찰 / 자동 환불)

## 컨트랙트 주소 (Sepolia Testnet)

| 컨트랙트 | 주소 |
|----------|------|
| MyToken | `0x4ca6c926AB6EC079422c4BEEeD926bFEbB53df51` |
| MyNFT | `0x6B921bE34a2aA0F3680CF44e8c40f79282777321` |
| MyNFTMarketplace | `0xC9966c5B1592be13f5e2F17Ea5bc7a979191b2E4` |

## 기술 스택

- Next.js 14
- Wagmi v2 + Viem
- Tailwind CSS
- Solidity ^0.8.20
- OpenZeppelin Contracts

## 실행 방법

```bash
npm install
npm run dev
```

## 배포

- GitHub: https://github.com/kkaturi14/blockchain
- Vercel: https://blockchain-nine-gold.vercel.app/
