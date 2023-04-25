import "dotenv/config";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-contract-sizer";
import "@dlsl/hardhat-markup";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.19",
        settings: {
          optimizer: {
            enabled: true,
            runs: 10000,
          },
        },
      },
    ],
  },
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts:
        process.env.PRIVATE_KEY_MAINNET !== undefined
          ? [process.env.PRIVATE_KEY_MAINNET]
          : [],
    },
    mainnet: {
      url: "https://ethereum.publicnode.com",
      chainId: 1,
      accounts:
        process.env.PRIVATE_KEY_MAINNET !== undefined
          ? [process.env.PRIVATE_KEY_MAINNET]
          : [],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./tests",
  },
  gasReporter: {
    // Enabled by default
    // enabled: process.env.REPORT_GAS !== undefined,
    token: "ETH",
    gasPriceApi:
      "https://api.etherscan.io/api?module=proxy&action=eth_gasPrice",
    currency: "USD",
  },
  markup: {
    outdir: "./docs",
    onlyFiles: ["./contracts"],
    skipFiles: [],
    noCompile: false,
    verbose: false,
  },
  contractSizer: {
    alphaSort: false,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: false,
  },
};

export default config;
