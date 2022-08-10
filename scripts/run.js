// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
// const { ethers } = require("ethers");
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  [signer1, signer2] = await hre.ethers.getSigners();
  console.log("Singer 1 :",signer1.address," : Signer2 : ",signer2.address)
  // We get the contract to deploy
  const Bank = await hre.ethers.getContractFactory("Bank", signer1);
  // const baseTokenURI = "ipfs://QmeLJALSfvBfvahxqYewjUFm4SKTsd3ZhbmzSNhRnj8AtU/";s
  // const _name = "Disco Lion";
  // const _symbol = "LION";
  // const roboPunksNFT = await RoboPunksNFT.deploy(baseTokenURI);
  const bank = await Bank.deploy();
  await bank.deployed();

  console.log("Bank Contract is deployed at ", bank.address,"by",signer1.address);

  const Matic = await hre.ethers.getContractFactory("Matic", signer2);
  const matic = await Matic.deploy();
  await matic.deployed();
  console.log("Matic contract is deployed at ", matic.address,"by",signer2.address);
  
  const Shib = await hre.ethers.getContractFactory("Shib", signer2);
  const shib = await Shib.deploy();
  await shib.deployed();
  console.log("Shib contract is deployed at ", shib.address,"by",signer2.address);
  
  const Usdt = await hre.ethers.getContractFactory("Usdt", signer2);
  const usdt = await Usdt.deploy();
  await usdt.deployed();
  console.log("Usdt contract is deployed at ", usdt.address,"by",signer2.address);
  
  // Whitelist Tokens
  const mtrx = await bank.whitelistToken(
    hre.ethers.utils.formatBytes32String('Matic'),
    matic.address
  );
  await mtrx.wait();

  const strx = await bank.whitelistToken(
    hre.ethers.utils.formatBytes32String('Shib'),
    shib.address
  );
  await strx.wait();

  const utrx = await bank.whitelistToken(
    hre.ethers.utils.formatBytes32String('Usdt'),
    usdt.address
  );
  await utrx.wait();

  const etrx = await bank.whitelistToken(
    hre.ethers.utils.formatBytes32String('Eth'),
    '0x09B5DC75789389d1627879bA194874F459364859'
  );
  await etrx.wait();

  // await txn.wait();
  // console.log("10 NFTs have been reserved");

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
