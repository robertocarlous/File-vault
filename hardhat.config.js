// require("@nomicfoundation/hardhat-toolbox")
// require("hardhat-deploy")
// require("hardhat-deploy-ethers")
// require("dotenv").config()

// const PRIVATE_KEY = process.env.PRIVATE_KEY
// /** @type import('hardhat/config').HardhatUserConfig */
// module.exports = {
//   solidity: {
//     version: "0.8.20",
//     settings: {
//       optimizer: {
//         enabled: true,
//         runs: 200,
//       },
//       evmVersion: "paris",
//       viaIR: false,
//     },
//   },
//   defaultNetwork: "calibrationnet",
//   networks: {
//     localnet: {
//       chainId: 31415926,
//       url: "http://127.0.0.1:1234/rpc/v1",
//       accounts: [PRIVATE_KEY],
//     },
//     calibrationnet: {
//       chainId: 314159,
//       url: "https://api.calibration.node.glif.io/rpc/v1",
//       accounts: [PRIVATE_KEY],
//     },
//     filecoinmainnet: {
//       chainId: 314,
//       url: "https://api.node.glif.io",
//       accounts: [PRIVATE_KEY],
//     },
//   },
//   paths: {
//     sources: "./contracts",
//     tests: "./test",
//     cache: "./cache",
//     artifacts: "./artifacts",
//   },
//   namedAccounts: {
//     deployer: {
//       default: 0,
//     },
//   },
//   etherscan: {
//     apiKey: {
//       calibrationnet: "5H6IA5X7UZKVZ4PK4VSJE1ZBK73K5ZHNJ6",
//     },
//     customChains: [
//       {
//         network: "calibrationnet",
//         chainId: 314159,
//         urls: {
//           apiURL: "https://calibration.filfox.info/api/v1/verify",
//           browserURL: "https://calibration.filfox.info/en"
//         }
//       }
//     ]


//   }
// }






require("@nomicfoundation/hardhat-toolbox")
require("hardhat-deploy")
require("hardhat-deploy-ethers")
require("dotenv").config()

const PRIVATE_KEY = process.env.PRIVATE_KEY
if (!PRIVATE_KEY) {
  throw new Error("Please set your PRIVATE_KEY in a .env file")
}

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      evmVersion: "paris",
      viaIR: false,
    },
  },
  defaultNetwork: "calibrationnet",
  networks: {
    localnet: {
      chainId: 31415926,
      url: "http://127.0.0.1:1234/rpc/v1",
      accounts: [PRIVATE_KEY],
    },
    calibrationnet: {
      chainId: 314159,
      url: "https://api.calibration.node.glif.io/rpc/v1",
      accounts: [PRIVATE_KEY],
    },
    filecoinmainnet: {
      chainId: 314,
      url: "https://api.node.glif.io",
      accounts: [PRIVATE_KEY],
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  sourcify: {
    enabled: true,
  },
}
