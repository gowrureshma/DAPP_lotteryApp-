# Mdlottery DApp

A decentralized lottery application built on Ethereum using Solidity smart contracts, Hardhat for development and testing, and a web frontend for user interaction via MetaMask.

## Features

- **Decentralized Lottery**: Players can participate by sending more than 1 ETH to the contract.
- **Manager-Controlled Winner Selection**: Only the contract manager can pick a winner once there are at least 3 players.
- **Real-Time Updates**: Frontend listens to contract events for live updates on participation and winner selection.
- **MetaMask Integration**: Connect your MetaMask wallet to interact with the lottery.
- **Local Development**: Run on Hardhat's local network for testing.
- **Testnet Deployment**: Deploy to Sepolia testnet using Infura.

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [MetaMask](https://metamask.io/) browser extension
- [Hardhat](https://hardhat.org/) (installed via npm)
- Ethereum wallet with test ETH (for Sepolia testnet)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd dapp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
INFURA_API_KEY=your_infura_api_key_here
PRIVATE_KEY=your_private_key_here
```

- **INFURA_API_KEY**: Get from [Infura](https://infura.io/) for Sepolia testnet access.
- **PRIVATE_KEY**: Your Ethereum wallet private key (never share this in production).

## Quick Start

To get the project running locally:

```bash
# Install dependencies
npm install

# Start local Hardhat node
npx hardhat node

# Deploy contract (in another terminal)
npx hardhat run scripts/deploy.js --network localhost

# Open index.html in browser and connect MetaMask to localhost:8545
```

## Usage

### Local Development

1. Start Hardhat local node:
   ```bash
   npx hardhat node
   ```

2. Deploy the contract locally:
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```

3. Open `index.html` in your browser and connect MetaMask to the local network (Chain ID: 31337).

### Testnet Deployment

1. Deploy to Sepolia testnet:
   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```

2. Update the contract address in `index.html` (line 363) with the deployed address.

3. Switch MetaMask to Sepolia testnet and interact with the DApp.

### Testing

Run the test suite:
```bash
npx hardhat test
```

Run tests with gas reporting:
```bash
REPORT_GAS=true npx hardhat test
```

## Smart Contract Details

- **Contract**: `Mdlottery.sol`
- **Solidity Version**: ^0.8.0
- **Key Functions**:
  - `participate()`: Enter the lottery by sending >1 ETH.
  - `pickWinner()`: Manager selects a winner (requires >=3 players).
  - `getPlayers()`: View current players.
  - `getContractBalance()`: Check contract balance.

## Frontend

- Built with HTML, CSS (Tailwind), and JavaScript.
- Uses Ethers.js v5 for blockchain interaction.
- Connects to MetaMask for wallet management.
- Displays real-time contract data and handles transactions.

## Security Notes

⚠️ **Important**: The randomness in `pickWinner()` is pseudo-random and insecure for production use. It relies on `block.timestamp` and `block.prevrandao`, which miners can manipulate. For production, use a secure oracle like Chainlink VRF.

## Project Structure

```
dapp/
├── contracts/
│   └── Mdlottery.sol          # Smart contract
├── scripts/
│   └── deploy.js              # Deployment script
├── test/
│   └── Mdlottery.js           # Contract tests
├── index.html                 # Frontend
├── hardhat.config.js          # Hardhat configuration
├── package.json               # Dependencies
└── README.md                  # This file
```

## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Run tests.
5. Submit a pull request.

## License

ISC License - see package.json for details.

## Disclaimer

This is a demo project for educational purposes. Use at your own risk. Always test thoroughly before deploying to mainnet.
