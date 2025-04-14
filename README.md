# Decentralized Voting System

A secure, transparent, and decentralized voting platform built on **Ethereum blockchain** using **Solidity**, **React**, and **IPFS**. This system allows users to create elections, add candidates, cast votes, and view real-time results—all powered by smart contracts and a fully on-chain infrastructure.

---

## 🚀 Features

- 📜 **Create Elections** with a title, description, and duration.
- 🢑 **Add Candidates** including image upload via IPFS (Pinata).
- ✅ **Cast Votes** securely through MetaMask and Ethereum.
- 🔍 **View Results** in real-time, including graphical vote representation.
- 🔐 **Role-Based Access Control** (RBAC) for creators, voters, and observers.
- 📊 **Dashboard Stats** showing total elections, votes cast, active elections, and voters.

---

## 🛀 Tech Stack

| Layer         | Technology              |
|---------------|--------------------------|
| Smart Contracts | Solidity + Hardhat      |
| Frontend     | React + TypeScript + Vite|
| Wallet       | MetaMask + Ethers.js     |
| Storage      | IPFS via Pinata          |
| Blockchain   | Ethereum Sepolia Testnet |

---

## 📦 Folder Structure

```
BLOCKCHAINBASEDVOTINGSYSTEM/
├── voting-dapp/                # Hardhat project for smart contracts
│   ├── contracts/              # Contains VotingFactory.sol, Election.sol, etc.
│   ├── scripts/                # Deployment scripts (e.g., deploy.js)
│   ├── test/                   # Contract tests (optional)
│   ├── hardhat.config.ts       # Hardhat configuration
│   ├── flattened.sol           # Flattened contract (optional for verification)
│   ├── .env.template           # Example environment for Hardhat
│   └── README.md               # Project documentation (this file)
│
├── voting-dapp_fe/            # Frontend project using Vite + React
│   ├── src/                    # Source code (pages, components, hooks, utils)
│   ├── index.html              # Root HTML file
│   ├── vite.config.ts          # Vite configuration
│   ├── tailwind.config.js      # Tailwind CSS configuration
│   ├── .env.template           # Example environment for frontend
│   └── package.json            # Frontend dependencies
```

---

## ⚙️ Prerequisites

- Node.js (>= v16)
- MetaMask browser extension
- Git + Code editor
- [Infura](https://infura.io/) or [Alchemy](https://www.alchemy.com/) Sepolia RPC endpoint
- [Pinata](https://app.pinata.cloud/) for IPFS uploads
- Etherscan API key (optional for verification)

---

## 🔐 Environment Variables

### 🌐 Frontend (`voting-dapp_fe/.env`)
```env
VITE_DEPLOYED_CONTRACT_ADDRESS=<CONTRACT_ADDRESS_AFTER_DEPLOYING_TO_BLOCKCHAIN>
VITE_PINATA_JWT_TOKEN=<PINATA_JWT_TOKEN_FOR_IPFS>
```

### 🔗 Backend & Deployment (`voting-dapp/.env` for Hardhat)
```env
SEPOLIA_RPC_URL=<YOUR_SEPOLIA_RPC_URL>
PRIVATE_KEY=<YOUR_WALLET_PRIVATE_KEY>
DEPLOYED_CONTRACT_ADDRESS=<CONTRACT_ADDRESS_AFTER_DEPLOYMENT>
ETHERSCAN_API_KEY=<YOUR_ETHERSCAN_API_KEY>
```

**Never commit .env files to version control!**

---

## 🧪 Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/your-username/blockchainbasedvotingsystem.git
cd blockchainbasedvotingsystem
```

### 2. Install dependencies
```bash
cd voting-dapp
npm install
cd ../voting-dapp_fe
npm install
```

### 3. Setup environment variables
- Copy `.env.template` to `.env` in both folders and fill in values
- Get your Pinata JWT token from: https://app.pinata.cloud/developer
- Get Sepolia ETH via [Sepolia Faucet](https://sepoliafaucet.com/)

### 4. Compile & deploy contracts
```bash
cd voting-dapp
npx hardhat compile
npx hardhat run scripts/deploy.ts --network sepolia
```

### 5. Start the frontend
```bash
cd ../voting-dapp_fe
npm run dev
```
Visit: [http://localhost:5173](http://localhost:5173)

---

## ✅ Usage Guide

- **Create Election:** Provide title, description, duration
- **Add Candidates:** Upload candidate images to IPFS and set names
- **Cast Vote:** Confirm voting through MetaMask wallet
- **Dashboard:** Monitor election status, stats, and results

---

## 🧠 Role-Based Access

- **Admin**: Default deployer; can assign roles
- **Creator**: Can create elections and view vote records
- **Voter**: Can vote (optional enforcement)
- **Observer**: Read-only access

Roles are managed in `RoleManager.sol` via OpenZeppelin's `AccessControl`.

---

## 💄 License
MIT License

---

## 👨‍💼 Author
Made with ❤️ by [Your Name] · [GitHub](https://github.com/your-username)

> For issues or feature requests, open an issue or pull request.

