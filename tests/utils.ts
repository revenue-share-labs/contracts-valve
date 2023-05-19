import { ethers, network } from "hardhat";

// AccessControl roles in bytes32 string
const roles = {
  defaultAdmin: ethers.constants.HashZero, // DEFAULT_ADMIN_ROLE
  admin: ethers.utils.solidityKeccak256(["string"], ["ADMIN_ROLE"]),
  distributor: ethers.utils.solidityKeccak256(["string"], ["DISTRIBUTOR_ROLE"]),
  controller: ethers.utils.solidityKeccak256(["string"], ["CONTROLLER_ROLE"]),
};

const snapshot = {
  take: async (): Promise<any> => {
    return await network.provider.request({
      method: "evm_snapshot",
      params: [],
    });
  },
  restore: async (id: string) => {
    await network.provider.request({
      method: "evm_revert",
      params: [id],
    });
  },
};

const randomSigners = (amount: number) => {
  const signers = [];
  for (let i = 0; i < amount; i++) {
    signers.push(ethers.Wallet.createRandom());
  }
  return signers;
};

export { snapshot, randomSigners, roles };
