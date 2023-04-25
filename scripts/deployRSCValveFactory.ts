import { ethers } from "hardhat";

async function main() {
  const RSCValveFactory = await ethers.getContractFactory("RSCValveFactory");
  const rscValveFactory = await RSCValveFactory.deploy();
  await rscValveFactory.deployed();

  console.log("RSCValveFactory deployed to: ", rscValveFactory.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
