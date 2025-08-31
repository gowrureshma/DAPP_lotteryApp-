require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.28", // Ensure this matches your contract's pragma
  networks: {
    sepolia: {
      // Corrected Sepolia URL format. It should use your Infura API Key
      // and point to Infura's Sepolia endpoint, not a local IP.
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [process.env.PRIVATE_KEY]
    },
    localhost: {
      // Changed to 8545 to match the default port npx hardhat node starts on.
      // If you explicitly start your node with `npx hardhat node --port 8546`,
      // then you would set this back to 8546.
      url: "http://127.0.0.1:8545",
    }
  },
  // You can also specify the default network config for the node here if needed
  // defaultNetwork: "hardhat", // This is the default for npx hardhat node
    hardhat: {
    chainId: 31337, // Default Hardhat network chain ID
      mining: {
        auto: true,
        interval: 0
      },
      accounts: {
        count: 20,
        mnemonic: "test test test test test test test test test test test junk", // Default mnemonic
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        balance: "10000000000000000000000" // 10000 ETH
      }
    }
};
