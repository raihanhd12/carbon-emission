require("@matterlabs/hardhat-zksync-solc");
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */

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
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
};
