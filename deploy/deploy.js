const hre = require("hardhat");

async function main() {
  try {
    console.log("\n🚀 Starting deployment process...\n");

    const [deployer] = await hre.ethers.getSigners();
    console.log("📝 Deploying with account:", deployer.address);
    console.log("🌐 Network:", hre.network.name);

    // Deploy the contract
    console.log("\n📦 Deploying DecentralizedFileVault contract...");
    const DecentralizedFileVault = await hre.ethers.getContractFactory("DecentralizedFileVault");
    const vault = await DecentralizedFileVault.deploy();
    await vault.waitForDeployment();

    const vaultAddress = await vault.getAddress();
    console.log("\n✅ Contract deployed successfully!");
    console.log("📄 Contract address:", vaultAddress);

    // Wait for a few blocks before verification
    console.log("\n⏳ Waiting for 5 blocks before verification...");
    await new Promise(resolve => setTimeout(resolve, 30000)); // Wait 30 seconds

    // Verify the contract
    console.log("\n🔍 Verifying contract on block explorer...");
    try {
      await hre.run("verify:verify", {
        address: vaultAddress,
        constructorArguments: []
      });
      console.log("✅ Contract verified successfully!");
    } catch (error) {
      console.error("❌ Contract verification failed:", error.message);
      console.log("\n📋 Manual Verification Info:");
      console.log("Contract Address:", vaultAddress);
      console.log("Solidity Version: 0.8.20");
      console.log("Optimizer: Enabled with 200 runs");
      console.log("EVM Version: paris");
      console.log("No constructor arguments");
    }

    console.log("\n✨ Deployment process completed!");
  } catch (error) {
    console.error("\n❌ Deployment failed:", error.message);
    if (error.stack) {
      console.error("Stack trace:", error.stack);
    }
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
