import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { RSCValveFactory, RSCValveFactory__factory } from "../typechain-types";
import { roles, snapshot } from "./utils";

describe("RSCValveFactory", () => {
  let rscValveFactory: RSCValveFactory,
    owner: SignerWithAddress,
    alice: SignerWithAddress,
    snapId: string;

  before(async () => {
    [owner, alice] = await ethers.getSigners();
    rscValveFactory = await new RSCValveFactory__factory(owner).deploy();
  });

  beforeEach(async () => {
    snapId = await snapshot.take();
  });

  afterEach(async () => {
    await snapshot.restore(snapId);
  });

  describe("Deployment", () => {
    it("Should set the correct owner of the contract", async () => {
      expect(await rscValveFactory.hasRole(roles.defaultAdmin, owner.address))
        .to.be.true;
    });

    it("Should deploy RSC Valve Implementation", async () => {
      expect(await rscValveFactory.contractImplementation()).not.to.be.empty;
    });
  });

  describe("Predict deterministic address", () => {
    it("Predicts address correctly", async () => {
      const AbiCoder = new ethers.utils.AbiCoder();
      const salt = ethers.utils.keccak256(
        AbiCoder.encode(
          [
            "address",
            "address[]",
            "bool",
            "bool",
            "uint256",
            "tuple(address addrs, uint256 percentage)[]",
            "bytes32",
            "address",
          ],
          [
            owner.address,
            [owner.address],
            false,
            true,
            0,
            [{ addrs: owner.address, percentage: 10000000 }],
            ethers.constants.HashZero,
            owner.address,
          ]
        )
      );

      const creationCode = [
        "0x3d602d80600a3d3981f3363d3d373d3d3d363d73",
        (await rscValveFactory.contractImplementation())
          .replace(/0x/, "")
          .toLowerCase(),
        "5af43d82803e903d91602b57fd5bf3",
      ].join("");

      const create2Addr = ethers.utils.getCreate2Address(
        rscValveFactory.address,
        salt,
        ethers.utils.keccak256(creationCode)
      );

      expect(
        await rscValveFactory.predictDeterministicAddress(
          {
            controller: owner.address,
            distributors: [owner.address],
            isImmutableRecipients: false,
            isAutoNativeCurrencyDistribution: true,
            minAutoDistributeAmount: 0,
            recipients: [{ addrs: owner.address, percentage: 10000000 }],
            creationId: ethers.constants.HashZero,
          },
          owner.address
        )
      ).to.be.equal(create2Addr);
    });
  });

  it("setPlatformWallet()", async () => {
    await expect(
      rscValveFactory.setPlatformWallet(ethers.constants.AddressZero)
    ).to.be.revertedWithCustomError(rscValveFactory, "NullAddressError");
  });

  it("setPlatformFee()", async () => {
    await expect(
      rscValveFactory.connect(alice).setPlatformFee(2500000)
    ).to.be.revertedWith(
      `AccessControl: account ${alice.address.toLowerCase()} is missing role ${
        roles.defaultAdmin
      }`
    );

    await rscValveFactory.setPlatformFee(2500000);
    expect(await rscValveFactory.platformFee()).to.be.equal(2500000);
    await expect(
      rscValveFactory.setPlatformFee(5100000)
    ).to.be.revertedWithCustomError(rscValveFactory, "InvalidPercentageError");

    expect(await rscValveFactory.platformFee()).to.be.equal(2500000);

    await expect(
      rscValveFactory.setPlatformFee(2500000)
    ).to.be.revertedWithCustomError(rscValveFactory, "InvalidPercentageError");
    expect(await rscValveFactory.platformFee()).to.be.equal(2500000);
  });
});
