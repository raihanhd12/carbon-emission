require("@matterlabs/hardhat-zksync-solc");
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

module.exports = {
  zksolc: {
    version: "1.3.9",
    compilerSource: "binary",
    settings: {
      optimizer: {
        enabled: true,
      },
    },
  },
  networks: {
    besu: {
      // url: "http://localhost:8545",
      url: "http://127.0.0.1:8545",
      accounts: [
        process.env.PRIVATE_KEY_SUPERADMIN,
      ],
      gasPrice: 0,
      gas: 0x1ffffffffffffe,
      chainId: 1337,
    },
    zksync_testnet: {
      url: "https://zksync2-testnet.zksync.dev",
      ethNetwork: "goerli",
      chainId: 280,
      zksync: true,
    },
    zksync_mainnet: {
      url: "https://zksync2-mainnet.zksync.io/",
      ethNetwork: "mainnet",
      chainId: 324,
      zksync: true,
    },
    sepolia: { // Add Sepolia network configuration
      url: "https://11155111.rpc.thirdweb.com", // Sepolia RPC endpoint
      accounts: [process.env.PRIVATE_KEY_SUPERADMIN], // Private key from .env file
      chainId: 11155111, // Sepolia's chain ID
    },
  },
  paths: {
    artifacts: "./artifacts-zk",
    cache: "./cache-zk",
    sources: "./contracts",
    tests: "./test",
  },
  solidity: {
    version: "0.8.17",
    settings: {
      evmVersion: "london", // required for Besu
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
};
