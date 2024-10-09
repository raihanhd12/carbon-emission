const { ethers } = require("hardhat");

async function main() {
    // Get the ContractFactory for the CarbonToken contract
    const CarbonToken = await ethers.getContractFactory("CarbonToken");

    // Deploy the contract
    const carbonToken = await CarbonToken.deploy();

    // Wait for the contract to be deployed
    await carbonToken.deployed();

    console.log("CarbonToken deployed to:", carbonToken.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
