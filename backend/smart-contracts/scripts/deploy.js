const fs = require('fs');
const path = require('path');

const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const ctk = await ethers.getContractFactory("CarbonToken");
    const CarbonToken = await ctk.deploy();

    await CarbonToken.deployed();

    console.log("Contract Address:", CarbonToken.address);

    // Save the contract address to a file
    const addresses = {
        contractAddress: CarbonToken.address,
    };

    const addressesPath = path.join(__dirname, '../contractaddress.json');
    fs.writeFileSync(addressesPath, JSON.stringify(addresses, null, 2));

    console.log(`Contract address saved to ${addressesPath}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
